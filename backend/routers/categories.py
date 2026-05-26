from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional
import cloudinary.uploader
from backend.database import get_db
from backend.models.category import Category
from backend.schemas.category import CategoryResponse

router = APIRouter(
    prefix="/categories",
    tags=["Categories"]
)


@router.post("/")
def create_category(
    name: str = Form(...),
    slug: str = Form(...),
    icon: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):

    existing_category = db.query(Category).filter(Category.name == name).first()

    if existing_category:
        raise HTTPException(status_code=400, detail="Category already exists")

    image_url = None

    if image:
        upload_result = cloudinary.uploader.upload(
            image.file,
            folder="categories"
        )
        image_url = upload_result.get("secure_url")

    new_category = Category(
        name=name,
        slug=slug,
        icon=icon,
        description=description,
        image=image_url  
    )

    db.add(new_category)
    db.commit()
    db.refresh(new_category)

    return new_category


@router.get("/", response_model=list[CategoryResponse])
def get_categories(
    db: Session = Depends(get_db)
):

    categories = db.query(Category).all()

    return categories


@router.get("/{category_id}", response_model=CategoryResponse)
def get_category(
    category_id: int,
    db: Session = Depends(get_db)
):

    category = db.query(Category).filter(
        Category.id == category_id
    ).first()

    if not category:

        raise HTTPException(
            status_code=404,
            detail="Category not found"
        )

    return category



@router.put("/{category_id}", response_model=CategoryResponse)
def update_category(
    category_id: int,
    name: str = Form(...),
    slug: str = Form(...),
    icon: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    category = db.query(Category).filter(Category.id == category_id).first()

    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    # Handle new image upload
    if image:
        upload_result = cloudinary.uploader.upload(
            image.file,
            folder="categories"
        )
        category.image = upload_result.get("secure_url")

    category.name = name
    category.slug = slug
    category.icon = icon
    category.description = description

    db.commit()
    db.refresh(category)

    return category


@router.delete("/{category_id}")
def delete_category(
    category_id: int,
    db: Session = Depends(get_db)
):

    category = db.query(Category).filter(
        Category.id == category_id
    ).first()

    if not category:

        raise HTTPException(
            status_code=404,
            detail="Category not found"
        )

    db.delete(category)

    db.commit()

    return {
        "message": "Category deleted successfully"
    }