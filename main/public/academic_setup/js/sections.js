// API Configuration
const API_BASE_URL = 'http://localhost:3000/api/academic';

// State
let sections = [];
let semesters = [];
let departments = [];
let filteredSections = [];
let editingSectionId = null;

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

window.onload = async function() {
    try {
        await loadDepartments();
        await loadSemesters();
        await loadSections();
        renderSections();
        updateStats();
    } catch (error) {
        console.error('Error initializing page:', error);
        alert('Failed to load data: ' + error.message);
    }
};

async function loadDepartments() {
    try {
        departments = await apiCall('/departments/');
    } catch (error) {
        console.error('Error loading departments:', error);
        throw error;
    }
}

async function loadSemesters() {
    try {
        const filterSelect = document.getElementById('filterSemester');
        const sectionSelect = document.getElementById('departmentId');
        
        // Clear existing options
        filterSelect.innerHTML = '<option value="">All Departments</option>';
        
        // Load departments for filter dropdown
        departments.forEach(dept => {
            const option1 = new Option(dept.name, dept.id);
            filterSelect.add(option1);
        });
        
        // Load departments for form dropdown
        sectionSelect.innerHTML = '<option value="">Select Department</option>';
        departments.forEach(dept => {
            const option2 = new Option(dept.name, dept.id);
            sectionSelect.add(option2);
        });
    } catch (error) {
        console.error('Error loading dropdowns:', error);
        throw error;
    }
}

async function loadSections() {
    try {
        sections = await apiCall('/sections/');
        // Enrich sections with department names
        sections = sections.map(section => {
            const dept = departments.find(d => d.id === section.department_id);
            return {
                ...section,
                department_name: dept ? dept.name : 'Unknown'
            };
        });
        filteredSections = [...sections];
    } catch (error) {
        console.error('Error loading sections:', error);
        throw error;
    }
}

function renderSections() {
    const tbody = document.getElementById('sectionsTableBody');
    
    if (filteredSections.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No sections found</td></tr>';
        return;
    }
    
    tbody.innerHTML = filteredSections.map(section => `
        <tr>
            <td><strong>${section.name}</strong></td>
            <td>${section.department_name}</td>
            <td>${section.batch_year_start}-${section.batch_year_end}</td>
            <td>
                <span class="badge badge-info">
                    ${section.student_count}
                </span>
            </td>
            <td class="actions">
                <button class="btn-edit" onclick="editSection(${section.id})">Edit</button>
                <button class="btn-danger" onclick="deleteSection(${section.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

function updateStats() {
    document.getElementById('totalSections').textContent = sections.length;
}

function searchSections() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    filteredSections = sections.filter(section => 
        section.name.toLowerCase().includes(searchTerm) ||
        section.department_name.toLowerCase().includes(searchTerm)
    );
    renderSections();
}

function applyFilters() {
    const deptFilter = document.getElementById('filterSemester').value;
    
    filteredSections = sections.filter(section => {
        if (deptFilter && section.department_id != deptFilter) return false;
        return true;
    });
    
    renderSections();
}

function clearFilters() {
    document.getElementById('filterSemester').value = '';
    document.getElementById('searchInput').value = '';
    filteredSections = [...sections];
    renderSections();
}

function openAddModal() {
    editingSectionId = null;
    document.getElementById('modalTitle').textContent = 'Add New Section';
    document.getElementById('sectionForm').reset();
    document.getElementById('sectionModal').classList.add('active');
}

function editSection(id) {
    const section = sections.find(s => s.id === id);
    if (!section) return;
    
    editingSectionId = id;
    document.getElementById('modalTitle').textContent = 'Edit Section';
    document.getElementById('sectionId').value = section.id;
    document.getElementById('sectionName').value = section.name;
    document.getElementById('departmentId').value = section.department_id;
    document.getElementById('batchYearStart').value = section.batch_year_start;
    document.getElementById('batchYearEnd').value = section.batch_year_end;
    document.getElementById('studentCount').value = section.student_count || 0;
    
    document.getElementById('sectionModal').classList.add('active');
}

async function deleteSection(id) {
    if (!confirm('Are you sure you want to delete this section?')) return;
    
    try {
        await apiCall(`/sections/${id}`, 'DELETE');
        sections = sections.filter(s => s.id !== id);
        filteredSections = filteredSections.filter(s => s.id !== id);
        renderSections();
        updateStats();
        alert('Section deleted successfully');
    } catch (error) {
        console.error('Error deleting section:', error);
        alert('Failed to delete section: ' + error.message);
    }
}

async function saveSection(event) {
    event.preventDefault();
    
    // API expects: department_id, name, batch_year_start, batch_year_end, student_count
    const sectionData = {
        department_id: parseInt(document.getElementById('departmentId').value),
        name: document.getElementById('sectionName').value,
        batch_year_start: parseInt(document.getElementById('batchYearStart').value),
        batch_year_end: parseInt(document.getElementById('batchYearEnd').value),
        student_count: parseInt(document.getElementById('studentCount').value) || 0
    };
    
    try {
        if (editingSectionId) {
            await apiCall(`/sections/${editingSectionId}`, 'PUT', sectionData);
        } else {
            await apiCall('/sections/', 'POST', sectionData);
        }
        
        await loadSections();
        renderSections();
        updateStats();
        closeModal();
        alert('Section saved successfully');
    } catch (error) {
        console.error('Error saving section:', error);
        alert('Failed to save section: ' + error.message);
    }
}

function closeModal() {
    document.getElementById('sectionModal').classList.remove('active');
    document.getElementById('sectionForm').reset();
    editingSectionId = null;
}

window.onclick = function(event) {
    const modal = document.getElementById('sectionModal');
    if (event.target === modal) closeModal();
};
