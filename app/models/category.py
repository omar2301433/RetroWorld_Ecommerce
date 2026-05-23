from sqlalchemy import Column, Integer, String, Text, TIMESTAMP
from sqlalchemy.sql import func

from app.database import Base


class Category(Base):

    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)
    slug = Column(String(120), nullable=False, unique=True)
    icon = Column(String(20))
    image = Column(String(255))
    description = Column(Text)
    created_at = Column(
        TIMESTAMP,
        server_default=func.now()
    )