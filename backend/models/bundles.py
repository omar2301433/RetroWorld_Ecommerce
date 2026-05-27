from sqlalchemy import (
    Boolean,
    Column,
    ForeignKey,
    Integer,
    String,
    Text,
    TIMESTAMP,
    Table
)

from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from backend.database import Base



bundle_products = Table(
    "bundle_products",
    Base.metadata,
    Column("bundle_id", ForeignKey("bundles.id"), primary_key=True),
    Column("product_id", ForeignKey("products.id"), primary_key=True)
)


class Bundle(Base):

    __tablename__ = "bundles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)
    image = Column(String(255), nullable=True)
    price = Column(Integer, nullable=False)
    description = Column(Text)
    featured = Column(Boolean, default=False)

    created_at = Column(
        TIMESTAMP,
        server_default=func.now()
    )

    products = relationship(
        "Product",
        secondary=bundle_products,
        back_populates="bundles"
    )