# Inventory & Order Management System

Production-ready full-stack inventory and order management application built with FastAPI, SQLAlchemy 2.0, PostgreSQL 16, React, Vite, Tailwind CSS, and Docker Compose.

## Features

- Product CRUD with unique SKU, price, and stock validation
- Customer CRUD with unique email and phone/email validation
- Transactional order creation with inventory checks and automatic stock deduction
- Dashboard metrics for products, customers, orders, and low stock products
- Standard API response envelope and global exception handling
- Alembic migrations, pytest coverage, Dockerized backend/frontend/database

## Local Docker Setup

1. Copy `.env.example` to `.env` and replace secrets/passwords.
2. Run:

```bash
docker compose up --build
```

3. Open:

- Frontend: `http://localhost:8080`
- Backend docs: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/health`

The backend container runs `alembic upgrade head` before starting the API.

## Backend Development

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```

Run tests:

```bash
pytest --cov=app --cov-report=term-missing
```

## Frontend Development

```bash
cd frontend
npm install
npm run dev
```

Set `VITE_API_BASE_URL=http://localhost:8000/api/v1` in `frontend/.env`.

## Environment Variables

Backend:

- `DATABASE_URL`
- `SECRET_KEY`
- `ALGORITHM`
- `ACCESS_TOKEN_EXPIRE_MINUTES`
- `CORS_ORIGINS`

Frontend:

- `VITE_API_BASE_URL`

PostgreSQL:

- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`

## API Response Format

Success:

```json
{
  "success": true,
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "SKU already exists",
  "errors": null
}
```

## Main API Endpoints

- `POST /api/v1/products`
- `GET /api/v1/products`
- `GET /api/v1/products/{id}`
- `PUT /api/v1/products/{id}`
- `DELETE /api/v1/products/{id}`
- `POST /api/v1/customers`
- `GET /api/v1/customers`
- `GET /api/v1/customers/{id}`
- `DELETE /api/v1/customers/{id}`
- `POST /api/v1/orders`
- `GET /api/v1/orders`
- `GET /api/v1/orders/{id}`
- `DELETE /api/v1/orders/{id}`
- `GET /api/v1/dashboard`

## Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) and [docs/API.md](docs/API.md).
