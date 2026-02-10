# TimeWeaver Project - Complete Setup Guide
## Backend + Frontend (2 Repositories)

**Project**: TimeWeaver - Intelligent Academic Timetable System  
**Database**: PostgreSQL (timeweaver_db)  
**Backend**: FastAPI (Python 3.11+)  
**Frontend**: React/Vue (Node.js 18+)

---

## 📁 Repository Structure

This project uses **TWO SEPARATE REPOSITORIES**:

```
📦 timeweaver-backend/          (This repository)
├── app/
│   ├── api/v1/endpoints/       # API endpoints
│   ├── models/                 # Database models
│   ├── schemas/                # Pydantic schemas
│   ├── services/               # Business logic
│   ├── middleware/             # Audit logging
│   └── core/                   # Auth, security
├── tests/                      # Backend tests
├── alembic/                    # Database migrations
├── requirements.txt
├── .env                        # Environment variables
└── README.md

📦 timeweaver-frontend/         (Separate repository)
├── src/
│   ├── pages/                  # React/Vue pages
│   ├── components/             # UI components
│   └── services/               # API integration
└── package.json
```

---

## 🚀 Quick Start (First Time Setup)

### Prerequisites

✅ **Python 3.11+** - Check: `python --version`  
✅ **PostgreSQL 15+** - Check: `psql --version`  
✅ **Node.js 18+** (for frontend) - Check: `node --version`

---

## 📊 PostgreSQL Database Setup

### Step 1: Install PostgreSQL

**Windows**:
```powershell
# Download from: https://www.postgresql.org/download/windows/
# Or use chocolatey:
choco install postgresql

# After installation, PostgreSQL service should auto-start
```

**Check if running**:
```powershell
# Check service status
Get-Service postgresql*

# Should show "Running"
```

### Step 2: Create Database

**Method 1: Using pgAdmin (GUI)**
1. Open **pgAdmin** (installed with PostgreSQL)
2. Connect to local server (password: your postgres password)
3. Right-click "Databases" → "Create" → "Database"
4. Name: `timeweaver_db`
5. Click "Save"

**Method 2: Using Command Line (psql)**
```powershell
# Connect to PostgreSQL
psql -U postgres

# Enter your postgres password when prompted
# Then create database:
CREATE DATABASE timeweaver_db;

# Verify:
\l  # List all databases - should see timeweaver_db

# Exit:
\q
```

### Step 3: Verify Connection

```powershell
# Test connection to new database
psql -U postgres -d timeweaver_db

# If successful, you'll see:
# timeweaver_db=#

# Exit:
\q
```

---

## 🔧 Backend Setup

### Step 1: Clone Repository

```powershell
cd C:\Users\[YourName]\Desktop\SWE

# If you haven't created separate backend repo yet:
# The backend is currently in: timeweaver_webapp\backend\
cd timeweaver_webapp\backend
```

### Step 2: Create Virtual Environment

```powershell
# Create virtual environment
python -m venv venv

# Activate it
.\venv\Scripts\activate

# You should see (venv) in your terminal prompt
```

### Step 3: Install Dependencies

```powershell
# Make sure venv is activated (see (venv) in prompt)
pip install -r requirements.txt

# This installs:
# - fastapi (web framework)
# - uvicorn (ASGI server)
# - sqlalchemy (ORM)
# - alembic (migrations)
# - asyncpg (PostgreSQL driver)
# - pydantic (validation)
# - python-jose (JWT)
# - passlib (password hashing)
# And more...
```

### Step 4: Configure Environment Variables

**Check your `.env` file** (already exists in backend folder):

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@localhost:5432/timeweaver_db

# API Configuration
API_V1_PREFIX=/api/v1
PROJECT_NAME=TimeWeaver API
DEBUG=True

# CORS (for frontend connections)
BACKEND_CORS_ORIGINS=["http://localhost:3000","http://localhost:5173"]

# Security
SECRET_KEY=dev-secret-key-change-in-production-abc123xyz
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

**⚠️ IMPORTANT**: Update `DATABASE_URL` with your PostgreSQL password!

**Current password in file**: `dark$citrus`  
**Replace with YOUR postgres password**

### Step 5: Run Database Migrations

```powershell
# Make sure you're in backend directory with venv activated
# Check: (venv) should be in prompt

# Run migrations to create all tables
alembic upgrade head

# You should see output like:
# INFO  [alembic.runtime.migration] Running upgrade -> a20ad5595bad, create user and audit log tables
# INFO  [alembic.runtime.migration] Running upgrade a20ad5595bad -> 7bcc83480b76, add password reset fields
```

