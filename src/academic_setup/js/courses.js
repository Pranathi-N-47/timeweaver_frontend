// Mock data for courses
let courses = [
    {
        id: 1,
        code: 'CS101',
        title: 'Introduction to Computer Science',
        credits: 4,
        department_id: 1,
        department_name: 'Computer Science & Engineering',
        description: 'Fundamentals of computer science',
        theory_hours: 3,
        lab_hours: 2,
        is_elective: false,
        requires_lab: true
    },
    {
        id: 2,
        code: 'CS201',
        title: 'Data Structures and Algorithms',
        credits: 4,
        department_id: 1,
        department_name: 'Computer Science & Engineering',
        description: 'Study of data structures and algorithms',
        theory_hours: 3,
        lab_hours: 2,
        is_elective: false,
        requires_lab: true
    },
    {
        id: 3,
        code: 'CS301',
        title: 'Database Management Systems',
        credits: 3,
        department_id: 1,
        department_name: 'Computer Science & Engineering',
        description: 'Database concepts and SQL',
        theory_hours: 3,
        lab_hours: 0,
        is_elective: false,
        requires_lab: false
    },
    {
        id: 4,
        code: 'CS302',
        title: 'Web Development',
        credits: 3,
        department_id: 1,
        department_name: 'Computer Science & Engineering',
        description: 'Modern web development technologies',
        theory_hours: 2,
        lab_hours: 2,
        is_elective: true,
        requires_lab: true
    },
    {
        id: 5,
        code: 'ECE101',
        title: 'Electronics Fundamentals',
        credits: 4,
        department_id: 2,
        department_name: 'Electronics & Communication Engineering',
        description: 'Basic electronics concepts',
        theory_hours: 3,
        lab_hours: 2,
        is_elective: false,
        requires_lab: true
    }
];

let departments = [
    { id: 1, code: 'CSE', name: 'Computer Science & Engineering' },
    { id: 2, code: 'ECE', name: 'Electronics & Communication Engineering' },
    { id: 3, code: 'ME', name: 'Mechanical Engineering' },
    { id: 4, code: 'CE', name: 'Civil Engineering' },
    { id: 5, code: 'EEE', name: 'Electrical & Electronics Engineering' }
];

let filteredCourses = [...courses];
let editingCourseId = null;

// Initialize page
window.onload = function() {
    loadDepartments();
    renderCourses();
    updateStats();
};

// Load departments into dropdowns
function loadDepartments() {
    const filterSelect = document.getElementById('filterDepartment');
    const courseSelect = document.getElementById('courseDepartment');
    
    departments.forEach(dept => {
        const option1 = new Option(dept.name, dept.id);
        const option2 = new Option(dept.name, dept.id);
        filterSelect.add(option1);
        courseSelect.add(option2);
    });
}

// Render courses table
function renderCourses() {
    const tbody = document.getElementById('coursesTableBody');
    
    if (filteredCourses.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="empty-state">No courses found</td></tr>';
        return;
    }
    
    tbody.innerHTML = filteredCourses.map(course => `
        <tr>
            <td><strong>${course.code}</strong></td>
            <td>${course.title}</td>
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
            <td>${course.theory_hours || '-'}</td>
            <td>${course.lab_hours || '-'}</td>
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
        course.title.toLowerCase().includes(searchTerm) ||
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
    document.getElementById('courseTitle').value = course.title;
    document.getElementById('courseCredits').value = course.credits;
    document.getElementById('courseDepartment').value = course.department_id;
    document.getElementById('courseDescription').value = course.description || '';
    document.getElementById('theoryHours').value = course.theory_hours || '';
    document.getElementById('labHours').value = course.lab_hours || '';
    document.getElementById('isElective').checked = course.is_elective;
    document.getElementById('requiresLab').checked = course.requires_lab;
    
    document.getElementById('courseModal').classList.add('active');
}

// Delete course
function deleteCourse(id) {
    if (confirm('Are you sure you want to delete this course?')) {
        courses = courses.filter(c => c.id !== id);
        filteredCourses = filteredCourses.filter(c => c.id !== id);
        renderCourses();
        updateStats();
    }
}

// Save course
function saveCourse(event) {
    event.preventDefault();
    
    const deptId = parseInt(document.getElementById('courseDepartment').value);
    const dept = departments.find(d => d.id === deptId);
    
    const courseData = {
        id: editingCourseId || Date.now(),
        code: document.getElementById('courseCode').value,
        title: document.getElementById('courseTitle').value,
        credits: parseInt(document.getElementById('courseCredits').value),
        department_id: deptId,
        department_name: dept ? dept.name : '',
        description: document.getElementById('courseDescription').value,
        theory_hours: parseInt(document.getElementById('theoryHours').value) || 0,
        lab_hours: parseInt(document.getElementById('labHours').value) || 0,
        is_elective: document.getElementById('isElective').checked,
        requires_lab: document.getElementById('requiresLab').checked
    };
    
    if (editingCourseId) {
        const index = courses.findIndex(c => c.id === editingCourseId);
        if (index !== -1) {
            courses[index] = courseData;
        }
    } else {
        courses.push(courseData);
    }
    
    filteredCourses = [...courses];
    renderCourses();
    updateStats();
    closeModal();
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
