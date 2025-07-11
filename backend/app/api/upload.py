# backend/app/api/upload.py

from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status
from sqlmodel import Session
from typing import Optional

from ..database import get_session
from ..models import Upload, User
from ..core.security import get_current_user
from ..services.upload import process_upload_file


router = APIRouter()

@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    if file.content_type not in [
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ]:
        raise HTTPException(status_code=400, detail="Only CSV or Excel files are supported.")

    try:
        rows_inserted = await process_upload_file(
            file=file,
            user=current_user,
            session=session
        )
        return {
            "message": "Upload processed successfully.",
            "rows_inserted": rows_inserted
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Upload failed: {str(e)}")