**Verify tables were created**:
```powershell
psql -U postgres -d timeweaver_db

# List tables:
\dt

# You should see:
# - users
# - audit_logs
# - semesters
# - departments
# - courses
# - sections
# - rooms
# - time_slots
# - constraints
# etc.

# Exit:
\q
```

### Step 6: Create Admin User

```powershell
# Still in backend directory with venv activated
python -m app.scripts.create_admin

# Follow prompts:
# Username: admin
# Email: admin@timeweaver.com
# Password: Admin@123  (must have uppercase, lowercase, digit, special char)

# Verify:
psql -U postgres -d timeweaver_db -c "SELECT username, email, role FROM users;"

# Should show your admin user
```

### Step 7: Start Backend Server

```powershell
# Start the FastAPI server
uvicorn app.main:app --reload

# You should see:
# INFO:     Uvicorn running on http://127.0.0.1:8000
# INFO:     Application startup complete.
```

**Test it works**:
- Open browser: http://localhost:8000
- Should see: `{"message": "TimeWeaver API is running"}`
- API Docs: http://localhost:8000/docs (Swagger UI)

---

## 🎨 Frontend Setup (Separate Repository)

### Step 1: Create Frontend Project

**Choose React (Recommended)**:
```powershell
# Navigate to your projects folder
cd C:\Users\[YourName]\Desktop\SWE

# Create React app with Vite
npm create vite@latest timeweaver-frontend -- --template react

cd timeweaver-frontend
npm install
```

**Or choose Vue**:
```powershell
npm create vite@latest timeweaver-frontend -- --template vue

cd timeweaver-frontend
npm install
```

### Step 2: Install Required Libraries

```powershell
# API communication
npm install axios

# Routing
npm install react-router-dom
# or for Vue: npm install vue-router

# UI Components (choose one)
npm install @mui/material @emotion/react @emotion/styled  # Material-UI
# or: npm install antd  # Ant Design

# Timetable component (for Module 3)
npm install react-big-calendar

# Tables (for Module 2)
npm install @tanstack/react-table

# Charts (for Module 5)
npm install recharts
```

### Step 3: Configure Frontend Environment

Create `.env` file in `timeweaver-frontend/`:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
# or REACT_APP_API_BASE_URL if using Create React App
```

### Step 4: Create API Service

Create `timeweaver-frontend/src/services/api.js`:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'
});

// Add JWT token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
api.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Step 5: Start Frontend Server

```powershell
# In timeweaver-frontend directory
npm run dev

# Should see:
# VITE ready in XXX ms
# ➜  Local:   http://localhost:5173/
```

---

## 🏃 Running the Full Project

You need **TWO terminal windows**:

### Terminal 1: Backend
```powershell
cd timeweaver_webapp\backend
.\venv\Scripts\activate
uvicorn app.main:app --reload
```
✅ Backend running on: http://localhost:8000

### Terminal 2: Frontend
```powershell
cd timeweaver-frontend
npm run dev
```
✅ Frontend running on: http://localhost:5173

---

## 📝 Module Development Guide

### Each Student Works On:

**Backend Files** (in `timeweaver-backend`):
- API endpoints: `app/api/v1/endpoints/[module].py`
- Services: `app/services/[module]_service.py`
- Tests: `tests/test_[module].py`

**Frontend Files** (in `timeweaver-frontend`):
- Pages: `src/pages/[module]/[Page].jsx`
- Components: `src/components/[Module]/[Component].jsx`
- Services: `src/services/[module]Service.js`
- Tests: `src/__tests__/[module].test.jsx`

### Module Assignments

| Module | Student | Backend Files | Frontend Files |
|--------|---------|---------------|----------------|
| 1. Auth | Student A | `auth.py`, `users.py` | `Login.jsx`, `Profile.jsx` |
| 2. Academic | Student B | `courses.py`, `departments.py` | `Courses.jsx`, `Departments.jsx` |
| 3. Timetable | Student C | `timetables.py`, `timetable_generator.py` | `GenerateTimetable.jsx` |
| 4. Faculty | Student D | `faculty.py`, `workload_calculator.py` | `FacultyDashboard.jsx` |
| 5. Dashboard | Student E | `audit_logs.py` | `Dashboard.jsx`, `AuditLogs.jsx` |

---

## 🧪 Testing

### Backend Tests

```powershell
cd timeweaver-backend
.\venv\Scripts\activate

# Run all tests
pytest

# Run specific module tests
pytest tests/test_auth.py -v

