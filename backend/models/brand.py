from sqlalchemy import Column, Integer, String, Text, TIMESTAMP
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from backend.database import Base


class Brand(Base):

    __tablename__ = "brands"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)
    image = Column(String(255), nullable=True)
    description = Column(Text)
    created_at = Column(
        TIMESTAMP,
        server_default=func.now()
    )
    products = relationship("Product", back_populates="brand")