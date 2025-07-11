

# backend/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine
from sqlmodel import SQLModel

# Import routers
from app.api import upload, auth
from app.api import products  # ✅ new products route
from app.models import User, Product, Sales, Forecast, Upload, POSConnection, Stock, Category

app = FastAPI()

# CORS setup
origins = [
    "http://localhost",
    "http://localhost:3000",  # frontend dev server
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # allow all methods like POST, OPTIONS, etc.
    allow_headers=["*"],
)

# DB: create all tables on startup
@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)  # ✅ create tables including stock and category

# Register routes
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(upload.router, prefix="/api", tags=["upload"])
app.include_router(products.router, prefix="/api", tags=["products"])  # ✅ products router

@app.get("/")
def root():
    return {"message": "ShelfSmart backend running"}
