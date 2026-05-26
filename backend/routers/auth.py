from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from jose import JWTError
from backend.database import get_db
from backend.models.user import User
from backend.schemas import user
from backend.schemas.user import UserRegister, UserLogin
from pydantic import BaseModel
from backend.utils.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    verify_refresh_token  
)
from backend.utils.dependencies import (
    get_current_user,
    admin_required
)

router = APIRouter()


class RefreshRequest(BaseModel):
    refresh_token: str


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
        raise HTTPException(status_code=404, detail="Invalid email or password")

    if not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token({
        "user_id": db_user.id,
        "sub": db_user.username,
        "email": db_user.email,
        "role": db_user.role
    })

    refresh_token = create_refresh_token({
        "user_id": db_user.id,
        "sub": db_user.username,
        "email": db_user.email,
        "role": db_user.role
    })

    return {
    "access_token": access_token,
    "refresh_token": refresh_token,
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
def update_user(
    user_id: int,
    user: UserRegister,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    db_user = db.query(User).filter(User.id == user_id).first()

    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if current_user.id != user_id and current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Not authorized"
        )

  
    existing_email = db.query(User).filter(
        User.email == user.email.lower(),
        User.id != user_id
    ).first()

    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    db_user.username = user.username
    db_user.email = user.email.lower()
    db_user.password = hash_password(user.password)

    db.commit()
    db.refresh(db_user)

    return {
        "message": "User updated successfully",
        "user": {
            "id": db_user.id,
            "username": db_user.username,
            "email": db_user.email,
            "role": db_user.role
        }
    }



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




@router.post("/refresh")
def refresh(payload: RefreshRequest, db: Session = Depends(get_db)):
    try:
        token_data = verify_refresh_token(payload.refresh_token)
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    db_user = db.query(User).filter(User.id == token_data["user_id"]).first()

    if not db_user:
        raise HTTPException(status_code=401, detail="User not found")

    new_access_token = create_access_token({
        "user_id": db_user.id,
        "sub": db_user.username,
        "email": db_user.email,
        "role": db_user.role
    })

    return {"access_token": new_access_token}