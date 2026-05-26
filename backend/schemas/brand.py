# schemas/category.py
from pydantic import BaseModel
from typing import Optional

class BrandCreate(BaseModel):
    name: str
    description: Optional[str] = None

class BrandResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    image: Optional[str] = None

    class Config:
        from_attributes = True

