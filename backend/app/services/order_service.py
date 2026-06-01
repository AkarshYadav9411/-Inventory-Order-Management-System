from collections import defaultdict
from decimal import Decimal

from fastapi import status
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.core.exceptions import AppException
from app.models.customer import Customer
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product import Product
from app.repositories.order_repository import OrderRepository
from app.schemas.order import OrderCreate


class OrderService:
    def __init__(self, db: Session):
        self.db = db
        self.repository = OrderRepository(db)

    def list_orders(self) -> list[Order]:
        return self.repository.list()

    def get_order(self, order_id: int) -> Order:
        order = self.repository.get(order_id)
        if not order:
            raise AppException("Order not found", status.HTTP_404_NOT_FOUND)
        return order

    def create_order(self, payload: OrderCreate) -> Order:
        try:
            customer = self.db.get(Customer, payload.customer_id)
            if not customer:
                raise AppException("Customer not found", status.HTTP_404_NOT_FOUND)

            requested_quantities: dict[int, int] = defaultdict(int)
            for item in payload.items:
                requested_quantities[item.product_id] += item.quantity

            products = list(
                self.db.scalars(
                    select(Product)
                    .where(Product.id.in_(requested_quantities.keys()))
                    .with_for_update()
                ).all()
            )
            products_by_id = {product.id: product for product in products}

            missing_ids = set(requested_quantities.keys()) - set(products_by_id.keys())
            if missing_ids:
                raise AppException(f"Product not found: {min(missing_ids)}", status.HTTP_404_NOT_FOUND)

            order_items: list[OrderItem] = []
            total_amount = Decimal("0.00")
            for product_id, quantity in requested_quantities.items():
                product = products_by_id[product_id]
                if product.quantity_in_stock < quantity:
                    raise AppException(f"Insufficient inventory for product {product.sku}", status.HTTP_400_BAD_REQUEST)
                unit_price = Decimal(product.price)
                subtotal = unit_price * quantity
                product.quantity_in_stock -= quantity
                total_amount += subtotal
                order_items.append(
                    OrderItem(product_id=product.id, quantity=quantity, unit_price=unit_price, subtotal=subtotal)
                )

            order = Order(customer_id=payload.customer_id, total_amount=total_amount, items=order_items)
            self.repository.create(order)
            self.db.commit()
            return self.get_order(order.id)
        except Exception:
            self.db.rollback()
            raise

    def delete_order(self, order_id: int) -> None:
        order = self.get_order(order_id)
        self.repository.delete(order)
        self.db.commit()
