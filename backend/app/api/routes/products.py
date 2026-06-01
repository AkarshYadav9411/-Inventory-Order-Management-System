from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.api.dependencies.db import get_session
from app.core.exceptions import success_response
from app.schemas.product import ProductCreate, ProductRead, ProductUpdate
from app.services.product_service import ProductService

router = APIRouter(prefix="/products", tags=["Products"])


@router.post("", status_code=status.HTTP_201_CREATED)
def create_product(payload: ProductCreate, db: Session = Depends(get_session)) -> dict[str, object]:
    product = ProductService(db).create_product(payload)
    return success_response(ProductRead.model_validate(product).model_dump(mode="json"))


@router.get("")
def list_products(search: str | None = None, db: Session = Depends(get_session)) -> dict[str, object]:
    products = ProductService(db).list_products(search)
    return success_response([ProductRead.model_validate(product).model_dump(mode="json") for product in products])


@router.get("/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_session)) -> dict[str, object]:
    product = ProductService(db).get_product(product_id)
    return success_response(ProductRead.model_validate(product).model_dump(mode="json"))


@router.put("/{product_id}")
def update_product(product_id: int, payload: ProductUpdate, db: Session = Depends(get_session)) -> dict[str, object]:
    product = ProductService(db).update_product(product_id, payload)
    return success_response(ProductRead.model_validate(product).model_dump(mode="json"))


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, db: Session = Depends(get_session)) -> Response:
    ProductService(db).delete_product(product_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
