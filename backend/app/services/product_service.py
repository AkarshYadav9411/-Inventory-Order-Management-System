from fastapi import status
from sqlalchemy.orm import Session

from app.core.exceptions import AppException
from app.models.product import Product
from app.repositories.product_repository import ProductRepository
from app.schemas.product import ProductCreate, ProductUpdate


class ProductService:
    def __init__(self, db: Session):
        self.db = db
        self.repository = ProductRepository(db)

    def list_products(self, search: str | None = None) -> list[Product]:
        return self.repository.list(search)

    def get_product(self, product_id: int) -> Product:
        product = self.repository.get(product_id)
        if not product:
            raise AppException("Product not found", status.HTTP_404_NOT_FOUND)
        return product

    def create_product(self, payload: ProductCreate) -> Product:
        if self.repository.get_by_sku(payload.sku):
            raise AppException("SKU already exists", status.HTTP_409_CONFLICT)
        product = self.repository.create(payload)
        self.db.commit()
        return product

    def update_product(self, product_id: int, payload: ProductUpdate) -> Product:
        product = self.get_product(product_id)
        if payload.sku and payload.sku != product.sku and self.repository.get_by_sku(payload.sku):
            raise AppException("SKU already exists", status.HTTP_409_CONFLICT)
        product = self.repository.update(product, payload)
        self.db.commit()
        return product

    def delete_product(self, product_id: int) -> None:
        product = self.get_product(product_id)
        self.repository.delete(product)
        self.db.commit()
