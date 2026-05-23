from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from app.database import Base, engine
from app.routers import auth
from app.routers import categories
from app.models.category import Category
from app.models.user import User



Base.metadata.create_all(bind=engine)

app = FastAPI()

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files
app.mount(
    "/static",
    StaticFiles(directory="app/Views/frontend"),
    name="static"
)

# Pages
@app.get("/")
def home():
    return FileResponse("app/Views/frontend/html/index.html")


@app.get("/login")
def login_page():
    return FileResponse("app/Views/frontend/html/login.html")


@app.get("/register")
def register_page():
    return FileResponse("app/Views/frontend/html/register.html")


@app.get("/profile")
def profile_page():
    return FileResponse("app/Views/frontend/html/profile.html")

@app.get("/dashboard")
def admin_dashboard():
    return FileResponse("app/Views/frontend/admin/dashboard.html")


# API Routers
app.include_router(auth.router)
app.include_router(categories.router)