from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.database import Base, engine
from backend.routers import auth, brands, categories, products

Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS (IMPORTANT after splitting)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "https://your-frontend-domain.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API ONLY
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(categories.router, prefix="/api", tags=["Categories"])
app.include_router(brands.router, prefix="/api", tags=["Brands"])
app.include_router(products.router, prefix="/api", tags=["Products"])