from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.dependencies.db import get_session
from app.core.exceptions import success_response
from app.services.dashboard_service import DashboardService

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("")
def get_dashboard(db: Session = Depends(get_session)) -> dict[str, object]:
    dashboard = DashboardService(db).get_dashboard()
    return success_response(dashboard.model_dump())
