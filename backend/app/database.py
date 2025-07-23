from sqlmodel import SQLModel, create_engine, Session
from .core.config import settings

engine = create_engine(settings.DATABASE_URL, echo=True)

def create_db_and_tables():
    from .models import User, Product, Sales, Forecast, Upload, POSConnection
    SQLModel.metadata.create_all(engine)

def get_db():
    with Session(engine) as session:
        yield session
