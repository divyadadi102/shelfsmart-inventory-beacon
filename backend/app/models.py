from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime, date
from sqlalchemy import UniqueConstraint

# --- User Table ---
class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str = Field(index=True, unique=True)
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    store_nbr: int = Field(index=True)
    # store: Optional["Store"] = Relationship(back_populates="users")
    uploads: List["Upload"] = Relationship(back_populates="user")
    posconnections: List["POSConnection"] = Relationship(back_populates="user")
    forecasts: List["Forecast"] = Relationship(back_populates="user")


# --- Product Table ---
class Product(SQLModel, table=True):
    __table_args__ = (UniqueConstraint("store_nbr", "item_nbr", name="unique_store_item"),)

    id: Optional[int] = Field(default=None, primary_key=True)
    item_nbr: int
    item_name: str
    item_category: Optional[str]
    item_inventory: Optional[int] = Field(default=0)
    store_nbr: int = Field(index=True)
    date: date

# --- Sales Table ---
class Sales(SQLModel, table=True):
    __table_args__ = (UniqueConstraint("date", "store_nbr", "item_nbr", name="unique_date_store_item"),)

    id: Optional[int] = Field(default=None, primary_key=True)
    date: date
    store_nbr: int = Field(index=True)
    item_nbr: int
    # item_name: Optional[str] 
    unit_sales: Optional[float]
    onpromotion: Optional[bool]
    category: Optional[str]
    holiday: Optional[int]
    item_class: Optional[int]
    perishable: Optional[int]
    price: Optional[float]
    cost_price: Optional[float]

# --- Upload Table ---
class Upload(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    filename: str
    status: str
    row_count: Optional[int]
    created_at: datetime = Field(default_factory=datetime.utcnow)
    store_nbr: int = Field(index=True)

    user: Optional[User] = Relationship(back_populates="uploads")

# --- POSConnection Table ---
class POSConnection(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    pos_url: str
    api_key: str
    connected_at: datetime
    store_nbr: int = Field(index=True)

    user: Optional[User] = Relationship(back_populates="posconnections")

# --- Forecast Table ---
class Forecast(SQLModel, table=True):
    __table_args__ = (UniqueConstraint("user_id", "store_nbr", "item_nbr", "prediction_date", name="forecast_user_store_item_date_unique"),)

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    store_nbr: int = Field(index=True)

    item_nbr: int
    prediction_date: date
    predicted_sales: float
    item_name: Optional[str]
    category: Optional[str]
    # category_name: Optional[str]
    item_class: Optional[int]
    # class_name: Optional[str]
    perishable: Optional[bool]
    model_version: Optional[str]
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)
    source_file: Optional[str]

    user: Optional[User] = Relationship(back_populates="forecasts")

class Stock(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    item_nbr: int
    item_name: str
    item_category: str
    item_inventory: int
    date: date
    created_at: datetime = Field(default_factory=datetime.utcnow)
    daily_sales_rate: Optional[float] = Field(default=0)
