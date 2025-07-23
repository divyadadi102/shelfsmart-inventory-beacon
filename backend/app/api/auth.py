from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from ..database import get_db
from .. import models, schemas
from ..core.security import hash_password, verify_password, create_access_token
from ..schemas import LoginRequest
import random


router = APIRouter()

@router.post("/register", response_model=schemas.UserRead)
def register(user: schemas.UserCreate, session: Session = Depends(get_db)):
    db_user = session.exec(select(models.User).where(models.User.email == user.email)).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    random_store_nbr = random.randint(100000000, 999999999)
    new_user = models.User(
        name=user.name,
        email=user.email,
        hashed_password=hash_password(user.password),
        store_nbr=random_store_nbr
        # store_nbr = 1
    )
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return new_user

@router.post("/login", response_model=schemas.Token)
def login(user: LoginRequest, session: Session = Depends(get_db)):
    db_user = session.exec(select(models.User).where(models.User.email == user.email)).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": db_user.email})
    return {"access_token": token, "token_type": "bearer"}
