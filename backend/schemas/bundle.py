from pydantic import BaseModel
from typing import Optional, List



class BundleProduct(BaseModel):
    id: int
    name: str
    image: Optional[str]
    price: int

    class Config:
        from_attributes = True




class BundleCreate(BaseModel):
    name: str
    description: Optional[str] = None
    image: Optional[str] = None
    price: int
    featured: bool = False

    # products ids
    product_ids: List[int]


# RESPONSE
class BundleResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    image: Optional[str]
    price: int
    featured: bool

    # products inside bundle
    products: List[BundleProduct]

    class Config:
        from_attributes = True