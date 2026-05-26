from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional
import cloudinary.uploader

from backend.database import get_db
from backend.models.products import Product
from backend.schemas.product import ProductResponse
from sqlalchemy.orm import joinedload

router = APIRouter(
    prefix="/products",
    tags=["Products"]
)

@router.post("/", response_model=ProductResponse)
def create_product(
    name: str = Form(...),
    category_id: int = Form(...),
    brand_id: int = Form(...),
    description: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    price: int = Form(...),
    featured: Optional[bool] = Form(False),
    db: Session = Depends(get_db)
):

    existing_product = db.query(Product).filter(Product.name == name).first()

    if existing_product:
        raise HTTPException(status_code=400, detail="Product already exists")

    image_url = None

    if image:
        try:
            upload_result = cloudinary.uploader.upload(
                image.file,
                folder="products"
            )
            image_url = upload_result.get("secure_url")

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    new_product = Product(
        name=name,
        category_id=category_id,
        description=description,
        image=image_url,
        price=price,
        brand_id=brand_id,
        featured=featured
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product




@router.get("/", response_model=list[ProductResponse])
def get_products(db: Session = Depends(get_db)):
    products = db.query(Product).options(
        joinedload(Product.category),
        joinedload(Product.brand)
    ).all()

    return products


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    return product


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    name: Optional[str] = Form(None),
    category_id: Optional[int] = Form(None),
    brand_id: Optional[int] = Form(None),
    description: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    price: Optional[int] = Form(None),
    featured: Optional[bool] = Form(None),
    db: Session = Depends(get_db)
):

    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    if name:
        product.name = name

    if category_id:
        product.category_id = category_id

    if brand_id:
        product.brand_id = brand_id

    if description:
        product.description = description

    if price is not None:
        product.price = price

    if featured is not None:
        product.featured = featured

    if image:
        try:
            upload_result = cloudinary.uploader.upload(
                image.file,
                folder="products"
            )
            product.image = upload_result.get("secure_url")

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    db.commit()
    db.refresh(product)

    return product




@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    db.delete(product)
    db.commit()

    return {"message": "Product deleted successfully"}