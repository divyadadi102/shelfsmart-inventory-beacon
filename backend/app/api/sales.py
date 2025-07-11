# from fastapi import APIRouter, Depends, Query
# from sqlmodel import Session, select
# from typing import Optional
# from ..database import get_session
# from ..models import Sales
# from ..core.security import get_current_user
# from datetime import datetime

# router = APIRouter()

# @router.get("/sales/summary")
# def sales_summary(
#     start: Optional[str] = Query(None),
#     end: Optional[str] = Query(None),
#     session: Session = Depends(get_session),
#     current_user=Depends(get_current_user)
# ):
#     filters = []
#     if start:
#         start_date = datetime.strptime(start, "%Y-%m-%d").date()
#         filters.append(Sales.date >= start_date)
#     if end:
#         end_date = datetime.strptime(end, "%Y-%m-%d").date()
#         filters.append(Sales.date <= end_date)

#     query = select(Sales)
#     for f in filters:
#         query = query.where(f)
#     sales = session.exec(query).all()

#     # 聚合
#     summary = {"total_revenue": 0, "total_units": 0}
#     daily = {}
#     for s in sales:
#         day = s.date.strftime('%Y-%m-%d')
#         if day not in daily:
#             daily[day] = {"revenue": 0}
#         # 收入=unit_sales*price，销量=unit_sales（float，注意累加浮点数）
#         daily[day]["revenue"] += (s.unit_sales or 0) * (s.price or 0)
#         summary["total_revenue"] += (s.unit_sales or 0) * (s.price or 0)
#         summary["total_units"] += (s.unit_sales or 0)

#     days = sorted(daily.keys())
#     daily_data = [{"day": d, "revenue": daily[d]["revenue"]} for d in days]

#     return {
#         "dailyData": daily_data,
#         "summary": summary
#     }


# @router.get("/sales/bestsellers")
# def sales_bestsellers(
#     start: Optional[str] = Query(None),
#     end: Optional[str] = Query(None),
#     topn: int = Query(5),
#     session: Session = Depends(get_session),
#     current_user=Depends(get_current_user)
# ):
#     filters = []
#     if start:
#         start_date = datetime.strptime(start, "%Y-%m-%d").date()
#         filters.append(Sales.date >= start_date)
#     if end:
#         end_date = datetime.strptime(end, "%Y-%m-%d").date()
#         filters.append(Sales.date <= end_date)

#     query = select(Sales)
#     for f in filters:
#         query = query.where(f)
#     sales = session.exec(query).all()

#     # 聚合
#     counter = {}
#     for s in sales:
#         if s.item_nbr not in counter:
#             counter[s.item_nbr] = 0
#         counter[s.item_nbr] += (s.unit_sales or 0)
#     sorted_products = sorted(counter.items(), key=lambda x: -x[1])
#     result = [{"name": str(k), "quantity": v, "trend": "up"} for k, v in sorted_products[:topn]]
#     return result


from fastapi import APIRouter, Depends, Query
from sqlmodel import Session
from typing import List, Optional
from ..database import get_session
from ..services.sales import get_past_sales, get_daily_total_sales, get_daily_category_sales, get_daily_total_unit_sales, get_top_items_sold, get_latest_date
from ..services.sales import get_daily_total_profit
from ..schemas import SalesOut

router = APIRouter(prefix="/api/sales", tags=["sales"])

@router.get("/past_performance", response_model=List[SalesOut])
def read_past_performance(
    start_date: Optional[str] = Query(None, description="开始日期，格式YYYY-MM-DD"),
    end_date: Optional[str] = Query(None, description="结束日期，格式YYYY-MM-DD"),
    limit: int = Query(100, description="返回条数"),
    db: Session = Depends(get_session)
):
    """
    获取过去一段时间内的销售明细
    """
    return get_past_sales(db, start_date, end_date, limit)

router = APIRouter(prefix="/api/sales", tags=["sales"])

@router.get("/daily_total_revenue", response_model=List[dict])
def daily_total_revenue(
    start_date: Optional[str] = Query(None, description="开始日期"),
    end_date: Optional[str] = Query(None, description="结束日期"),
    limit: int = Query(30, description="返回条数"),
    db: Session = Depends(get_session)
):
    """
    获取每天所有门店总销售额
    """
    return get_daily_total_sales(db, start_date, end_date, limit)

@router.get("/daily_category_revenue", response_model=List[dict])
def daily_category_revenue(
    start_date: Optional[str] = Query(None, description="开始日期"),
    end_date: Optional[str] = Query(None, description="结束日期"),
    limit: int = Query(30, description="返回条数"),
    db: Session = Depends(get_session)
):
    """
    获取每天所有门店每个类别销售额
    """
    return get_daily_category_sales(db, start_date, end_date, limit)

@router.get("/daily_total_unit_sales", response_model=List[dict])
def daily_total_unit_sales(
    start_date: Optional[str] = Query(None, description="开始日期"),
    end_date: Optional[str] = Query(None, description="结束日期"),
    limit: int = Query(30, description="返回条数"),
    db: Session = Depends(get_session)
):
    return get_daily_total_unit_sales(db, start_date, end_date, limit)

@router.get("/top_items_sold", response_model=List[dict])
def top_items_sold(
    start_date: Optional[str] = Query(None, description="开始日期"),
    end_date: Optional[str] = Query(None, description="结束日期"),
    limit: int = Query(5, description="前几名"),
    db: Session = Depends(get_session)
):
    return get_top_items_sold(db, start_date, end_date, limit)

@router.get("/latest_date")
def latest_date(db: Session = Depends(get_session)):
    date = get_latest_date(db)
    return {"latest_date": date}

@router.get("/daily_total_profit", response_model=List[dict])
def daily_total_profit(
    start_date: Optional[str] = Query(None, description="开始日期"),
    end_date: Optional[str] = Query(None, description="结束日期"),
    limit: int = Query(30, description="返回条数"),
    db: Session = Depends(get_session)
):
    """
    获取每天所有门店总利润
    """
    return get_daily_total_profit(db, start_date, end_date, limit)
