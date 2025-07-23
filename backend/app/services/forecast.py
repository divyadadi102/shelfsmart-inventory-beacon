# backend/app/services/forecast.py

from sqlmodel import Session, select
from datetime import date, timedelta
from typing import List, Dict, Optional

from app.models import Forecast
from app.config import DEMO_DATE

def get_products_forecast(
    db: Session,
    period: str = "today",
    user_id: Optional[int] = None
) -> List[Dict]:
    today = date.today()

    #  Demo date for testing purposes
    today = DEMO_DATE
    
    if period == "today":
        start_date = end_date = today
    elif period == "tomorrow":
        start_date = end_date = today + timedelta(days=1)
    elif period == "nextWeek":
        start_date = today + timedelta(days=1)
        end_date = today + timedelta(days=7)
    else:
        start_date = end_date = today

    query = select(Forecast).where(
        Forecast.prediction_date >= start_date,
        Forecast.prediction_date <= end_date
    )
    if user_id:
        query = query.where(Forecast.user_id == user_id)
    
    results = db.exec(query).all()

    # Aggregate sales for each product name
    product_sales = {}
    for row in results:
        key = row.item_name or str(row.item_nbr)
        if key not in product_sales:
            product_sales[key] = 0
        product_sales[key] += float(row.predicted_sales)
    
    # Return up to 12 products in descending order by sales volume
    data = [
        {"name": name, "expected": expected}
        for name, expected in sorted(product_sales.items(), key=lambda x: x[1], reverse=True)
    ][:12]
    return data
