// API Configuration
const API_BASE_URL = 'http://localhost:8000/api/v1';

// State
let courses = [];
let departments = [];
let filteredCourses = [];
let editingCourseId = null;

// Helper function to get auth token
function getAuthToken() {
    return localStorage.getItem('token');
}

// Helper function to make API calls
async function apiCall(endpoint, method = 'GET', data = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        }
    };

    const token = getAuthToken();
    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (data) {
        options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'API request failed');
    }

    return await response.json();
}

// Initialize page
window.onload = async function() {
    try {
        await loadDepartments();
        await loadCourses();
        renderCourses();
        updateStats();
    } catch (error) {
        console.error('Error initializing page:', error);
        alert('Failed to load data: ' + error.message);
    }
};

// Load departments from API
async function loadDepartments() {
    try {
        departments = await apiCall('/departments/');
        const filterSelect = document.getElementById('filterDepartment');
        const courseSelect = document.getElementById('courseDepartment');
        
        // Clear existing options except the first one
        filterSelect.innerHTML = '<option value="">All Departments</option>';
        courseSelect.innerHTML = '<option value="">Select Department</option>';
        
        departments.forEach(dept => {
            const option1 = new Option(dept.name, dept.id);
            const option2 = new Option(dept.name, dept.id);
            filterSelect.add(option1);
            courseSelect.add(option2);
        });
    } catch (error) {
        console.error('Error loading departments:', error);
        throw error;
    }
}

// Load courses from API
async function loadCourses() {
    try {
        courses = await apiCall('/courses/');
        // Enrich courses with department names
        courses = courses.map(course => {
            const dept = departments.find(d => d.id === course.department_id);
            return {
                ...course,
                department_name: dept ? dept.name : 'Unknown'
            };
        });
        filteredCourses = [...courses];
    } catch (error) {
        console.error('Error loading courses:', error);
        throw error;
    }
}

