from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime, date

# backend/app/models.py

from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime

class Category(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    description: Optional[str] = None

    # back relationship
    products: List["Stock"] = Relationship(back_populates="category")


class Stock(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    quantity: int
    cost_price: float
    selling_price: float
    last_updated: datetime = Field(default_factory=datetime.utcnow)

    # FK relationship
    category_id: int = Field(foreign_key="category.id")
    category: Optional[Category] = Relationship(back_populates="products")


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str = Field(unique=True, index=True)
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    uploads: List["Upload"] = Relationship(back_populates="user")

class Product(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    item_nbr: int = Field(index=True, unique=True)
    item_name: str
    item_category: Optional[str]
    item_perishable: Optional[int]
    cost_price: Optional[float]
    selling_price: Optional[float]
    units: int = 0  # add this to track quantity


class Sales(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
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


class Forecast(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    product_id: int = Field(foreign_key="product.id")
    forecast_date: datetime
    forecast_value: int
    actual_value: Optional[int]

class Upload(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: Optional[int] = Field(foreign_key="user.id")
    filename: str
    status: str = "pending"
    row_count: Optional[int]
    created_at: datetime = Field(default_factory=datetime.utcnow)

    user: Optional[User] = Relationship(back_populates="uploads")

class POSConnection(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    pos_url: str
    api_key: str
    connected_at: datetime = Field(default_factory=datetime.utcnow)
