import pandas as pd
from io import BytesIO
from sqlmodel import Session, select
from datetime import datetime
from typing import Optional
from pathlib import Path

from ..models import Sales, Upload, User, Product
from .prediction.unified_prediction_service import UnifiedPredictionService

from app.models import Stock
from app.services.stock import populate_stock_from_product

def upsert_products_from_df(df, user, session):
    # Only take the required fields, and make sure they are all lowercase.
    df = df[["date", "item_nbr", "item_name", "category"]].copy()
    df.columns = df.columns.str.lower()
    df["store_nbr"] = user.store_nbr

    for _, row in df.iterrows():
        key_store = user.store_nbr
        key_item = int(row["item_nbr"])
        date_val = pd.to_datetime(row["date"]).date()
        item_name = str(row["item_name"]) if not pd.isnull(row["item_name"]) else None
        category = str(row["category"]) if not pd.isnull(row["category"]) else None

        # Search existing product records (unique index store_nbr + item_nbr)
        existing = session.exec(
            select(Product)
            .where(Product.store_nbr == key_store)
            .where(Product.item_nbr == key_item)
        ).first()

        if existing:
            # Only update the date to the latest date, otherwise leave it unchanged.
            if date_val > existing.date:
                existing.date = date_val
        else:
            session.add(Product(
                store_nbr=key_store,
                item_nbr=key_item,
                item_name=item_name,
                item_category=category,
                date=date_val
            ))
    session.commit()


async def process_upload_file(
    file,
    user: User,
    session: Session,
    prediction_type: str = "today",
    return_df: bool = False  # allow return df
) -> dict:
    content = await file.read()
    filename = file.filename.lower()

    # 1. Read the uploaded content
    if filename.endswith('.csv'):
        df = pd.read_csv(BytesIO(content), encoding="utf-8")
    elif filename.endswith('.xlsx') or filename.endswith('.xls'):
        df = pd.read_excel(BytesIO(content))
    else:
        raise Exception("Unsupported file format")

    # 2. Standardize column names
    df.columns = df.columns.str.strip().str.lower()

    # 3. Force store_nbr to use the current user's store_nbr for all rows
    df["store_nbr"] = user.store_nbr

    # 4. Validate required fields
    required_columns = {
        "date", "item_nbr", "unit_sales", "onpromotion",
        "category", "holiday", "item_class", "perishable", "price", "cost_price"
    }
    missing_cols = required_columns - set(df.columns)
    if missing_cols:
        raise Exception(f"Missing columns: {missing_cols}")
    
    # Insert or update rows in the Product table (upsert)
    upsert_products_from_df(df, user, session)
    populate_stock_from_product(session)

    # 5. Insert or update rows in the Sales table (upsert)
    rows_upserted = 0
    for _, row in df.iterrows():
        key_date = pd.to_datetime(row["date"]).date()
        key_store = user.store_nbr
        key_item = int(row["item_nbr"])

        existing = session.exec(
            select(Sales)
            .where(Sales.date == key_date)
            .where(Sales.store_nbr == key_store)
            .where(Sales.item_nbr == key_item)
        ).first()

        new_values = dict(
            date=key_date,
            store_nbr=key_store,
            item_nbr=key_item,
            unit_sales=float(row["unit_sales"]),
            onpromotion=bool(int(row["onpromotion"])) if not pd.isnull(row["onpromotion"]) else None,
            category=str(row["category"]) if not pd.isnull(row["category"]) else None,
            holiday=int(row["holiday"]) if not pd.isnull(row["holiday"]) else None,
            item_class=int(row["item_class"]) if not pd.isnull(row["item_class"]) else None,
            perishable=int(row["perishable"]) if not pd.isnull(row["perishable"]) else None,
            price=float(row["price"]) if not pd.isnull(row["price"]) else None,
            cost_price=float(row["cost_price"]) if not pd.isnull(row["cost_price"]) else None,
        )

        if existing:
            for k, v in new_values.items():
                setattr(existing, k, v)
        else:
            session.add(Sales(**new_values))

        rows_upserted += 1

    # 6. Record the upload
    upload = Upload(
        user_id=user.id,
        filename=file.filename,
        status="processed",
        row_count=rows_upserted,
        store_nbr=user.store_nbr
    )
    session.add(upload)
    session.commit()

    # 7. Run model prediction
    base_dir = Path(__file__).resolve().parents[2]  # points to backend/
    model_path = base_dir / "app" / "models" / "my_saved_model_resaved"

    if not model_path.exists():
        raise Exception(f"Model directory not found: {model_path}")

    predictor = UnifiedPredictionService(model_dir=str(model_path))

    prediction_result = predictor.predict(
        data_source=None,
        prediction_type=prediction_type,
        save_results=True,
        user_id=user.id,
        db=session
    )

    result = {
        "rows_inserted": rows_upserted,
        "prediction_summary": prediction_result["summary"],
        "chart_data": prediction_result["chart_data"]
    }

    if return_df:
        result["dataframe"] = df

    return result




