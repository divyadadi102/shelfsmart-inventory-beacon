from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List

from app.models.forecast import Forecast
from app.models.user import User
from app.dependencies import get_session, get_current_user

router = APIRouter()

@router.get("/forecast", response_model=List[Forecast])
def get_forecast(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    # Fetch forecasts for the current user
    forecast = session.exec(
        select(Forecast).where(Forecast.user_id == current_user.id)
    ).all()

    if not forecast:
        raise HTTPException(status_code=404, detail="No forecast data found")

    return forecast

