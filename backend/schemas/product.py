# schemas/product.py
from pydantic import BaseModel
from typing import Optional

class ProductCreate(BaseModel):
    name: str
    category_id: int
    description: Optional[str] = None
    image: Optional[str] = None
    price: int
    featured: bool = False

class CategoryOut(BaseModel):
    id: int
    name: str

class BrandOut(BaseModel):
    id: int
    name: str

class ProductResponse(BaseModel):
    id: int
    name: str
    category: CategoryOut
    brand: BrandOut
    description: Optional[str] = None
    image: Optional[str] = None
    price: int
    featured: bool

    class Config:
        from_attributes = True

