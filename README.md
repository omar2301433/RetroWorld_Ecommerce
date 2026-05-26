# E-Commerce Web Application

## 📌 Overview

This is a full-stack e-commerce web application built using **HTML, CSS, JavaScript** for the frontend and **FastAPI + SQLAlchemy** for the backend. The project includes product management, categories, brands, user authentication, and an admin dashboard.

---

## 🚀 Features

### User Side

* Browse products
* View product details
* Filter by categories and brands
* Search products
* User authentication (login/register)

### Admin Dashboard

* Add / Edit / Delete products
* Manage categories
* Manage brands
* Manage users
* Upload product images

---

## 🏗️ Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript (Vanilla)

### Backend

* FastAPI
* SQLAlchemy
* PostgreSQL / SQLite (depending on setup)
* JWT Authentication

### Other Tools

* Cloudinary (for image uploads)
* Uvicorn (ASGI server)

---

## 📂 Project Structure

```
backend/
 ├── app/
 │   ├── models/
 │   ├── routers/
 │   ├── schemas/
 │   ├── database.py
 │   └── main.py
frontend/
 ├── assets/
 ├── js/
 ├── css/
 ├── pages/
 └── index.html
```

---

## ⚙️ Installation & Setup

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd your-project
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

pip install -r requirements.txt
uvicorn backend.main:app --reload
```

### 3. Frontend Setup
To run frontend on python server
```bash
cd frontend
python -m http.server 5500   
```
 
---

## 🔐 Authentication

This project uses JWT-based authentication. After login, the token is stored in localStorage and used for protected API requests.

---

## 📡 API Endpoints (Examples)

### Products

* `GET /api/products/` → Get all products
* `POST /api/products/` → Create product
* `PUT /api/products/{id}` → Update product
* `DELETE /api/products/{id}` → Delete product

### Categories

* `GET /api/categories/`
* `POST /api/categories/`

### Brands

* `GET /api/brands/`
* `POST /api/brands/`

---

## 🛠️ Future Improvements

* Add payment gateway integration
* Add order & cart system
* Improve UI with React / Next.js
* Add product reviews & ratings

---

## 👨‍💻 Author

Built by Omar Ahmed

---

## 📄 License

This project is for learning purposes only.
