from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session, joinedload
from typing import Optional
import cloudinary.uploader

from backend.database import get_db
from backend.models.bundles import Bundle
from backend.models.products import Product
from backend.schemas.bundle import BundleResponse


router = APIRouter(
    prefix="/bundles",
    tags=["Bundles"]
)

@router.post("/", response_model=BundleResponse)
def create_bundle(
    name: str = Form(...),
    description: Optional[str] = Form(None),
    price: int = Form(...),
    featured: Optional[bool] = Form(False),
    product_ids: str = Form(...),
    image: Optional[UploadFile] = File(None),

    db: Session = Depends(get_db)
):

    existing_bundle = db.query(Bundle).filter(
        Bundle.name == name
    ).first()

    if existing_bundle:
        raise HTTPException(status_code=400, detail="Bundle already exists")

    image_url = None

    if image:
        upload_result = cloudinary.uploader.upload(
            image.file,
            folder="bundles"
        )

        image_url = upload_result.get("secure_url")

    ids_list = [int(id) for id in product_ids.split(",")]

    products = db.query(Product).filter(
        Product.id.in_(ids_list)
    ).all()

    new_bundle = Bundle(
        name=name,
        description=description,
        image=image_url,
        price=price,
        featured=featured
    )

    # attach products
    new_bundle.products = products

    db.add(new_bundle)
    db.commit()
    db.refresh(new_bundle)

    return new_bundle


@router.get("/", response_model=list[BundleResponse])
def get_bundles(db: Session = Depends(get_db)):

    bundles = db.query(Bundle).options(
        joinedload(Bundle.products)
    ).all()

    return bundles


@router.get("/{bundle_id}", response_model=BundleResponse)
def get_bundle(bundle_id: int, db: Session = Depends(get_db)):

    bundle = db.query(Bundle).options(
        joinedload(Bundle.products)
    ).filter(
        Bundle.id == bundle_id
    ).first()

    if not bundle:
        raise HTTPException(status_code=404, detail="Bundle not found")

    return bundle

@router.put("/{bundle_id}")
def update_bundle(
    bundle_id: int,
    name: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    price: Optional[int] = Form(None),
    featured: Optional[bool] = Form(None),
    product_ids: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),

    db: Session = Depends(get_db)
):

    bundle = db.query(Bundle).filter(
        Bundle.id == bundle_id
    ).first()

    if not bundle:
        raise HTTPException(status_code=404, detail="Bundle not found")

    if name:
        bundle.name = name

    if description:
        bundle.description = description

    if price is not None:
        bundle.price = price

    if featured is not None:
        bundle.featured = featured

    if product_ids:
        ids_list = [int(id) for id in product_ids.split(",")]

        products = db.query(Product).filter(
            Product.id.in_(ids_list)
        ).all()

        bundle.products = products

    if image:
        upload_result = cloudinary.uploader.upload(
            image.file,
            folder="bundles"
        )

        image_url = upload_result.get("secure_url")
        bundle.image = image_url

    db.commit()
    db.refresh(bundle)

    return bundle



@router.delete("/{bundle_id}")
def delete_bundle(bundle_id: int, db: Session = Depends(get_db)):

    bundle = db.query(Bundle).filter(
        Bundle.id == bundle_id
    ).first()

    if not bundle:
        raise HTTPException(status_code=404, detail="Bundle not found")

    db.delete(bundle)
    db.commit()

    return {"message": "Bundle deleted successfully"}