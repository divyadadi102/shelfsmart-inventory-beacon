from fastapi import APIRouter, Depends, Query
from sqlmodel import Session, select
from typing import List, Optional
from datetime import date
from sqlalchemy import func

from app.config import DEMO_DATE
from app.schemas import ProductForecast
from app.services.forecast import get_products_forecast
from app.database import get_db
from app.models import Forecast, Sales

router = APIRouter()

today = DEMO_DATE

@router.get("/products", response_model=List[ProductForecast])
def get_products_forecast_api(
    period: str = Query("today"),
    user_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    return get_products_forecast(db, period, user_id)

@router.get("/revenue_summary")
def get_forecast_revenue_summary(
    prediction_date: Optional[date] = Query(None),
    user_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    total_revenue = 0
    # Find the forecast row
    stmt = select(
        Forecast.store_nbr, Forecast.item_nbr, Forecast.predicted_sales, Forecast.prediction_date
    )
    if user_id:
        stmt = stmt.where(Forecast.user_id == user_id)
    if prediction_date:
        stmt = stmt.where(Forecast.prediction_date == prediction_date)
    forecasts = db.exec(stmt).all()

    # Check the latest price (grouped by store_nbr and item_nbr, take the price with the largest date)    total_revenue = 0.0
    for forecast in forecasts:
        price_stmt = select(Sales.price).where(
            Sales.store_nbr == forecast.store_nbr,
            Sales.item_nbr == forecast.item_nbr,
            Sales.price != None,
            Sales.date <= forecast.prediction_date
        ).order_by(Sales.date.desc()).limit(1)
        price_result = db.exec(price_stmt).first()
        price = price_result if price_result else 0.0
        total_revenue += (forecast.predicted_sales or 0) * (price or 0)

    return {"expectedRevenue": round(total_revenue, 2)}

@router.get("/category_distribution")
def get_category_distribution(
    period: str = Query("today"),    # today/tomorrow/nextWeek
    user_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    from datetime import date, timedelta

    today = date.today()

    today = DEMO_DATE

    if period == "today":
        q = db.query(
            Forecast.category,
            func.sum(Forecast.predicted_sales).label("total_sales")
        ).filter(
            # Forecast.user_id == user_id,
            Forecast.prediction_date == today
        ).group_by(Forecast.category)
    elif period == "tomorrow":
        q = db.query(
            Forecast.category,
            func.sum(Forecast.predicted_sales).label("total_sales")
        ).filter(
            # Forecast.user_id == user_id,
            Forecast.prediction_date == today + timedelta(days=1)
        ).group_by(Forecast.category)
    elif period == "nextWeek":
        start = today + timedelta(days=1)
        end = today + timedelta(days=7)
        q = db.query(
            Forecast.category,
            func.sum(Forecast.predicted_sales).label("total_sales")
        ).filter(
            # Forecast.user_id == user_id,
            Forecast.prediction_date >= start,
            Forecast.prediction_date <= end
        ).group_by(Forecast.category)
    else:
        return []

    results = q.all()
    return [
        {"category": c if c else "Unknown", "total_sales": float(t or 0)}
        for c, t in results
    ]
