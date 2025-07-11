from pydantic import BaseModel
from typing import Optional
from datetime import date
from pydantic import BaseModel

class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class UserRead(BaseModel):
    id: int
    name: str
    email: str

class Token(BaseModel):
    access_token: str
    token_type: str

class LoginRequest(BaseModel):
    email: str
    password: str

class SalesBase(BaseModel):
    date: date
    store_nbr: int
    item_nbr: int
    unit_sales: float
    onpromotion: Optional[bool]
    category: Optional[str]
    holiday: Optional[int]
    item_class: Optional[int]
    perishable: Optional[int]
    cost_price: Optional[float]
    price: Optional[float]


class SalesOut(SalesBase):
    id: int

    class Config:
        from_attributes = True

class ProductBase(BaseModel):
    item_nbr: int
    item_name: str
    item_category: Optional[str]
    item_perishable: Optional[int]
    quantity: int = 0
    cost_price: float = 0.0
    selling_price: float = 0.0

class ProductCreate(ProductBase):
    pass

class ProductRead(ProductBase):
    id: int

    class Config:
        from_attributes = True

# Category schemas

class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryRead(CategoryBase):
    id: int

    class Config:
        from_attributes = True


class StockCreate(BaseModel):
    name: str
    category_id: int
    quantity: int
    cost_price: float
    selling_price: float