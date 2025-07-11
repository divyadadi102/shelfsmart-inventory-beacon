# backend/app/routes/products.py

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.database import get_session
from app.models import Stock, Category
from datetime import datetime
from app.schemas import CategoryCreate, CategoryRead
from app.schemas import StockCreate


router = APIRouter()

@router.get("/stock")
def get_all_products(session: Session = Depends(get_session)):
    return session.exec(select(Stock)).all()

@router.post("/stock")
def add_product(product: Stock, session: Session = Depends(get_session)):
    # Check if product exists
    existing = session.exec(
        select(Stock).where(Stock.name == product.name, Stock.category_id == product.category_id)
    ).first()

    if existing:
        existing.quantity += product.quantity
        existing.last_updated = datetime.utcnow()
        session.add(existing)
        session.commit()
        session.refresh(existing)
        return existing
    else:
        product.last_updated = datetime.utcnow()
        session.add(product)
        session.commit()
        session.refresh(product)
        return product

@router.put("/stock/{product_id}")
def update_quantity(product_id: int, update_data: dict, session: Session = Depends(get_session)):
    product = session.get(Stock, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    if "quantity" in update_data:
        product.quantity = update_data["quantity"]
        product.last_updated = datetime.utcnow()

    session.add(product)
    session.commit()
    session.refresh(product)
    return product


@router.post("/categories", response_model=CategoryRead)
def add_category(category: CategoryCreate, session: Session = Depends(get_session)):
    db_category = Category.model_validate(category)  # ✅ convert schema to model
    session.add(db_category)
    session.commit()
    session.refresh(db_category)
    return db_category

@router.get("/categories")
def get_all_categories(session: Session = Depends(get_session)):
    return session.exec(select(Category)).all()

@router.delete("/stock/{product_id}")
def delete_product(product_id: int, session: Session = Depends(get_session)):
    product = session.get(Stock, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    session.delete(product)
    session.commit()
    return {"message": "Product deleted successfully"}