# With coverage
pytest --cov=app --cov-report=html

# View coverage report
# Open htmlcov/index.html in browser
```

### Frontend Tests

```powershell
cd timeweaver-frontend

# Run tests
npm test

# With coverage
npm test -- --coverage

# E2E tests (if using Cypress)
npm run cypress:open
```

---

## 🔍 Troubleshooting

### Backend Issues

**Problem**: `ModuleNotFoundError: No module named 'app'`
```powershell
# Make sure venv is activated
.\venv\Scripts\activate

# Reinstall dependencies
pip install -r requirements.txt
```

**Problem**: `FATAL: password authentication failed for user "postgres"`
```powershell
# Fix .env file with correct password
# Edit: DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@localhost:5432/timeweaver_db
```

**Problem**: `FATAL: database "timeweaver_db" does not exist`
```powershell
# Create the database
psql -U postgres
CREATE DATABASE timeweaver_db;
\q
```

**Problem**: `alembic.util.exc.CommandError: Can't locate revision identified by 'head'`
```powershell
# Reset migrations
alembic downgrade base
alembic upgrade head
```

**Problem**: `Port 8000 is already in use`
```powershell
# Find and kill process using port 8000
netstat -ano | findstr :8000
taskkill /PID [PID_NUMBER] /F

# Or run on different port
uvicorn app.main:app --reload --port 8001
```

### Frontend Issues

**Problem**: `ERR_CONNECTION_REFUSED` when calling API
```powershell
# 1. Make sure backend is running
# Check: http://localhost:8000

# 2. Check CORS in backend app/main.py
# Should include: http://localhost:5173

# 3. Check .env file has correct API URL
# VITE_API_BASE_URL=http://localhost:8000/api/v1
```

**Problem**: `401 Unauthorized` on all requests
```javascript
// Check localStorage has token
console.log(localStorage.getItem('token'));

// If null, login again
// Token might be expired (30 min expiry)
```

### Database Issues

**Problem**: PostgreSQL service not running
```powershell
# Start PostgreSQL service
net start postgresql-x64-15

# or use Services app (services.msc)
# Find "postgresql" and start it
```

**Problem**: Can't connect to database
```powershell
# Check if PostgreSQL is listening
netstat -an | findstr :5432

# Check pg_hba.conf allows local connections
# Location: C:\Program Files\PostgreSQL\15\data\pg_hba.conf
# Should have: host all all 127.0.0.1/32 md5
```

---

## 📚 Useful Commands

### Backend

```powershell
# Activate virtual environment
.\venv\Scripts\activate

# Deactivate virtual environment
deactivate

# Run server
uvicorn app.main:app --reload

# Run server on different port
uvicorn app.main:app --reload --port 8001

# Create new migration
alembic revision -m "description"

# Apply migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1

# View migration history
alembic history

# Check current migration
alembic current
```

### Database

```powershell
# Connect to database
psql -U postgres -d timeweaver_db

# List databases
\l

# List tables
\dt

# Describe table
\d users

# View data
SELECT * FROM users;

# Count records
SELECT COUNT(*) FROM users;

# Exit psql
\q
```

### Frontend

```powershell
# Install packages
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Run linter
npm run lint
```

---

## 🎯 Current Project Status

### ✅ Completed (Backend)

**Epic 7: Phase 1 - User Management & RBAC**
- ✅ Authentication endpoints (login, logout, refresh, forgot/reset password)
- ✅ User CRUD endpoints (admin + self-service)
- ✅ JWT token management
- ✅ Password security with bcrypt
- ✅ RBAC (Admin, Faculty, Student roles)

**Epic 7: Phase 2 - Audit Logging**
- ✅ Audit logging middleware (auto-captures all operations)
- ✅ Audit service with data sanitization
- ✅ Audit logs query API (admin only)

**Epic 1: Academic Entities**
- ✅ Semesters, Departments, Courses, Sections, Rooms, Time Slots, Constraints
- ✅ All CRUD endpoints (48 total)
- ✅ RBAC protection on all write operations

**Database**
- ✅ PostgreSQL database (timeweaver_db)
- ✅ 2 migrations applied
- ✅ All tables created

**Total**: 64 API endpoints ready to use!

### ⚠️ To Be Built

**Backend**:
- Module 3: Timetable generation algorithm
- Module 4: Faculty management & workload calculator

**Frontend**:
- All 5 modules need UI implementation
- Login page, admin pages, timetable view, etc.

---

## 📖 API Documentation

Once backend is running, visit:

