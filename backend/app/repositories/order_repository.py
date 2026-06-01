from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.models.order import Order
from app.models.order_item import OrderItem


class OrderRepository:
    def __init__(self, db: Session):
        self.db = db

    def list(self) -> list[Order]:
        stmt = (
            select(Order)
            .options(joinedload(Order.customer), joinedload(Order.items).joinedload(OrderItem.product))
            .order_by(Order.created_at.desc())
        )
        return list(self.db.scalars(stmt).unique().all())

    def get(self, order_id: int) -> Order | None:
        stmt = (
            select(Order)
            .where(Order.id == order_id)
            .options(joinedload(Order.customer), joinedload(Order.items).joinedload(OrderItem.product))
        )
        return self.db.scalars(stmt).unique().one_or_none()

    def create(self, order: Order) -> Order:
        self.db.add(order)
        self.db.flush()
        self.db.refresh(order)
        return order

    def delete(self, order: Order) -> None:
        self.db.delete(order)
        self.db.flush()
