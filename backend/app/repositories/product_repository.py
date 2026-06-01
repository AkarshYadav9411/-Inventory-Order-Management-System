from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate


class ProductRepository:
    def __init__(self, db: Session):
        self.db = db

    def list(self, search: str | None = None) -> list[Product]:
        stmt = select(Product).order_by(Product.created_at.desc())
        if search:
            term = f"%{search.lower()}%"
            stmt = stmt.where(Product.name.ilike(term) | Product.sku.ilike(term))
        return list(self.db.scalars(stmt).all())

    def get(self, product_id: int) -> Product | None:
        return self.db.get(Product, product_id)

    def get_by_sku(self, sku: str) -> Product | None:
        return self.db.scalar(select(Product).where(Product.sku == sku))

    def create(self, payload: ProductCreate) -> Product:
        product = Product(**payload.model_dump())
        self.db.add(product)
        self.db.flush()
        self.db.refresh(product)
        return product

    def update(self, product: Product, payload: ProductUpdate) -> Product:
        for field, value in payload.model_dump(exclude_unset=True).items():
            setattr(product, field, value)
        self.db.flush()
        self.db.refresh(product)
        return product

    def delete(self, product: Product) -> None:
        self.db.delete(product)
        self.db.flush()
