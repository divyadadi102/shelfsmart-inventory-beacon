# backend/app/services/stock.py

from sqlmodel import Session, select
from app.models import Product, Stock  # adjust if your models are elsewhere

def populate_stock_from_product(session: Session):
    products = session.exec(select(Product)).all()
    print(f"✅ [populate_stock] Products retrieved: {len(products)}")

    inserted = 0
    for p in products:
        print(f"➡️ Processing item_nbr={p.item_nbr}, date={p.date}, inventory={p.item_inventory}")

        existing = session.exec(
            select(Stock)
            .where(Stock.item_nbr == p.item_nbr)
            .where(Stock.date == p.date)
        ).first()

        if existing:
            print(f"⚠️ Already exists: item_nbr={p.item_nbr} on {p.date}")
            continue

        stock = Stock(
            item_nbr=p.item_nbr,
            item_name=p.item_name,
            item_category=p.item_category,
            item_inventory=p.item_inventory,
            date=p.date
        )
        session.add(stock)
        inserted += 1

    session.commit()
    print(f"✅ [populate_stock] Inserted into stock: {inserted} rows")

from sqlmodel import Session, select, func
from app.models import Sales, Stock
from app.database import engine

def update_daily_sales_rate():
    with Session(engine) as session:
        # Get all item_nbrs from stock
        item_nbrs = session.exec(select(Stock.item_nbr)).all()

        for item_nbr in item_nbrs:
            # Fetch all sales for that item_nbr
            sales_data = session.exec(
                select(Sales.unit_sales, Sales.date).where(Sales.item_nbr == item_nbr)
            ).all()

            if not sales_data:
                continue

            total_units_sold = sum([s.unit_sales or 0 for s in sales_data])
            unique_dates = set([s.date for s in sales_data])

            if not unique_dates:
                continue

            avg_daily_sales = total_units_sold / len(unique_dates)

            # Update corresponding stock row(s)
            stock_rows = session.exec(select(Stock).where(Stock.item_nbr == item_nbr)).all()
            for stock in stock_rows:
                stock.daily_sales_rate = avg_daily_sales
                session.add(stock)

        session.commit()





