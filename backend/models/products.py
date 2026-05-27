from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text, TIMESTAMP, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from backend.database import Base


class Product(Base):

    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    brand_id = Column(Integer, ForeignKey("brands.id"), nullable=True)
    name = Column(String(100), nullable=False, unique=True)
    image = Column(String(255), nullable=True)
    price = Column(Integer, nullable=False)
    description = Column(Text)
    featured = Column(Boolean, default=False)  # False = not featured, True = featured
    created_at = Column(
        TIMESTAMP,
        server_default=func.now()
    )
    category = relationship("Category", back_populates="products")
    brand = relationship("Brand", back_populates="products")
    bundles = relationship(
        "Bundle",
        secondary="bundle_products",
        back_populates="products"
    )