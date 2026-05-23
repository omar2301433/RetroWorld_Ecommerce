from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import Optional
import shutil
import os
import uuid

from app.database import get_db
from app.models.category import Category
from app.schemas.category import CategoryResponse

router = APIRouter(
    prefix="/categories",
    tags=["Categories"]
)

UPLOAD_DIR = "app/Views/frontend/assets/categories"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/", response_model=CategoryResponse)
def create_category(
    name: str = Form(...),
    slug: str = Form(...),
    icon: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    existing_category = db.query(Category).filter(
        Category.name == name
    ).first()

    if existing_category:
        raise HTTPException(status_code=400, detail="Category already exists")

    image_filename = None
    if image and image.filename:
        ext = os.path.splitext(image.filename)[1]
        image_filename = f"{uuid.uuid4().hex}{ext}"
        with open(f"{UPLOAD_DIR}/{image_filename}", "wb") as f:
            shutil.copyfileobj(image.file, f)

    new_category = Category(
        name=name,
        slug=slug,
        icon=icon,
        description=description,
        image=f"/static/assets/categories/{image_filename}" if image_filename else None
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
    if image and image.filename:
        # Delete old image file if exists
        if category.image:
            old_path = f"app/Views/frontend{category.image}"
            if os.path.exists(old_path):
                os.remove(old_path)

        ext = os.path.splitext(image.filename)[1]
        image_filename = f"{uuid.uuid4().hex}{ext}"
        with open(f"{UPLOAD_DIR}/{image_filename}", "wb") as f:
            shutil.copyfileobj(image.file, f)
        category.image = f"/static/assets/categories/{image_filename}"

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