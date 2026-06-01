from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.api.dependencies.db import get_session
from app.core.exceptions import success_response
from app.schemas.order import OrderCreate, OrderRead
from app.services.order_service import OrderService

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("", status_code=status.HTTP_201_CREATED)
def create_order(payload: OrderCreate, db: Session = Depends(get_session)) -> dict[str, object]:
    order = OrderService(db).create_order(payload)
    return success_response(OrderRead.model_validate(order).model_dump(mode="json"))


@router.get("")
def list_orders(db: Session = Depends(get_session)) -> dict[str, object]:
    orders = OrderService(db).list_orders()
    return success_response([OrderRead.model_validate(order).model_dump(mode="json") for order in orders])


@router.get("/{order_id}")
def get_order(order_id: int, db: Session = Depends(get_session)) -> dict[str, object]:
    order = OrderService(db).get_order(order_id)
    return success_response(OrderRead.model_validate(order).model_dump(mode="json"))


@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_order(order_id: int, db: Session = Depends(get_session)) -> Response:
    OrderService(db).delete_order(order_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
