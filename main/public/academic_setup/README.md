# Academic Setup - TimeWeaver

This directory contains a complete implementation of the Academic Setup module using **HTML, CSS, and JavaScript** (vanilla, no frameworks).

## 📁 Directory Structure

```
academic_setup/
├── index.html              # Main landing page
├── css/
│   └── style.css          # All styling (modern purple theme)
├── js/
│   ├── courses.js         # Courses management logic
│   ├── departments.js     # Departments management logic
│   ├── semesters.js       # Semesters management logic
│   └── sections.js        # Sections management logic
└── pages/
    ├── courses.html       # Courses management page
    ├── departments.html   # Departments management page
    ├── semesters.html     # Semesters management page
    └── sections.html      # Sections management page
```

## 🎨 Features

### ✅ Modern UI/UX
- **Purple gradient theme** matching the design specifications
- **Fixed sidebar navigation** with brand logo
- **Responsive design** that works on all screen sizes
- **Smooth animations** and hover effects
- **Modern card-based layout**

### ✅ Full CRUD Operations
Each module (Courses, Departments, Semesters, Sections) supports:
- **Create**: Add new records via modal forms
- **Read**: View all records in tables
- **Update**: Edit existing records
- **Delete**: Remove records with confirmation

### ✅ Advanced Features
- **Search functionality** - Real-time search across all fields
- **Filters** - Filter courses and sections by various criteria
- **Statistics cards** - Display key metrics
- **Validation** - Form validation before saving
- **Mock data** - Pre-populated data for testing

## 🚀 How to Run

### Option 1: Direct File Access
Simply open `index.html` in any modern web browser:
```
Double-click on: academic_setup/index.html
```

### Option 2: Local Web Server (Recommended)
Using Python:
```bash
cd academic_setup
python -m http.server 8080
```
Then open: http://localhost:8080

Using Node.js:
```bash
cd academic_setup
npx serve
```

## 📄 Pages Description

### 1. **index.html** - Home Page
- Welcome screen with quick links
- Navigation to all management pages
- Modern card-based design

### 2. **courses.html** - Courses Management
- Manage academic courses
- Filter by department, elective status, lab requirement
- Fields: Code, Title, Credits, Department, Description, Hours
- Statistics: Total, Elective, and Lab courses

### 3. **departments.html** - Departments Management
- Manage academic departments
- Fields: Code, Name, Head of Department
- Simple and clean interface

### 4. **semesters.html** - Semesters Management
- Manage academic terms
- Fields: Name, Start Date, End Date, Academic Year, Active Status
- Date formatting and status badges

### 5. **sections.html** - Sections Management
- Manage class sections
- Filter by semester
- Fields: Name, Semester, Max Students, Current Students
- Student capacity tracking

## 🎨 Styling Features

### Color Scheme
- Primary: Purple gradient (#667eea to #764ba2)
- Background: Light gray (#f8f9fa)
- Cards: White with subtle borders
- Text: Modern gray scale (#1f2937, #6b7280)

### Components
- **Buttons**: Gradient primary, secondary, danger, edit
- **Tables**: Hover effects, sortable headers
- **Modals**: Backdrop blur, smooth animations
- **Forms**: Focus states with purple ring
- **Badges**: Color-coded status indicators

## 💾 Data Storage

Currently uses **in-memory storage** (JavaScript arrays):
- Data persists during the session
- Resets on page refresh
- Perfect for testing and demonstration

### To Add Persistent Storage:
You can easily add localStorage:
```javascript
// Save data
localStorage.setItem('courses', JSON.stringify(courses));

// Load data
courses = JSON.parse(localStorage.getItem('courses')) || [];
```

## 🔌 Backend Integration

To connect to a real backend API:

1. Replace mock data arrays with API calls
2. Update the save/delete functions to use fetch() or XMLHttpRequest
3. Example:
```javascript
async function loadCourses() {
    const response = await fetch('http://localhost:8000/api/v1/courses');
    courses = await response.json();
    renderCourses();
}
```

## 📱 Browser Compatibility

Works on all modern browsers:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

## 🎯 No Dependencies!

This project uses **zero external libraries**:
- No jQuery
- No Bootstrap
- No React/Vue/Angular
- Pure HTML5, CSS3, and ES6 JavaScript

## 📚 Code Structure

### JavaScript Organization
Each JS file follows this pattern:
```javascript
// 1. Data arrays (mock data)
// 2. State variables
// 3. Initialize function
// 4. Render functions
// 5. CRUD operations
// 6. Helper functions
// 7. Event handlers
```

### CSS Organization
```css
/* 1. Global styles */
/* 2. Layout (sidebar, main) */
/* 3. Components (buttons, cards, tables) */
/* 4. Utilities (badges, modals) */
/* 5. Responsive styles */
```

## 🔧 Customization

### Change Theme Colors
Edit `css/style.css`:
```css
/* Primary gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Change to your colors */
background: linear-gradient(135deg, #YOUR_COLOR1 0%, #YOUR_COLOR2 100%);
```

### Add New Fields
1. Add input in HTML form
2. Update save function in JS
3. Add column in table
4. Update render function

## 📊 Sample Data

Includes pre-populated data:
- **5 Courses** (CS101-CS302, ECE101)
- **5 Departments** (CSE, ECE, ME, CE, EEE)
- **3 Semesters** (Fall 2024, Spring 2025, Fall 2025)
- **3 Sections** (Section A, B, C)

## 🎓 Learning Resource

This code demonstrates:
- DOM manipulation
- Event handling
- Form validation
- Local state management
- CRUD operations
- Responsive design
- Modern CSS (Grid, Flexbox)
- ES6+ JavaScript features

---

**Created for**: TimeWeaver Academic Timetable System  
**Module**: Academic Setup & Course Management  
**Tech Stack**: HTML5, CSS3, Vanilla JavaScript  
**Version**: 1.0.0