// Render courses table
function renderCourses() {
    const tbody = document.getElementById('coursesTableBody');
    
    if (filteredCourses.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" class="empty-state">No courses found</td></tr>';
        return;
    }
    
    tbody.innerHTML = filteredCourses.map(course => `
        <tr>
            <td><strong>${course.code}</strong></td>
            <td>${course.name}</td>
            <td>${course.credits}</td>
            <td>${course.department_name}</td>
            <td>
                <span class="badge ${course.is_elective ? 'badge-success' : 'badge-secondary'}">
                    ${course.is_elective ? 'Yes' : 'No'}
                </span>
            </td>
            <td>
                <span class="badge ${course.requires_lab ? 'badge-info' : 'badge-secondary'}">
                    ${course.requires_lab ? 'Yes' : 'No'}
                </span>
            </td>
            <td>${course.theory_hours || 0}</td>
            <td>${course.lab_hours || 0}</td>
            <td>${course.tutorial_hours || 0}</td>
            <td class="actions">
                <button class="btn-edit" onclick="editCourse(${course.id})">Edit</button>
                <button class="btn-danger" onclick="deleteCourse(${course.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

// Update statistics
function updateStats() {
    document.getElementById('totalCourses').textContent = courses.length;
    document.getElementById('electiveCourses').textContent = courses.filter(c => c.is_elective).length;
    document.getElementById('labCourses').textContent = courses.filter(c => c.requires_lab).length;
}

// Search courses
function searchCourses() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    filteredCourses = courses.filter(course => 
        course.code.toLowerCase().includes(searchTerm) ||
        course.name.toLowerCase().includes(searchTerm) ||
        course.department_name.toLowerCase().includes(searchTerm)
    );
    renderCourses();
}

// Apply filters
function applyFilters() {
    const deptFilter = document.getElementById('filterDepartment').value;
    const electiveFilter = document.getElementById('filterElective').value;
    const labFilter = document.getElementById('filterLab').value;
    
    filteredCourses = courses.filter(course => {
        if (deptFilter && course.department_id != deptFilter) return false;
        if (electiveFilter && course.is_elective.toString() !== electiveFilter) return false;
        if (labFilter && course.requires_lab.toString() !== labFilter) return false;
        return true;
    });
    
    renderCourses();
}

// Clear filters
function clearFilters() {
    document.getElementById('filterDepartment').value = '';
    document.getElementById('filterElective').value = '';
    document.getElementById('filterLab').value = '';
    document.getElementById('searchInput').value = '';
    filteredCourses = [...courses];
    renderCourses();
}

// Open add modal
function openAddModal() {
    editingCourseId = null;
    document.getElementById('modalTitle').textContent = 'Add New Course';
    document.getElementById('courseForm').reset();
    document.getElementById('courseId').value = '';
    document.getElementById('courseModal').classList.add('active');
}

// Edit course
function editCourse(id) {
    const course = courses.find(c => c.id === id);
    if (!course) return;
    
    editingCourseId = id;
    document.getElementById('modalTitle').textContent = 'Edit Course';
    document.getElementById('courseId').value = course.id;
    document.getElementById('courseCode').value = course.code;
    document.getElementById('courseTitle').value = course.name;
    document.getElementById('courseCredits').value = course.credits;
    document.getElementById('courseDepartment').value = course.department_id;
    document.getElementById('courseDescription').value = course.description || '';
    document.getElementById('theoryHours').value = course.theory_hours || 0;
    document.getElementById('labHours').value = course.lab_hours || 0;
    document.getElementById('tutorialHours').value = course.tutorial_hours || 0;
    document.getElementById('isElective').checked = course.is_elective || false;
    document.getElementById('requiresLab').checked = course.requires_lab || false;
    
    document.getElementById('courseModal').classList.add('active');
}

// Delete course
async function deleteCourse(id) {
    if (!confirm('Are you sure you want to delete this course?')) return;
    
    try {
        await apiCall(`/courses/${id}`, 'DELETE');
        courses = courses.filter(c => c.id !== id);
        filteredCourses = filteredCourses.filter(c => c.id !== id);
        renderCourses();
        updateStats();
        alert('Course deleted successfully');
    } catch (error) {
        console.error('Error deleting course:', error);
        alert('Failed to delete course: ' + error.message);
    }
}

// Save course
async function saveCourse(event) {
    event.preventDefault();
    
    const deptId = parseInt(document.getElementById('courseDepartment').value);
    
    // API expects these exact fields
    const courseData = {
        code: document.getElementById('courseCode').value,
        name: document.getElementById('courseTitle').value,
        credits: parseInt(document.getElementById('courseCredits').value),
        department_id: deptId,
        theory_hours: parseInt(document.getElementById('theoryHours').value) || 0,
        lab_hours: parseInt(document.getElementById('labHours').value) || 0,
        tutorial_hours: parseInt(document.getElementById('tutorialHours').value) || 0,
        is_elective: document.getElementById('isElective').checked,
        requires_lab: document.getElementById('requiresLab').checked
    };
    
    try {
        let savedCourse;
        if (editingCourseId) {
            savedCourse = await apiCall(`/courses/${editingCourseId}`, 'PUT', courseData);
        } else {
            savedCourse = await apiCall('/courses/', 'POST', courseData);
        }
        
        // Reload courses from API
        await loadCourses();
        renderCourses();
        updateStats();
        closeModal();
        alert('Course saved successfully');
    } catch (error) {
        console.error('Error saving course:', error);
        alert('Failed to save course: ' + error.message);
    }
}

// Close modal
function closeModal() {
    document.getElementById('courseModal').classList.remove('active');
    document.getElementById('courseForm').reset();
    editingCourseId = null;
}

// Close modal on outside click
window.onclick = function(event) {
    const modal = document.getElementById('courseModal');
    if (event.target === modal) {
        closeModal();
    }
};
