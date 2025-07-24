from fastapi import APIRouter, Depends, Query
from sqlmodel import Session
from typing import List, Optional
from ..database import get_db
from ..services.sales import get_past_sales, get_daily_total_sales, get_daily_category_sales, get_daily_total_unit_sales, get_top_items_sold, get_latest_date
from ..services.sales import get_daily_total_profit, get_bottom_items_sold
from ..schemas import SalesOut

router = APIRouter(prefix="/api/sales", tags=["sales"])

# @router.get("/past_performance", response_model=List[SalesOut])
# def read_past_performance(
#     start_date: Optional[str] = Query(None, description="Start date, format YYYY-MM-DD"),
#     end_date: Optional[str] = Query(None, description="End date, format YYYY-MM-DD"),
#     limit: int = Query(100, description="Number of records returned"),
#     db: Session = Depends(get_db)
# ):
#     """
#     Get sales details for a past period
#     """
#     return get_past_sales(db, start_date, end_date, limit)

@router.get("/daily_total_revenue", response_model=List[dict])
def daily_total_revenue(
    start_date: Optional[str] = Query(None, description="Start date"),
    end_date: Optional[str] = Query(None, description="End date"),
    limit: int = Query(30, description="Number of records returned"),
    db: Session = Depends(get_db)
):
    """
    Get total daily sales revenue for all stores
    """
    return get_daily_total_sales(db, start_date, end_date, limit)

@router.get("/daily_category_revenue", response_model=List[dict])
def daily_category_revenue(
    start_date: Optional[str] = Query(None, description="Start date"),
    end_date: Optional[str] = Query(None, description="End date"),
    limit: int = Query(30, description="Number of records returned"),
    db: Session = Depends(get_db)
):
    """
    Get daily sales revenue by category for all stores
    """
    return get_daily_category_sales(db, start_date, end_date, limit)

@router.get("/daily_total_unit_sales", response_model=List[dict])
def daily_total_unit_sales(
    start_date: Optional[str] = Query(None, description="Start date"),
    end_date: Optional[str] = Query(None, description="End date"),
    limit: int = Query(30, description="Number of records returned"),
    db: Session = Depends(get_db)
):
    return get_daily_total_unit_sales(db, start_date, end_date, limit)

@router.get("/top_items_sold", response_model=List[dict])
def top_items_sold(
    start_date: Optional[str] = Query(None, description="Start date"),
    end_date: Optional[str] = Query(None, description="End date"),
    limit: int = Query(5, description="Top N"),
    db: Session = Depends(get_db)
):
    return get_top_items_sold(db, start_date, end_date, limit)

@router.get("/latest_date")
def latest_date(db: Session = Depends(get_db)):
    date = get_latest_date(db)
    return {"latest_date": date}

@router.get("/daily_total_profit", response_model=List[dict])
def daily_total_profit(
    start_date: Optional[str] = Query(None, description="Start date"),
    end_date: Optional[str] = Query(None, description="End date"),
    limit: int = Query(30, description="Number of records returned"),
    db: Session = Depends(get_db)
):
    """
    Get total daily profit for all stores
    """
    return get_daily_total_profit(db, start_date, end_date, limit)

@router.get("/bottom_items_sold", response_model=List[dict])
def bottom_items_sold(
    start_date: Optional[str] = Query(None, description="Start date"),
    end_date: Optional[str] = Query(None, description="End date"),
    limit: int = Query(5, description="Top N"),
    db: Session = Depends(get_db)
):
    return get_bottom_items_sold(db, start_date, end_date, limit)
