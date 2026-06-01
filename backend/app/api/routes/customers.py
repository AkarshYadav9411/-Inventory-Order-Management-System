from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.api.dependencies.db import get_session
from app.core.exceptions import success_response
from app.schemas.customer import CustomerCreate, CustomerRead
from app.services.customer_service import CustomerService

router = APIRouter(prefix="/customers", tags=["Customers"])


@router.post("", status_code=status.HTTP_201_CREATED)
def create_customer(payload: CustomerCreate, db: Session = Depends(get_session)) -> dict[str, object]:
    customer = CustomerService(db).create_customer(payload)
    return success_response(CustomerRead.model_validate(customer).model_dump(mode="json"))


@router.get("")
def list_customers(db: Session = Depends(get_session)) -> dict[str, object]:
    customers = CustomerService(db).list_customers()
    return success_response([CustomerRead.model_validate(customer).model_dump(mode="json") for customer in customers])


@router.get("/{customer_id}")
def get_customer(customer_id: int, db: Session = Depends(get_session)) -> dict[str, object]:
    customer = CustomerService(db).get_customer(customer_id)
    return success_response(CustomerRead.model_validate(customer).model_dump(mode="json"))


@router.delete("/{customer_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_customer(customer_id: int, db: Session = Depends(get_session)) -> Response:
    CustomerService(db).delete_customer(customer_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
