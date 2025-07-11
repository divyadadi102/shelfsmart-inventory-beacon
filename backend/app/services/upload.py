import pandas as pd
from io import BytesIO
from sqlmodel import Session, select
from ..models import Sales, Upload, User

async def process_upload_file(file, user: User, session: Session) -> int:
    content = await file.read()
    filename = file.filename.lower()
    # 支持 csv 和 excel 格式
    if filename.endswith('.csv'):
        df = pd.read_csv(BytesIO(content), encoding="utf-8")
    elif filename.endswith('.xlsx') or filename.endswith('.xls'):
        df = pd.read_excel(BytesIO(content))
    else:
        raise Exception("Unsupported file format")

    # 小写所有列名，去除两端空格，方便字段匹配
    df.columns = df.columns.str.strip().str.lower()

    required_columns = {
    "date", "store_nbr", "item_nbr", "unit_sales", "onpromotion",
    "category", "holiday", "item_class", "perishable", "price", "cost_price"
    }

    if not required_columns.issubset(df.columns):
        raise Exception(f"Missing columns: {required_columns - set(df.columns)}")

    rows_upserted = 0
    for _, row in df.iterrows():
        key_date = pd.to_datetime(row["date"]).date()
        key_store = int(row["store_nbr"])
        key_item = int(row["item_nbr"])

        # 1. 查找是否有已存在数据
        existing = session.exec(
            select(Sales)
            .where(Sales.date == key_date)
            .where(Sales.store_nbr == key_store)
            .where(Sales.item_nbr == key_item)
        ).first()

        # 2. 构建新数据（不传id）
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
            cost_price=float(row["cost_price"]) if not pd.isnull(row["cost_price"]) else None,  # 新增行
        )


        if existing:
            # 覆盖（只更新内容，不动id）
            for k, v in new_values.items():
                setattr(existing, k, v)
            # SQLModel会自动追踪
        else:
            # 新增
            sale = Sales(**new_values)
            session.add(sale)
        rows_upserted += 1

    # 保存上传记录
    upload = Upload(
        user_id=user.id,
        filename=file.filename,
        status="processed",
        row_count=rows_upserted
    )
    session.add(upload)
    session.commit()
    return rows_upserted
