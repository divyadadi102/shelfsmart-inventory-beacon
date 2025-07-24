from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import date
from pydantic import BaseModel
import re

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    business_name: str

    @field_validator('password')
    @classmethod
    def password_complexity(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not re.search(r'[A-Za-z]', v):
            raise ValueError('Password must contain letters')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain numbers')
        return v

class UserRead(BaseModel):
    id: int
    name: str
    email: str
    business_name: str

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

    model_config = {
        "from_attributes": True
    }

class ProductForecast(BaseModel):
    name: str
    expected: float
