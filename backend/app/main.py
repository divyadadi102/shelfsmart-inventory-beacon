# backend/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import create_db_and_tables
from .api import auth, upload, sales
from .api.sales import router as sales_router
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.api import forecast
import os
from app.api import stock
from app.database import create_db_and_tables
from app.services.stock import update_daily_sales_rate
from sqlmodel import Session
from app.database import engine

from app.api import auth, upload, sales, stock, forecast
from app.api.sales import router as sales_router

app = FastAPI(
    title="ShelfSmart API",
    description="AI-powered data analytics platform API",
    version="1.0.0"
)

# CORS Configuration: Front-end Local Debugging
origins = [
    "http://localhost:3000",  
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# registered router
app.include_router(auth.router, prefix="/api")
app.include_router(stock.router) 


@app.on_event("startup")
def startup_tasks():
    create_db_and_tables()
    from app.database import SessionLocal
    from app.services.stock import populate_stock_from_product
    with Session(engine) as session:
        populate_stock_from_product(session) 

# Optional: Root route
@app.get("/")
def read_root():
    return {"message": "ShelfSmart backend is running"}

app.include_router(upload.router, prefix="/api")

app.include_router(sales.router, prefix="/api")

app.include_router(forecast.router, prefix="/api/forecast", tags=["forecast"])

# Register API Routes
app.include_router(sales_router)


# Mount static folders for easy management
app.mount("/static", StaticFiles(directory=os.path.join(os.path.dirname(__file__), "static")), name="static")

@app.get("/api/download-template")
def download_template():
    file_path = os.path.join(os.path.dirname(__file__), "static", "sample_template.csv")
    return FileResponse(
        path=file_path,
        media_type="text/csv",
        filename="sample_template.csv"
    )
    