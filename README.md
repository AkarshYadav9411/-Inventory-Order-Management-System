# 📦 Inventory & Order Management System

A full-stack web application that helps businesses manage their products, customers, and orders from a single interface. Built with FastAPI, React, PostgreSQL, and Docker — the entire system runs with a single command and is deployed online for immediate access.

---

## 🔗 Live Demo

| Component | Link |
|-----------|------|
| 🌐 Frontend | [inventory-app.vercel.app](https://inventory-order-management-system-dusky.vercel.app/) |
| ⚙️ Backend API | [inventory-api.onrender.com](https://inventory-order-management-system-b945.onrender.com) |

---

## 📁 Project Structure

```
InventoryOrderManagementSystem/
├── backend/
│   ├── alembic/
│   │   └── versions/           # Database migration files
│   ├── app/
│   │   ├── api/                # Route handlers (products, customers, orders)
│   │   ├── core/               # Config & security
│   │   ├── models/             # SQLAlchemy ORM models
│   │   ├── schemas/            # Pydantic request/response schemas
│   │   ├── services/           # Business logic layer
│   │   └── main.py             # FastAPI app entry point
│   ├── tests/
│   │   ├── test_products.py
│   │   ├── test_customers.py
│   │   └── test_orders.py
│   ├── .env.example
│   ├── alembic.ini
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── api/                # Axios API clients
│   │   ├── components/         # Reusable UI components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── pages/              # Dashboard, Products, Customers, Orders
│   │   ├── routes/             # React Router config
│   │   ├── utils/              # Helper functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── docs/
│   ├── API.md
│   └── DEPLOYMENT.md
├── docker-compose.yml
└── .env.example
```

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| Backend | Python, FastAPI, SQLAlchemy 2.0 |
| Database | PostgreSQL 16, Alembic (migrations) |
| Validation | Pydantic v2 |
| Frontend | React (JavaScript), Vite |
| UI & Styling | Tailwind CSS, Lucide React, Recharts |
| HTTP Client | Axios, React Query |
| Containerization | Docker, Docker Compose |
| Testing | pytest, pytest-cov |
| Version Control | Git |

---

## ✨ Features

- 🗂️ **Product Management** — Add, view, edit, and delete products with unique SKU enforcement and stock validation
- 👥 **Customer Management** — Manage customers with unique email enforcement and full CRUD support
- 🛒 **Order Management** — Create orders with automatic inventory checks, stock deduction, and server-side total calculation
- 📊 **Analytics Dashboard** — Live summary of total products, customers, orders, and low-stock alerts
- 🔒 **Data Validation** — All requests validated via Pydantic before any database operation
- 🐳 **Docker-First** — Entire stack runs with a single `docker compose up --build`; migrations apply automatically on startup
- 🧪 **Test Coverage** — pytest suite covering product, customer, and order flows with coverage reporting

---

## 🚀 Quick Start (Docker)

> Make sure Docker and Docker Compose are installed on your machine.

**1. Clone the repository**

```bash
git clone https://github.com/AkarshYadav9411/-Inventory-Order-Management-System.git
cd InventoryOrderManagementSystem
```

**2. Set up environment variables**

```bash
cp .env.example .env
```

Open `.env` and fill in your database password and secret key.

**3. Start everything**

```bash
# Build and start all containers (first time or after code changes)
docker compose up --build

# Start without rebuilding (subsequent runs)
docker compose up

# Run in background (detached mode)
docker compose up -d

# Stop all containers
docker compose down

# Stop and remove volumes (wipes the database)
docker compose down -v

# View live logs
docker compose logs -f

# View logs for a specific service
docker compose logs -f backend
docker compose logs -f frontend
```

**4. Open in your browser**

| Service | URL |
|---------|-----|
| Frontend | http://localhost:8080 |
| Backend API Docs | http://localhost:8000/docs |
| Health Check | http://localhost:8000/health |

> On first run, Alembic migrations are applied automatically before the API starts.

---

## 🔧 Local Development (Without Docker)

### Backend

```bash
cd backend

# Create and activate virtual environment
python -m venv .venv

# Windows
.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt

# Apply database migrations
alembic upgrade head

# Start the development server
uvicorn app.main:app --reload
```

Run tests:

```bash
pytest --cov=app --cov-report=term-missing
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Create a `frontend/.env` file with:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

---

## 🌍 Environment Variables

### Backend (`backend/.env`)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/inventory_db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS=["http://localhost:5173","http://localhost:8080"]
```

### Frontend (`frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### PostgreSQL

```env
POSTGRES_DB=inventory_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-password-here
```

---

## 📡 API Reference

### Response Format

Every API response follows the same envelope format, making it easy to handle errors consistently on the frontend.

**Success:**
```json
{
  "success": true,
  "data": {}
}
```

**Error:**
```json
{
  "success": false,
  "message": "SKU already exists",
  "errors": null
}
```

### Endpoints

#### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/products` | Create a new product |
| `GET` | `/api/v1/products` | List all products |
| `GET` | `/api/v1/products/{id}` | Get a product by ID |
| `PUT` | `/api/v1/products/{id}` | Update product details |
| `DELETE` | `/api/v1/products/{id}` | Delete a product |

#### Customers

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/customers` | Create a new customer |
| `GET` | `/api/v1/customers` | List all customers |
| `GET` | `/api/v1/customers/{id}` | Get a customer by ID |
| `DELETE` | `/api/v1/customers/{id}` | Delete a customer |

#### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/orders` | Create a new order |
| `GET` | `/api/v1/orders` | List all orders |
| `GET` | `/api/v1/orders/{id}` | Get order details by ID |
| `DELETE` | `/api/v1/orders/{id}` | Cancel / delete an order |

#### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/dashboard` | Get summary metrics |

Full interactive documentation is available at `/docs` (Swagger UI) when the backend is running.

---

## ⚙️ Business Logic

A few rules are enforced at the backend level regardless of what the frontend sends:

- Product SKUs must be unique — no two products can share the same code.
- Customer email addresses must be unique across the system.
- Product stock can never go below zero.
- Orders are rejected if the requested quantity exceeds available stock.
- When an order is successfully created, stock is automatically deducted for each ordered item.
- The total order amount is always calculated server-side based on current product prices.
- All incoming request data is validated by Pydantic before any database operation runs.

---

## ☁️ Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for step-by-step instructions for deploying to Render (backend), Neon (PostgreSQL), and Vercel (frontend).

### Backend start command (production)

```bash
alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Required production environment variables

```
DATABASE_URL
SECRET_KEY
ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES
CORS_ORIGINS
```

### Frontend

Set `VITE_API_BASE_URL` to your deployed backend URL, build, and deploy the `dist/` folder to any static host.

```bash
npm run build
```

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
