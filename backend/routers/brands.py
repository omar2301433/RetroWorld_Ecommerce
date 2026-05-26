from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional
import cloudinary.uploader
from backend.database import get_db
from backend.models.brand import Brand
from backend.models.brand import Brand
from backend.schemas.brand import BrandResponse
from backend.schemas.category import CategoryResponse

router = APIRouter(
    prefix="/brands",
    tags=["Brands"]
)


@router.post("/")
def create_brand(
    name: str = Form(...),
    description: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):

    existing_brand = db.query(Brand).filter(Brand.name == name).first()

    if existing_brand:
        raise HTTPException(status_code=400, detail="Brand already exists")

    image_url = None

    if image:
        upload_result = cloudinary.uploader.upload(
            image.file,
            folder="brands"
        )
        image_url = upload_result.get("secure_url")

    new_brand = Brand(
        name=name,
        description=description,
        image=image_url  
    )

    db.add(new_brand)
    db.commit()
    db.refresh(new_brand)

    return new_brand


@router.get("/", response_model=list[BrandResponse])
def get_brands(
    db: Session = Depends(get_db)
):

    brands = db.query(Brand).all()

    return brands


@router.get("/{brand_id}", response_model=BrandResponse)
def get_brand(
    brand_id: int,
    db: Session = Depends(get_db)
):

    brand = db.query(Brand).filter(
        Brand.id == brand_id
    ).first()

    if not brand:

        raise HTTPException(
            status_code=404,
            detail="Brand not found"
        )

    return brand



@router.put("/{brand_id}", response_model=BrandResponse)
def update_brand(
    brand_id: int,
    name: str = Form(...),
    description: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    brand = db.query(Brand).filter(Brand.id == brand_id).first()

    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")

    # Handle new image upload
    if image:
        upload_result = cloudinary.uploader.upload(
            image.file,
            folder="brands"
        )
        brand.image = upload_result.get("secure_url")

    brand.name = name
    brand.description = description

    db.commit()
    db.refresh(brand)

    return brand


@router.delete("/{brand_id}")
def delete_brand(
    brand_id: int,
    db: Session = Depends(get_db)
):

    brand = db.query(Brand).filter(
        Brand.id == brand_id
    ).first()

    if not brand:

        raise HTTPException(
            status_code=404,
            detail="Brand not found"
        )

    db.delete(brand)

    db.commit()

    return {
        "message": "Brand deleted successfully"
    }