**Swagger UI**: http://localhost:8000/docs  
**ReDoc**: http://localhost:8000/redoc

### Quick API Test

```javascript
// Test login (in browser console or Postman)
fetch('http://localhost:8000/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: 'username=admin&password=Admin@123'
})
.then(r => r.json())
.then(data => {
  console.log('Token:', data.access_token);
  localStorage.setItem('token', data.access_token);
});

// Test get current user
fetch('http://localhost:8000/api/v1/auth/me', {
  headers: { 
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
.then(r => r.json())
.then(data => console.log('User:', data));
```

---

## 🔒 Default Credentials

**After running `create_admin` script**:

```
Username: admin
Password: Admin@123  (or whatever you set)
Role: ADMIN
Email: admin@timeweaver.com
```

**Security Notes**:
- ✅ Passwords hashed with bcrypt
- ✅ JWT tokens expire in 30 minutes
- ✅ Password must have: uppercase, lowercase, digit, special character
- ✅ Minimum 8 characters

---

## 📦 What's Included in Backend

### API Endpoints (64 total)

**Authentication (6 endpoints)**:
- POST `/api/v1/auth/login`
- POST `/api/v1/auth/logout`
- GET `/api/v1/auth/me`
- POST `/api/v1/auth/refresh`
- POST `/api/v1/auth/forgot-password`
- POST `/api/v1/auth/reset-password`

**Users (8 endpoints)**:
- GET `/api/v1/users` (list all - admin)
- POST `/api/v1/users` (create - admin)
- GET `/api/v1/users/{id}` (get one - admin)
- PUT `/api/v1/users/{id}` (update - admin)
- DELETE `/api/v1/users/{id}` (soft delete - admin)
- GET `/api/v1/users/me/profile` (self)
- PUT `/api/v1/users/me/profile` (self)
- PUT `/api/v1/users/me/password` (self)

**Academic Entities (48 endpoints)**:
- 6 endpoints each for: Semesters, Departments, Sections, Courses, Elective Groups, Rooms, Time Slots, Constraints

**Audit Logs (2 endpoints)**:
- GET `/api/v1/audit-logs` (query with filters - admin)
- GET `/api/v1/audit-logs/{id}` (get specific - admin)

---

## 🤝 Team Collaboration

### Git Workflow

**Backend Repository**:
```powershell
# Create feature branch
git checkout -b module-[X]-[feature]-backend

# Make changes
git add .
git commit -m "feat(module-X): description"

# Push
git push origin module-[X]-[feature]-backend

# Create Pull Request on GitHub/GitLab
```

**Frontend Repository**:
```powershell
# Same process
git checkout -b module-[X]-[feature]-frontend
```

---

## 📞 Support

### Common Resources

- **FastAPI Docs**: https://fastapi.tiangolo.com/
- **React Docs**: https://react.dev/
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **SQLAlchemy**: https://docs.sqlalchemy.org/
- **Pydantic**: https://docs.pydantic.dev/

### Database Connection String Format

```
postgresql://[user]:[password]@[host]:[port]/[database]

Example:
postgresql://postgres:mypassword@localhost:5432/timeweaver_db
```

---

## ✅ Pre-Development Checklist

Before starting development, ensure:

- [ ] PostgreSQL installed and running
- [ ] Database `timeweaver_db` created
- [ ] Backend venv created and activated
- [ ] Dependencies installed (`pip install -r requirements.txt`)
- [ ] `.env` file configured with correct database password
- [ ] Migrations applied (`alembic upgrade head`)
- [ ] Admin user created
- [ ] Backend server starts successfully
- [ ] Frontend dependencies installed
- [ ] Frontend `.env` configured
- [ ] Frontend dev server starts
- [ ] Can access http://localhost:8000/docs
- [ ] Can access http://localhost:5173

---

## 🎓 Next Steps

1. ✅ **Review MODULE_SPECIFICATIONS.md** - Detailed module breakdown
2. ✅ **Choose your module** (1-5)
3. ✅ **Start with frontend pages** (backend already done for Modules 1, 2, 5)
4. ✅ **Write tests** as you go
5. ✅ **Document your work** (testing docs required)
6. ✅ **Demo your module** when complete

---

## 📄 Additional Documentation

- `MODULE_SPECIFICATIONS.md` - Complete module breakdown with code examples
- `backend/README.md` - Backend-specific documentation
- `alembic/README` - Database migration guide
- `tests/README.md` - Testing guide (create this)

---

**Happy Coding! 🚀**

For questions, check MODULE_SPECIFICATIONS.md or ask your team lead.
