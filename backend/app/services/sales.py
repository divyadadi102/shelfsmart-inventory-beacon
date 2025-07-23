from sqlmodel import Session, select, func
from typing import List, Dict, Optional
from ..models import Sales, Product

def get_past_sales(
    db: Session, 
    start_date: Optional[str] = None, 
    end_date: Optional[str] = None, 
    limit: int = 100
) -> List[Sales]:
    query = select(Sales)
    if start_date:
        query = query.where(Sales.date >= start_date)
    if end_date:
        query = query.where(Sales.date <= end_date)
    query = query.order_by(Sales.date.desc()).limit(limit)
    return db.exec(query).all()

def get_daily_total_sales(
    db: Session,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    limit: int = 30
) -> List[Dict]:
    query = select(
        Sales.date,
        func.sum(Sales.unit_sales * Sales.price).label("total_revenue")
    )
    if start_date:
        query = query.where(Sales.date >= start_date)
    if end_date:
        query = query.where(Sales.date <= end_date)
    query = query.group_by(Sales.date).order_by(Sales.date.desc()).limit(limit)
    result = db.exec(query).all()
    # Result similar to [(date, total_revenue), ...]
    # Returns List[dict]
    return [{"date": str(row[0]), "revenue": float(row[1] or 0)} for row in result]


def get_daily_category_sales(
    db: Session,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    limit: int = 30
) -> List[Dict]:
    query = select(
        Sales.date,
        Sales.category,
        func.sum(Sales.unit_sales * Sales.price).label("total_revenue")
    )
    if start_date:
        query = query.where(Sales.date >= start_date)
    if end_date:
        query = query.where(Sales.date <= end_date)
    query = query.group_by(Sales.date, Sales.category).order_by(Sales.date.desc()).limit(limit * 5)
    # limit * 5 is to leave more space for multiple categories each day.
    result = db.exec(query).all()
    return [
        {"date": str(row[0]), "category": row[1], "revenue": float(row[2] or 0)}
        for row in result
    ]

def get_daily_total_unit_sales(
    db: Session,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    limit: int = 30
) -> List[Dict]:
    query = select(
        Sales.date,
        func.sum(Sales.unit_sales).label("total_unit_sales")
    )
    if start_date:
        query = query.where(Sales.date >= start_date)
    if end_date:
        query = query.where(Sales.date <= end_date)
    query = query.group_by(Sales.date).order_by(Sales.date.desc()).limit(limit)
    result = db.exec(query).all()
    return [{"date": str(row[0]), "unit_sales": float(row[1] or 0)} for row in result]

def get_top_items_sold(
    db: Session,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    limit: int = 5
) -> List[Dict]:
    query = select(
        Sales.item_nbr,
        Product.item_name,
        Sales.category,
        func.sum(Sales.unit_sales).label("total_sold")
    ).join(Product, Sales.item_nbr == Product.item_nbr)

    if start_date:
        query = query.where(Sales.date >= start_date)
    if end_date:
        query = query.where(Sales.date <= end_date)

    query = (
        query.group_by(Sales.item_nbr, Product.item_name, Sales.category)
        .order_by(func.sum(Sales.unit_sales).desc())
        .limit(limit)
    )
    result = db.exec(query).all()
    return [
        {
            "item_nbr": row[0],
            "item_name": row[1],
            "category": row[2],
            "total_sold": int(row[3])
        }
        for row in result
    ]

def get_latest_date(db: Session) -> Optional[str]:
    from sqlalchemy import func as sa_func
    result = db.exec(select(sa_func.max(Sales.date))).first()
    # result may be directly datetime.date or None
    if result:
        return str(result)
    else:
        return None

def get_daily_total_profit(
    db: Session,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    limit: int = 30
) -> List[Dict]:
    query = select(
        Sales.date,
        func.sum((Sales.price - Sales.cost_price) * Sales.unit_sales).label("total_profit")
    )
    if start_date:
        query = query.where(Sales.date >= start_date)
    if end_date:
        query = query.where(Sales.date <= end_date)
    query = query.group_by(Sales.date).order_by(Sales.date.desc()).limit(limit)
    result = db.exec(query).all()
    return [{"date": str(row[0]), "profit": float(row[1] or 0)} for row in result]

def get_bottom_items_sold(
    db: Session,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    limit: int = 5
) -> List[Dict]:
    query = select(
        Sales.item_nbr,
        Product.item_name,
        Sales.category,
        func.sum(Sales.unit_sales).label("total_sold")
    ).join(Product, Sales.item_nbr == Product.item_nbr)

    if start_date:
        query = query.where(Sales.date >= start_date)
    if end_date:
        query = query.where(Sales.date <= end_date)

    query = (
        query.group_by(Sales.item_nbr, Product.item_name, Sales.category)
        .order_by(func.sum(Sales.unit_sales).asc())   # warning: asc()
        .limit(limit)
    )
    result = db.exec(query).all()
    return [
        {
            "item_nbr": row[0],
            "item_name": row[1],
            "category": row[2],
            "total_sold": int(row[3])
        }
        for row in result
    ]
