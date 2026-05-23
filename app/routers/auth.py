from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas import user
from app.schemas.user import UserRegister, UserLogin
from app.utils.security import (
    hash_password,
    verify_password,
    create_access_token
)
from app.utils.dependencies import (
    get_current_user,
    admin_required
)

router = APIRouter()



@router.post("/register")
def register(user: UserRegister, db: Session = Depends(get_db)):

    
    user.email = user.email.lower()

    existing_user = db.query(User).filter(User.email == user.email).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already exists")

    new_user = User(
        username=user.username,
        email=user.email,
        password=hash_password(user.password),
        role="user"
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User created successfully"}




@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    user.email = user.email.lower()
    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Wrong password")

    token = create_access_token({
        "user_id": db_user.id,
        "sub": db_user.username,
        "email": db_user.email,
        "role": db_user.role
    })

    return {
    "access_token": token,
    "user": {
        "id": db_user.id,
        "username": db_user.username,
        "email": db_user.email,
        "role": db_user.role
    }
}


@router.get("/user/{user_id}")
def get_user(
    user_id: int,
    admin: User = Depends(admin_required),
    db: Session = Depends(get_db)
):

    db_user = db.query(User).filter(User.id == user_id).first()

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "user": {
            "id": db_user.id,
            "username": db_user.username,
            "email": db_user.email,
            "role": db_user.role
        }
    }



@router.get("/user")
def get_all_users(
    admin: User = Depends(admin_required),
    db: Session = Depends(get_db)
):

    users = db.query(User).all()

    return {
        "users": [
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.role
            }
            for user in users
        ]
    }





@router.put("/user/{user_id}")
def update_user(user_id: int, user: UserRegister, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == user_id).first()

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    db_user.username = user.username
    db_user.email = user.email
    db_user.password = hash_password(user.password)

    db.commit()
    db.refresh(db_user)

    return {"message": "User updated successfully", "user": db_user}



@router.delete("/user/{user_id}")
def delete_user(
    user_id: int,
    admin: User = Depends(admin_required),
    db: Session = Depends(get_db)
):
    db_user = db.query(User).filter(User.id == user_id).first()

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(db_user)
    db.commit()

    return {"message": "User deleted successfully"}


@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "role": current_user.role
    }