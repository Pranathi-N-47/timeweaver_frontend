// API Configuration
const API_BASE_URL = 'http://localhost:8000/api/v1';

// State
let departments = [];
let filteredDepartments = [];
let editingDeptId = null;

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
        renderDepartments();
        updateStats();
    } catch (error) {
        console.error('Error initializing page:', error);
        alert('Failed to load data: ' + error.message);
    }
};

async function loadDepartments() {
    try {
        departments = await apiCall('/departments/');
        filteredDepartments = [...departments];
    } catch (error) {
        console.error('Error loading departments:', error);
        throw error;
    }
}

function renderDepartments() {
    const tbody = document.getElementById('departmentsTableBody');
    
    if (filteredDepartments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="empty-state">No departments found</td></tr>';
        return;
    }
    
    tbody.innerHTML = filteredDepartments.map(dept => `
        <tr>
            <td><strong>${dept.code}</strong></td>
            <td>${dept.name}</td>
            <td>${dept.description || '-'}</td>
            <td class="actions">
                <button class="btn-edit" onclick="editDepartment(${dept.id})">Edit</button>
                <button class="btn-danger" onclick="deleteDepartment(${dept.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

function updateStats() {
    document.getElementById('totalDepartments').textContent = departments.length;
}

function searchDepartments() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    filteredDepartments = departments.filter(dept => 
        dept.code.toLowerCase().includes(searchTerm) ||
        dept.name.toLowerCase().includes(searchTerm) ||
        (dept.description && dept.description.toLowerCase().includes(searchTerm))
    );
    renderDepartments();
}

function openAddModal() {
    editingDeptId = null;
    document.getElementById('modalTitle').textContent = 'Add New Department';
    document.getElementById('departmentForm').reset();
    document.getElementById('departmentModal').classList.add('active');
}

function editDepartment(id) {
    const dept = departments.find(d => d.id === id);
    if (!dept) return;
    
    editingDeptId = id;
    document.getElementById('modalTitle').textContent = 'Edit Department';
    document.getElementById('departmentId').value = dept.id;
    document.getElementById('deptCode').value = dept.code;
    document.getElementById('deptName').value = dept.name;
    document.getElementById('deptHead').value = dept.description || '';
    
    document.getElementById('departmentModal').classList.add('active');
}

async function deleteDepartment(id) {
    if (!confirm('Are you sure you want to delete this department?')) return;
    
    try {
        await apiCall(`/departments/${id}`, 'DELETE');
        departments = departments.filter(d => d.id !== id);
        filteredDepartments = filteredDepartments.filter(d => d.id !== id);
        renderDepartments();
        updateStats();
        alert('Department deleted successfully');
    } catch (error) {
        console.error('Error deleting department:', error);
        alert('Failed to delete department: ' + error.message);
    }
}

async function saveDepartment(event) {
    event.preventDefault();
    
    // API expects: name, code, description (optional)
    const deptData = {
        name: document.getElementById('deptName').value,
        code: document.getElementById('deptCode').value,
        description: document.getElementById('deptHead').value || null  // Using head field as description
    };
    
    try {
        if (editingDeptId) {
            await apiCall(`/departments/${editingDeptId}`, 'PUT', deptData);
        } else {
            await apiCall('/departments/', 'POST', deptData);
        }
        
        await loadDepartments();
        renderDepartments();
        updateStats();
        closeModal();
        alert('Department saved successfully');
    } catch (error) {
        console.error('Error saving department:', error);
        alert('Failed to save department: ' + error.message);
    }
}

function closeModal() {
    document.getElementById('departmentModal').classList.remove('active');
    document.getElementById('departmentForm').reset();
    editingDeptId = null;
}

window.onclick = function(event) {
    const modal = document.getElementById('departmentModal');
    if (event.target === modal) closeModal();
};
