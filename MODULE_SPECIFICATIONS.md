# TimeWeaver Project - Module Specifications
## Full-Stack Development Guide for Team Members

**Project**: TimeWeaver - Intelligent Academic Timetable System  
**Architecture**: FastAPI Backend + React/Vue Frontend (2 Separate Repositories)  
**Team Size**: 5 Students  
**Each Module**: Complete vertical slice (Backend + Frontend + Integration + Testing)

---

## Table of Contents
1. [Repository Structure](#repository-structure)
2. [Prerequisites & Setup](#prerequisites--setup)
3. [Documentation Standards](#documentation-standards)
4. [Module 1: Authentication & User Management](#module-1-authentication--user-management)
5. [Module 2: Academic Setup & Course Management](#module-2-academic-setup--course-management)
6. [Module 3: Timetable Generation & Scheduling](#module-3-timetable-generation--scheduling)
7. [Module 4: Faculty Management & Workload](#module-4-faculty-management--workload)
8. [Module 5: System Monitoring & Admin Dashboard](#module-5-system-monitoring--admin-dashboard)
9. [Testing Requirements](#testing-requirements)
10. [Integration Guidelines](#integration-guidelines)
11. [Git Workflow](#git-workflow)

---

## Repository Structure

### 🚀 **TWO SEPARATE REPOSITORIES**

#### Repository 1: `timeweaver_backend`
```
timeweaver_backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── endpoints/      # API endpoint files (your code here)
│   │       │   ├── auth.py
│   │       │   ├── users.py
│   │       │   ├── courses.py
│   │       │   ├── departments.py
│   │       │   ├── sections.py
│   │       │   ├── semesters.py
│   │       │   ├── elective_groups.py
│   │       │   ├── constraints.py
│   │       │   ├── rooms.py
│   │       │   ├── time_slots.py
│   │       │   ├── audit_logs.py
│   │       │   └── timetables.py
│   │       └── router.py
│   ├── models/                 # Database models (SQLAlchemy)
│   ├── schemas/                # Pydantic validation schemas
│   ├── services/               # Business logic
│   ├── middleware/             # Request/response interceptors
│   ├── core/                   # Auth, security, config
│   ├── db/                     # Database session and utilities
│   │   ├── base.py
│   │   └── session.py
│   └── scripts/                # Utility scripts
│       └── create_admin.py
├── tests/                      # Backend tests (pytest)
├── alembic/                    # Database migrations
│   └── versions/
├── requirements.txt
├── .env
├── .env.example
├── .gitignore
├── alembic.ini
├── README.md
├── SETUP_GUIDE.md
└── MODULE_SPECIFICATIONS.md
```

#### Repository 2: `timeweaver_frontend`
```
timeweaver_frontend/
├── src/
│   ├── pages/                  # Page components (your code here)
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Profile.jsx
│   │   ├── admin/
│   │   │   ├── Courses.jsx
│   │   │   ├── GenerateTimetable.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── faculty/
│   │   │   └── Dashboard.jsx
│   │   └── student/
│   │       └── ViewTimetable.jsx
│   ├── components/             # Reusable UI components
│   ├── services/               # API integration layer
│   │   ├── api.js
│   │   ├── authService.js
│   │   └── ...
│   ├── utils/                  # Helper functions
│   └── App.jsx
├── tests/                      # Frontend tests (Jest/Cypress)
├── public/
├── package.json
├── .env
└── README.md
```

---

## Prerequisites & Setup

### Initial Setup (One-time)

#### 1. Clone Both Repositories

```bash

# Clone backend
git clone <timeweaver_backend-repo-url>

# Clone frontend
git clone <timeweaver_frontend-repo-url>
```

#### 2. Backend Setup

```bash
cd timeweaver_backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Setup environment variables
# Create .env file with:
DATABASE_URL=postgresql+asyncpg://user:password@localhost/timeweaver
SECRET_KEY=your-secret-key-here
DEBUG=True
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Run database migrations
alembic upgrade head

# Create admin user
python -m app.scripts.create_admin

# Start backend server
uvicorn app.main:app --reload
# Backend running at: http://localhost:8000
```

#### 3. Frontend Setup

```bash
cd timeweaver_frontend

# Install dependencies
npm install

# Setup environment variables
# Create .env file with:
VITE_API_BASE_URL=http://localhost:8000/api/v1
# or REACT_APP_API_BASE_URL if using Create React App

# Start frontend dev server
npm run dev
# Frontend running at: http://localhost:5173 (Vite)
# or http://localhost:3000 (Create React App)
```

#### 4. Database Setup

```bash
# Install PostgreSQL 15+
# Create database
psql -U postgres
CREATE DATABASE timeweaver;
\q
```

---

## Running the Project Locally

**You need 2 terminal windows:**

### Terminal 1: Backend
```bash
cd timeweaver_backend
venv\Scripts\activate
uvicorn app.main:app --reload
```

### Terminal 2: Frontend
```bash
cd timeweaver_frontend
npm run dev
```

**Access**:
- Frontend: http://localhost:5173
- Backend API Docs: http://localhost:8000/docs
- Backend: http://localhost:8000

---

## API Connection Between Repos

### Frontend API Configuration

**File**: `timeweaver_frontend/src/services/api.js`

```javascript
import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'
});

// Add JWT token to all requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors globally
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

### Backend CORS Configuration

**File**: `timeweaver_backend/app/main.py`

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",   # Create React App
        "http://localhost:5173",   # Vite dev
        "http://localhost:4173",   # Vite preview
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Documentation Standards

### Code Comments Pattern

**Backend (Python)**:
```python
"""
Module: Authentication & User Management
Repository: timeweaver_backend
Owner: [Your Name]
Epic: 7 - Access Control & Management

This module handles user authentication, JWT token generation,
and role-based access control.

Dependencies:
    - app.core.security (JWT functions)
    - app.models.user (User model)
"""

def login_user(username: str, password: str):
    """
    Authenticate user and generate JWT token.
    
    Args:
        username: User's username
        password: Plain text password
        
    Returns:
        dict: {access_token: str, token_type: str, user: UserResponse}
        
    Raises:
        HTTPException 401: Invalid credentials
        
    Test Coverage: tests/test_auth.py::test_login_valid_user
    
    Example:
        >>> result = await login_user("admin", "password123")
        >>> result["access_token"]
        "eyJhbGc..."
    """
    pass
```

**Frontend (JavaScript/React)**:
```javascript
/**
 * Login Page Component
 * Repository: timeweaver_frontend
 * Owner: [Your Name]
 * 
 * Handles user authentication via backend API.
 * Stores JWT token in localStorage on success.
 * 
 * @component
 * @example
 * <Login onSuccess={() => navigate('/dashboard')} />
 */
function Login({ onSuccess }) {
  // Component code
}
```

### Testing Documentation Pattern

Each student creates testing docs in BOTH repos:

**Backend**: `timeweaver_backend/docs/testing_module_[number].md`
**Frontend**: `timeweaver_frontend/docs/testing_module_[number].md`

```markdown
# Testing Documentation - Module [Number]: [Name]

**Student Name**: [Your Name]  
**Module**: [Module Name]  
**Repositories**: timeweaver_backend, timeweaver_frontend

## Backend Testing

### Tool: [pytest / pytest-asyncio / etc.]

**Rationale**: [Why you chose this tool]

**Test Cases**:
1. **test_login_valid_credentials**
   - Input: {username: "admin", password: "Admin@123"}
   - Expected: Returns JWT token
   - Status: Pass

**Coverage**: 92%

**Running Tests**:
```bash
cd timeweaver_backend
pytest tests/test_auth.py -v --cov
```

## Frontend Testing

### Tool: [Jest / React Testing Library / Cypress]

**Test Cases**:
1. **test_login_form_renders**
   - Expected: Login form displays correctly
   - Status: Pass

**Coverage**: 78%

**Running Tests**:
```bash
cd timeweaver_frontend
npm test -- --coverage
```

## Integration Testing

**Scenario**: User login flow
1. User enters credentials in frontend
2. Frontend calls POST /api/v1/auth/login
3. Backend validates and returns token
4. Frontend stores token and redirects

**Status**: Working
```

---

## Module 1: Authentication & User Management

### Owner: Student A

### Status: ✅ **90% Complete** (Backend done, Frontend needed)

### Backend Repository: `timeweaver_backend`

#### What Has Been Done ✅

**Files (All complete)**:
- ✅ `app/api/v1/endpoints/auth.py` (6 endpoints)
  - POST `/api/v1/auth/login`
  - POST `/api/v1/auth/logout`
  - GET `/api/v1/auth/me`
  - POST `/api/v1/auth/refresh`
  - POST `/api/v1/auth/forgot-password`
  - POST `/api/v1/auth/reset-password`

- ✅ `app/api/v1/endpoints/users.py` (8 endpoints - admin CRUD + self-service)
- ✅ `app/core/security.py` - JWT, password hashing, token generation
- ✅ `app/core/dependencies.py` - RBAC (get_current_user, get_current_admin)
- ✅ `app/models/user.py` - User model with reset tokens
- ✅ `app/schemas/user.py`, `app/schemas/auth.py` - All validation schemas

### Frontend Repository: `timeweaver_frontend`

#### What Needs to Be Done ⚠️

**Create these files**:

1. **`src/pages/auth/Login.jsx`**
   ```jsx
   import { useState } from 'react';
   import { authService } from '../../services/authService';
   
   function Login() {
     const [credentials, setCredentials] = useState({ username: '', password: '' });
     
     const handleSubmit = async (e) => {
       e.preventDefault();
       try {
         const data = await authService.login(credentials);
         localStorage.setItem('token', data.access_token);
         window.location.href = '/dashboard';
       } catch (error) {
         alert('Invalid credentials');
       }
     };
     
     return (
       <form onSubmit={handleSubmit}>
         <input 
           type="text" 
           placeholder="Username"
           onChange={(e) => setCredentials({...credentials, username: e.target.value})}
         />
         <input 
           type="password" 
           placeholder="Password"
           onChange={(e) => setCredentials({...credentials, password: e.target.value})}
         />
         <button type="submit">Login</button>
       </form>
     );
   }
   ```

2. **`src/pages/auth/ForgotPassword.jsx`**
   - Email input form
   - Call authService.forgotPassword()

3. **`src/pages/auth/ResetPassword.jsx`**
   - New password form with token from URL query params
   - Call authService.resetPassword()

4. **`src/pages/auth/Profile.jsx`**
   - Display user info
   - Edit profile form
   - Change password form

5. **`src/services/authService.js`**
   ```javascript
   import api from './api';
   
   export const authService = {
     login: async ({ username, password }) => {
       const formData = new URLSearchParams();
       formData.append('username', username);
       formData.append('password', password);
       
       const response = await api.post('/auth/login', formData, {
         headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
       });
       return response;
     },
     
     logout: async () => {
       await api.post('/auth/logout');
       localStorage.removeItem('token');
     },
     
     forgotPassword: async (email) => {
       return await api.post('/auth/forgot-password', { email });
     },
     
     resetPassword: async (token, newPassword) => {
       return await api.post('/auth/reset-password', { token, new_password: newPassword });
     },
     
     getCurrentUser: async () => {
       return await api.get('/auth/me');
     }
   };
   ```

6. **`src/components/AuthForms/LoginForm.jsx`**
7. **`src/components/AuthForms/PasswordResetForm.jsx`**

### Testing Requirements

**Backend Tests** (`timeweaver_backend/tests/test_auth.py`):
```python
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_login_valid_credentials(client: AsyncClient):
    response = await client.post("/api/v1/auth/login", data={
        "username": "admin",
        "password": "Admin@123"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()

@pytest.mark.asyncio
async def test_forgot_password_sends_token():
    # Test forgot password workflow
    pass
```

**Frontend Tests** (`timeweaver_frontend/src/pages/auth/__tests__/Login.test.jsx`):
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../Login';

test('displays login form', () => {
  render(<Login />);
  expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
});

test('submits login form', async () => {
  render(<Login />);
  // Mock API call and test submission
});
```

### Integration Points

- **Provides to all modules**: JWT authentication tokens
- **Used by**: Every other module for protected API calls

### Deliverables Checklist

**Backend** (timeweaver_backend):
- [x] Auth endpoints (login, logout, forgot/reset password)
- [x] User CRUD endpoints
- [x] Backend tests (>90% coverage)
- [ ] Testing documentation

**Frontend** (timeweaver_frontend):
- [ ] Login page
- [ ] Forgot password page
- [ ] Reset password page
- [ ] Profile page
- [ ] Auth service (API integration)
- [ ] Frontend tests (>75% coverage)
- [ ] Testing documentation

---

## Module 2: Academic Setup & Course Management

### Owner: Student B

### Status: ✅ **90% Complete** (Backend done, Frontend needed)

### Backend Repository: `timeweaver_backend`

#### What Has Been Done ✅

**Files (All complete)**:
- ✅ `app/api/v1/endpoints/courses.py` (5 endpoints)
- ✅ `app/api/v1/endpoints/departments.py` (5 endpoints)
- ✅ `app/api/v1/endpoints/semesters.py` (5 endpoints)
- ✅ `app/api/v1/endpoints/sections.py` (5 endpoints)
- ✅ `app/api/v1/endpoints/elective_groups.py` (5 endpoints)
- ✅ All models, schemas, RBAC protection

### Frontend Repository: `timeweaver_frontend`

#### What Needs to Be Done ⚠️

**Create these files**:

1. **`src/pages/admin/Courses.jsx`**
   ```jsx
   import { useState, useEffect } from 'react';
   import { academicService } from '../../services/academicService';
   import CourseTable from '../../components/CourseTable/CourseTable';
   import CourseForm from '../../components/CourseForm/CourseForm';
   
   function Courses() {
     const [courses, setCourses] = useState([]);
     const [loading, setLoading] = useState(true);
     
     useEffect(() => {
       loadCourses();
     }, []);
     
     const loadCourses = async () => {
       const data = await academicService.getCourses();
       setCourses(data.data);
       setLoading(false);
     };
     
     const handleCreate = async (courseData) => {
       await academicService.createCourse(courseData);
       loadCourses();
     };
     
     return (
       <div>
         <h1>Courses</h1>
         <CourseForm onSubmit={handleCreate} />
         <CourseTable courses={courses} onEdit={handleCreate} />
       </div>
     );
   }
   ```

2. **`src/pages/admin/Departments.jsx`** - Similar CRUD UI
3. **`src/pages/admin/Semesters.jsx`** - Similar CRUD UI
4. **`src/pages/admin/Sections.jsx`** - Similar CRUD UI

5. **`src/components/DataTable/DataTable.jsx`**
   - Reusable table with sorting, filtering, pagination
   - Edit/Delete action buttons

6. **`src/components/CourseForm/CourseForm.jsx`**
   - Modal form for add/edit course
   - Validation

7. **`src/services/academicService.js`**
   ```javascript
   import api from './api';
   
   export const academicService = {
     // Courses
     getCourses: async (skip = 0, limit = 100) => {
       return await api.get(`/courses?skip=${skip}&limit=${limit}`);
     },
     
     createCourse: async (courseData) => {
       return await api.post('/courses', courseData);
     },
     
     updateCourse: async (id, courseData) => {
       return await api.put(`/courses/${id}`, courseData);
     },
     
     deleteCourse: async (id) => {
       return await api.delete(`/courses/${id}`);
     },
     
     // Departments
     getDepartments: async () => {
       return await api.get('/departments');
     },
     
     // ... similar for semesters, sections
   };
   ```

### Testing Requirements

**Backend Tests** (`timeweaver_backend/tests/test_academic.py`):
```python
@pytest.mark.asyncio
async def test_create_course_valid_data(client, admin_token):
    response = await client.post(
        "/api/v1/courses",
        json={
            "code": "CS101",
            "title": "Intro to CS",
            "credits": 4,
            "department_id": 1
        },
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 201
```

**Frontend Tests**:
```javascript
test('displays course list', async () => {
  render(<Courses />);
  await waitFor(() => {
    expect(screen.getByText('CS101')).toBeInTheDocument();
  });
});
```

### Integration Points

- **Requires**: Module 1 (auth tokens for admin operations)
- **Provides to**: Module 3 (course data for timetable generation)
- **Provides to**: Module 4 (courses to assign to faculty)

### Deliverables Checklist

**Backend** (timeweaver_backend):
- [x] All CRUD endpoints for 5 entities
- [x] Backend tests
- [ ] Testing documentation

**Frontend** (timeweaver_frontend):
- [ ] Admin pages for Courses, Departments, Semesters, Sections
- [ ] Reusable data table component
- [ ] Form components
- [ ] Academic service (API integration)
- [ ] Frontend tests
- [ ] Testing documentation

---

## Module 3: Timetable Generation & Scheduling

### Owner: Student C

### Status: ⚠️ **20% Complete** (Constraints done, Generator & Frontend needed)

### Backend Repository: `timeweaver_backend`

#### What Has Been Done ✅

- ✅ `app/api/v1/endpoints/constraints.py`
- ✅ `app/api/v1/endpoints/time_slots.py`
- ✅ `app/api/v1/endpoints/rooms.py`
- ✅ Models for constraints, rooms, time slots

#### What Needs to Be Done ⚠️

**Backend Files to Create**:

1. **`app/models/timetable.py`** ⭐ **NEW MODEL**
   ```python
   from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
   from app.db.base_class import Base
   
   class Timetable(Base):
       """Generated timetable for a semester"""
       __tablename__ = "timetables"
       
       id = Column(Integer, primary_key=True)
       semester_id = Column(Integer, ForeignKey("semesters.id"))
       name = Column(String(100))
       is_published = Column(Boolean, default=False)
       status = Column(String(20))  # generating, completed, failed
       generated_at = Column(DateTime)
       
   class TimetableSlot(Base):
       """Individual slot in a timetable (one class session)"""
       __tablename__ = "timetable_slots"
       
       id = Column(Integer, primary_key=True)
       timetable_id = Column(Integer, ForeignKey("timetables.id"))
       section_id = Column(Integer, ForeignKey("sections.id"))
       room_id = Column(Integer, ForeignKey("rooms.id"))
       time_slot_id = Column(Integer, ForeignKey("time_slots.id"))
       faculty_id = Column(Integer, ForeignKey("faculty.id"), nullable=True)
       day_of_week = Column(Integer)  # 0=Monday, 6=Sunday
   ```

2. **`app/services/timetable_generator.py`** ⭐ **CORE ALGORITHM**
   ```python
   from typing import List
   from sqlalchemy.ext.asyncio import AsyncSession
   from sqlalchemy import select
   
   class TimetableGenerator:
       """
       Intelligent timetable generation using constraint satisfaction.
       
       Algorithm: Greedy backtracking with constraint checking
       """
       
       def __init__(self, semester_id: int, db: AsyncSession):
           self.semester_id = semester_id
           self.db = db
           self.assigned_slots = []
           
       async def generate(self) -> Timetable:
           """
           Main generation algorithm.
           
           Steps:
           1. Load sections, rooms, time slots, constraints
           2. Sort sections by priority (# students, credits)
           3. For each section:
              - Try all room/time combinations
              - Check constraints
              - Assign first valid slot
           4. Return completed timetable
           """
           # Load data
           sections = await self._load_sections()
           rooms = await self._load_rooms()
           time_slots = await self._load_time_slots()
           
           # Create timetable
           timetable = Timetable(
               semester_id=self.semester_id,
               name=f"Timetable {datetime.now()}",
               status="generating"
           )
           self.db.add(timetable)
           await self.db.commit()
           
           # Assign sections
           for section in sections:
               slot = await self._find_valid_slot(section, rooms, time_slots)
               if slot:
                   slot.timetable_id = timetable.id
                   self.db.add(slot)
                   self.assigned_slots.append(slot)
           
           timetable.status = "completed"
           await self.db.commit()
           return timetable
           
       async def _find_valid_slot(self, section, rooms, time_slots):
           """Find first valid room/time combination for section"""
           for room in rooms:
               for time_slot in time_slots:
                   for day in range(5):  # Mon-Fri
                       slot = TimetableSlot(
                           section_id=section.id,
                           room_id=room.id,
                           time_slot_id=time_slot.id,
                           day_of_week=day
                       )
                       
                       if await self._is_valid(slot):
                           return slot
           return None
           
       async def _is_valid(self, slot: TimetableSlot) -> bool:
           """Check if slot violates any constraints"""
           # Check 1: Room not double-booked
           for existing in self.assigned_slots:
               if (existing.room_id == slot.room_id and
                   existing.time_slot_id == slot.time_slot_id and
                   existing.day_of_week == slot.day_of_week):
                   return False
           
           # Check 2: Faculty not double-booked
           # Check 3: Room capacity >= section size
           # Check 4: Constraint violations
           
           return True
   ```

3. **`app/api/v1/endpoints/timetables.py`** ⭐ **NEW ENDPOINTS**
   ```python
   from fastapi import APIRouter, Depends, HTTPException
   from app.services.timetable_generator import TimetableGenerator
   
   router = APIRouter()
   
   @router.post("/generate")
   async def generate_timetable(
       semester_id: int,
       db: AsyncSession = Depends(get_db),
       admin: User = Depends(get_current_admin)
   ):
       """Generate new timetable (may take 10-30 seconds)"""
       generator = TimetableGenerator(semester_id, db)
       timetable = await generator.generate()
       return timetable
   
   @router.get("/")
   async def list_timetables(db: AsyncSession = Depends(get_db)):
       """List all generated timetables"""
       query = select(Timetable)
       result = await db.execute(query)
       return result.scalars().all()
   
   @router.get("/{timetable_id}/slots")
   async def get_timetable_slots(timetable_id: int, db: AsyncSession = Depends(get_db)):
       """Get all slots for timetable (grid view)"""
       query = select(TimetableSlot).where(TimetableSlot.timetable_id == timetable_id)
       result = await db.execute(query)
       return result.scalars().all()
   ```

4. **Database Migration**: Create with alembic
   ```bash
   alembic revision -m "add_timetable_tables"
   # Edit migration file to add Timetable and TimetableSlot tables
   alembic upgrade head
   ```

### Frontend Repository: `timeweaver_frontend`

**Create these files**:

1. **`src/pages/admin/GenerateTimetable.jsx`**
   ```jsx
   function GenerateTimetable() {
     const [generating, setGenerating] = useState(false);
     const [timetable, setTimetable] = useState(null);
     
     const handleGenerate = async (semesterId) => {
       setGenerating(true);
       const result = await timetableService.generate(semesterId);
       setTimetable(result);
       setGenerating(false);
     };
     
     return (
       <div>
         <h1>Generate Timetable</h1>
         <SelectSemester />
         <button onClick={handleGenerate} disabled={generating}>
           {generating ? 'Generating...' : 'Generate'}
         </button>
         {timetable && <TimetableGrid slots={timetable.slots} />}
       </div>
     );
   }
   ```

2. **`src/pages/student/ViewTimetable.jsx`**
   - Weekly grid showing student's schedule

3. **`src/components/TimetableGrid/TimetableGrid.jsx`**
   - 7x5 grid (days x time slots)
   - Color-coded by course

4. **`src/services/timetableService.js`**
   ```javascript
   export const timetableService = {
     generate: async (semesterId) => {
       return await api.post(`/timetables/generate?semester_id=${semesterId}`);
     },
     
     getSlots: async (timetableId) => {
       return await api.get(`/timetables/${timetableId}/slots`);
     }
   };
   ```

### Testing Requirements

**Backend** (`timeweaver_backend/tests/test_timetable.py`):
```python
@pytest.mark.asyncio
async def test_no_room_conflicts(db):
    generator = TimetableGenerator(semester_id=1, db=db)
    timetable = await generator.generate()
    
    # Check no room conflicts
    slots = await db.execute(select(TimetableSlot))
    # Assert no duplicates in (room, day, time_slot)
```

**Frontend** (Cypress E2E):
```javascript
describe('Timetable Generation', () => {
  it('generates timetable successfully', () => {
    cy.login('admin');
    cy.visit('/admin/generate-timetable');
    cy.selectSemester('Fall 2024');
    cy.contains('Generate').click();
    cy.get('.timetable-grid', { timeout: 60000 }).should('be.visible');
  });
});
```

### Integration Points

- **Requires**: Module 2 (courses, sections, rooms data)
- **Requires**: Module 4 (faculty availability)
- **Provides**: Timetables for students and admins

### Deliverables Checklist

**Backend** (timeweaver_backend):
- [ ] Timetable models
- [ ] Timetable generation algorithm
- [ ] Timetable API endpoints
- [ ] Database migration
- [ ] Backend tests (>80% coverage algorithm)
- [ ] Testing documentation

**Frontend** (timeweaver_frontend):
- [ ] Generate timetable page
- [ ] View timetable page (student)
- [ ] Timetable grid component
- [ ] Timetable service
- [ ] E2E tests (Cypress)
- [ ] Testing documentation

---

## Module 4: Faculty Management & Workload

### Owner: Student D

### Status: ⚠️ **10% Complete** (User model exists, everything else needed)

### Backend Repository: `timeweaver_backend`

#### What Needs to Be Done ⚠️

**Backend Files to Create**:

1. **`app/models/faculty.py`** ⭐ **NEW MODEL**
   ```python
   class Faculty(Base):
       __tablename__ = "faculty"
       
       id = Column(Integer, primary_key=True)
       user_id = Column(Integer, ForeignKey("users.id"))
       employee_id = Column(String(20), unique=True)
       department_id = Column(Integer, ForeignKey("departments.id"))
       designation = Column(String(50))  # Professor, Assoc Prof
       max_hours_per_week = Column(Integer, default=18)
       
   class FacultyPreference(Base):
       __tablename__ = "faculty_preferences"
       
       id = Column(Integer, primary_key=True)
       faculty_id = Column(Integer, ForeignKey("faculty.id"))
       day_of_week = Column(Integer)
       time_slot_id = Column(Integer, ForeignKey("time_slots.id"))
       preference_type = Column(String(20))  # preferred, not_available
   ```

2. **`app/services/workload_calculator.py`** ⭐ **BUSINESS LOGIC**
   ```python
   class WorkloadCalculator:
       """Calculate faculty teaching hours and workload"""
       
       @staticmethod
       async def calculate_workload(faculty_id: int, semester_id: int, db: AsyncSession):
           """Calculate total teaching hours"""
           sections = await db.execute(
               select(Section)
               .where(Section.faculty_id == faculty_id)
               .where(Section.semester_id == semester_id)
           )
           
           total_hours = 0
           for section in sections.scalars():
               course = await section.awaitable_attrs.course
               total_hours += course.lecture_hours + course.tutorial_hours
               
           faculty = await db.get(Faculty, faculty_id)
           
           return {
               "total_hours": total_hours,
               "max_hours": faculty.max_hours_per_week,
               "is_overloaded": total_hours > faculty.max_hours_per_week
           }
   ```

3. **`app/api/v1/endpoints/faculty.py`** ⭐ **NEW ENDPOINTS**
   ```python
   @router.post("/")
   async def create_faculty(
       faculty_data: FacultyCreate,
       admin: User = Depends(get_current_admin)
   ):
       """Create faculty profile (admin only)"""
       pass
   
   @router.get("/{faculty_id}/workload")
   async def get_workload(faculty_id: int, semester_id: int):
       """Get teaching workload"""
       return await WorkloadCalculator.calculate_workload(faculty_id, semester_id, db)
   ```

4. **`app/api/v1/endpoints/faculty_preferences.py`**
   - Set time preferences
   - Mark unavailable times

### Frontend Repository: `timeweaver_frontend`

**Create these files**:

1. **`src/pages/faculty/Dashboard.jsx`**
   ```jsx
   function FacultyDashboard() {
     const { workload, courses } = useFacultyData();
     
     return (
       <>
         <WorkloadCard 
           hours={workload.total_hours} 
           max={workload.max_hours}
           overloaded={workload.is_overloaded}
         />
         <CoursesTable courses={courses} />
       </>
     );
   }
   ```

2. **`src/pages/faculty/Preferences.jsx`**
   - Weekly grid to set preferred/unavailable times

3. **`src/pages/admin/FacultyList.jsx`**
   - CRUD for faculty

4. **`src/components/WorkloadChart/WorkloadChart.jsx`**
   - Bar chart showing teaching hours

5. **`src/services/facultyService.js`**
   ```javascript
   export const facultyService = {
     getWorkload: async (facultyId, semesterId) => {
       return await api.get(`/faculty/${facultyId}/workload?semester_id=${semesterId}`);
     },
     
     setPreference: async (preference) => {
       return await api.post('/faculty-preferences', preference);
     }
   };
   ```

### Deliverables Checklist

**Backend** (timeweaver_backend):
- [ ] Faculty model
- [ ] Workload calculator
- [ ] Faculty CRUD API
- [ ] Preferences API
- [ ] Database migration
- [ ] Backend tests
- [ ] Testing documentation

**Frontend** (timeweaver_frontend):
- [ ] Faculty dashboard
- [ ] Preferences page
- [ ] Admin faculty list
- [ ] Workload chart
- [ ] Faculty service
- [ ] Frontend tests
- [ ] Testing documentation

---

## Module 5: System Monitoring & Admin Dashboard

### Owner: Student E

### Status: ✅ **80% Complete** (Backend done, Frontend needed)

### Backend Repository: `timeweaver_backend`

#### What Has Been Done ✅

- ✅ `app/middleware/audit_middleware.py` - Automatic logging
- ✅ `app/services/audit_service.py` - Query & sanitization
- ✅ `app/api/v1/endpoints/audit_logs.py` - Admin query API

### Frontend Repository: `timeweaver_frontend`

#### What Needs to Be Done ⚠️

**Create these files**:

1. **`src/pages/admin/Dashboard.jsx`** ⭐ **MAIN ADMIN PAGE**
   ```jsx
   function AdminDashboard() {
     const stats = useStats();
     
     return (
       <div className="dashboard-grid">
         <StatCard title="Total Courses" value={stats.courses} />
         <StatCard title="Faculty" value={stats.faculty} />
         <StatCard title="Students" value={stats.students} />
         
         <ActivityChart data={stats.activity} />
         <RecentAuditLogs logs={stats.recentLogs} />
       </div>
     );
   }
   ```

2. **`src/pages/admin/AuditLogs.jsx`**
   - Table with filters
   - Pagination
   - Export to CSV

3. **`src/components/StatsCards/StatCard.jsx`**
4. **`src/components/Charts/ActivityChart.jsx`** (use Chart.js or Recharts)
5. **`src/components/AuditLogTable/AuditLogTable.jsx`**

6. **`src/services/auditService.js`**
   ```javascript
   export const auditService = {
     getLogs: async (filters) => {
       const params = new URLSearchParams(filters);
       return await api.get(`/audit-logs?${params}`);
     }
   };
   ```

### Deliverables Checklist

**Backend** (timeweaver_backend):
- [x] Audit middleware
- [x] Audit service
- [x] Audit logs API
- [ ] Testing documentation

**Frontend** (timeweaver_frontend):
- [ ] Admin dashboard with stats
- [ ] Audit logs page
- [ ] Charts and stat cards
- [ ] Audit service
- [ ] Frontend tests
- [ ] Testing documentation

---

## Testing Requirements

### Testing Tools by Module

| Module | Backend Tool | Frontend Tool | E2E Tool |
|--------|-------------|---------------|----------|
| 1. Auth | `pytest` | `Jest` | Manual |
| 2. Academic | `pytest-postgresql` | `React Testing Library` | Manual |
| 3. Timetable | `pytest` + `hypothesis` | `Jest` | `Cypress` |
| 4. Faculty | `unittest.mock` | `Jest` | Manual |
| 5. Dashboard | `pytest-mock` | `Jest` | `Cypress` |

### Coverage Targets

- Backend: 80-90%
- Frontend: 75%+
- Integration: 5+ E2E scenarios

---

## Git Workflow

### Branch Naming Convention

```bash
# Backend work
git checkout -b module-[number]-[feature]-backend

# Frontend work
git checkout -b module-[number]-[feature]-frontend

# Examples:
# module-1-login-backend
# module-1-login-frontend
# module-3-timetable-generator-backend
```

### Typical Workflow

**Student A (Module 1) example:**

```bash
# Work on backend
cd timeweaver_backend
git checkout -b module-1-auth-backend
# Make changes to app/api/v1/endpoints/auth.py
git add .
git commit -m "feat(module-1): add forgot password endpoint"
git push origin module-1-auth-backend
# Create PR on GitHub/GitLab

# Work on frontend
cd ../timeweaver_frontend
git checkout -b module-1-auth-frontend
# Create src/pages/auth/Login.jsx
git add .
git commit -m "feat(module-1): add login page"
git push origin module-1-auth-frontend
# Create PR
```

### Commit Message Format

```
(Name) (Roll no.) (Module name)
User Stories:
Description of Work Done... (in concise bullet points)
```

---

## Timeline (7 Weeks)

**Week 1-2**: Foundation
- All students: Setup both repos locally
- Modules 1, 2, 4: Backend APIs (if not done) + Frontend pages

**Week 3-4**: Core Features
- Module 3: Timetable generation algorithm + UI
- All: Complete frontend pages

**Week 5**: Integration
- Module 5: Admin dashboard
- All: Integration testing between frontend/backend

**Week 6**: Testing
- All: Complete test coverage
- All: Write testing documentation

**Week 7**: Polish & Demo
- Code review
- Bug fixes
- Demo preparation
- Presentation

---

## Support Resources

### Common Issues

**"Frontend can't connect to backend"**
- Check backend is running: http://localhost:8000/docs
- Check CORS settings in `app/main.py`
- Check API base URL in frontend `.env`

**"Database migration fails"**
```bash
# Reset migrations
alembic downgrade base
alembic upgrade head
```

**"401 Unauthorized"**
- Check JWT token in localStorage
- Check token in Authorization header
- Check token hasn't expired

---

## Final Deliverables (Per Student)

### Backend Repository
1. ✅ API endpoints with docstrings
2. ✅ Business logic services
3. ✅ Database models (if new)
4. ✅ Backend tests (>80% coverage)
5. ✅ Testing documentation

### Frontend Repository
1. ✅ UI pages/components with comments
2. ✅ API integration service
3. ✅ Frontend tests (>75% coverage)
4. ✅ Testing documentation

### Both
1. ✅ Integration verified (frontend ↔ backend working)
2. ✅ Demo video/screenshots
3. ✅ Module documentation (README)

---

## Success Criteria

Each module must:
- ✅ Work end-to-end (can demo in browser)
- ✅ All tests pass with required coverage
- ✅ Code well-documented with comments
- ✅ Integration with other modules verified
- ✅ Testing report documenting tool choice

Good luck to all team members! 🚀
