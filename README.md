# TimeWeaver Frontend - Quick Reference

**For complete setup guide**, see: [SETUP_GUIDE.md](SETUP_GUIDE.md)  
**For module specifications**, see: [MODULE_SPECIFICATIONS.md](MODULE_SPECIFICATIONS.md)

---

## 🚀 Quick Start

### 1. Install Dependencies

```powershell
# Install Node.js packages
npm install

# Or using yarn
yarn install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
# or REACT_APP_API_BASE_URL if using Create React App
```

**Backend API Configuration**:
- Backend URL: `http://localhost:8000`
- API Base: `/api/v1`
- API Docs: `http://localhost:8000/docs`

### 3. Start Development Server

```powershell
# Start frontend dev server
npm run dev

# Or using yarn
yarn dev
```

✅ Frontend running at: http://localhost:5173 (Vite)  
✅ Or: http://localhost:3000 (Create React App)

---

## 📁 Project Structure

```
timeweaver_frontend/
├── src/
│   ├── pages/                  # Page components (your code here)
│   │   ├── auth/              # Module 1 - Login, Profile
│   │   ├── admin/             # Module 2 & 3 - Courses, Timetables
│   │   ├── faculty/           # Module 4 - Faculty Dashboard
│   │   └── student/           # Module 3 - View Timetable
│   ├── components/            # Reusable UI components
│   ├── services/              # API integration layer
│   │   ├── api.js            # Axios base configuration
│   │   ├── authService.js    # Module 1
│   │   └── academicService.js # Module 2
│   ├── utils/                 # Helper functions
│   └── App.jsx               # Main application component
├── public/                    # Static assets
│   ├── index.html
│   └── style.css
├── tests/                     # Frontend tests (Jest/Cypress)
├── package.json
├── .env
└── .gitignore
```

---

## ✅ Current Status

### Directory Structure
✅ All required directories created  
✅ Files organized according to MODULE_SPECIFICATIONS.md  
✅ Ready for React/Vue development

### To Build

**Module 1** (Student A): Authentication & User Management
- [ ] `src/pages/auth/Login.jsx`
- [ ] `src/pages/auth/Profile.jsx`
- [ ] `src/services/authService.js`
- [ ] Frontend tests

**Module 2** (Student B): Academic Setup & Course Management
- [ ] `src/pages/admin/Courses.jsx`
- [ ] `src/pages/admin/Departments.jsx`
- [ ] `src/services/academicService.js`
- [ ] Reusable data table component

**Module 3** (Student C): Timetable Generation & Scheduling
- [ ] `src/pages/admin/GenerateTimetable.jsx`
- [ ] `src/pages/student/ViewTimetable.jsx`
- [ ] Timetable visualization components

**Module 4** (Student D): Faculty Management & Workload
- [ ] `src/pages/faculty/Dashboard.jsx`
- [ ] Faculty workload components
- [ ] `src/services/facultyService.js`

**Module 5** (Student E): System Monitoring & Admin Dashboard
- [ ] `src/pages/admin/Dashboard.jsx`
- [ ] Dashboard components
- [ ] Analytics visualizations

---

## 🔌 API Integration

### Base API Configuration

**File**: `src/services/api.js`

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

### Example Service

**File**: `src/services/authService.js`

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
  
  getCurrentUser: async () => {
    return await api.get('/auth/me');
  }
};
```

---

## 🧪 Testing

```powershell
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- Login.test.jsx

# E2E tests with Cypress
npm run cypress:open
```

---

## 🔧 Useful Commands

### Development

```powershell
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format
```

### Package Management

```powershell
# Install new package
npm install package-name

# Install dev dependency
npm install -D package-name

# Update all packages
npm update

# Check outdated packages
npm outdated
```

---

## 🎨 Component Development

### Page Component Template

```jsx
import { useState, useEffect } from 'react';
import { authService } from '../../services/authService';

/**
 * Login Page Component
 * Repository: timeweaver_frontend
 * Owner: [Your Name]
 * 
 * Handles user authentication via backend API.
 * Stores JWT token in localStorage on success.
 */
function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const data = await authService.login(credentials);
      localStorage.setItem('token', data.access_token);
      window.location.href = '/dashboard';
    } catch (error) {
      alert('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
      </form>
    </div>
  );
}

export default Login;
```

---

## 🔒 Authentication Flow

1. User enters credentials in login form
2. Frontend calls `POST /api/v1/auth/login`
3. Backend validates and returns JWT token
4. Frontend stores token in `localStorage`
5. Token is automatically added to all subsequent API requests
6. On 401 error, user is redirected to login

**Default Admin Credentials**:
```
Username: admin
Password: Admin@123
```

---

## 🐛 Troubleshooting

**CORS errors**:
- Ensure backend CORS is configured for `http://localhost:5173` or `http://localhost:3000`
- Check backend is running at `http://localhost:8000`

**API connection refused**:
- Start backend: `uvicorn app.main:app --reload`
- Verify `.env` has correct `VITE_API_BASE_URL`

**Module not found**:
```powershell
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Port in use**:
```powershell
# Find process using port
netstat -ano | findstr :5173

# Kill process
taskkill /PID [PID] /F
```

---

## 📚 Documentation

- **Backend API**: http://localhost:8000/docs (Swagger)
- **Setup Guide**: [SETUP_GUIDE.md](SETUP_GUIDE.md)
- **Module Specs**: [MODULE_SPECIFICATIONS.md](MODULE_SPECIFICATIONS.md)

---

## 🎯 For Students

Choose your module from MODULE_SPECIFICATIONS.md:

- **Module 1** (Student A): Authentication & User Management
  - Pages: Login, Profile, Password Reset
  - Services: authService.js
  
- **Module 2** (Student B): Academic Setup & Course Management
  - Pages: Courses, Departments, Semesters, Sections
  - Services: academicService.js
  
- **Module 3** (Student C): Timetable Generation & Scheduling
  - Pages: GenerateTimetable, ViewTimetable
  - Services: timetableService.js
  
- **Module 4** (Student D): Faculty Management & Workload
  - Pages: Faculty Dashboard
  - Services: facultyService.js
  
- **Module 5** (Student E): System Monitoring & Admin Dashboard
  - Pages: Admin Dashboard
  - Components: Charts, Analytics

**Backend APIs for Modules 1, 2, and 5 are already complete!**

---

## 🔄 Running Full Stack

**Terminal 1 - Backend**:
```powershell
cd ../timeweaver_backend
.\\venv\\Scripts\\activate
uvicorn app.main:app --reload
```

**Terminal 2 - Frontend**:
```powershell
cd timeweaver_frontend
npm run dev
```

Access:
- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

**Questions?** Check SETUP_GUIDE.md or MODULE_SPECIFICATIONS.md
