from fastapi import status
from sqlalchemy.orm import Session

from app.core.exceptions import AppException
from app.models.customer import Customer
from app.repositories.customer_repository import CustomerRepository
from app.schemas.customer import CustomerCreate


class CustomerService:
    def __init__(self, db: Session):
        self.db = db
        self.repository = CustomerRepository(db)

    def list_customers(self) -> list[Customer]:
        return self.repository.list()

    def get_customer(self, customer_id: int) -> Customer:
        customer = self.repository.get(customer_id)
        if not customer:
            raise AppException("Customer not found", status.HTTP_404_NOT_FOUND)
        return customer

    def create_customer(self, payload: CustomerCreate) -> Customer:
        if self.repository.get_by_email(payload.email):
            raise AppException("Email already exists", status.HTTP_409_CONFLICT)
        customer = self.repository.create(payload)
        self.db.commit()
        return customer

    def delete_customer(self, customer_id: int) -> None:
        customer = self.get_customer(customer_id)
        self.repository.delete(customer)
        self.db.commit()
