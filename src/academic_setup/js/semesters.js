// API Configuration
const API_BASE_URL = 'http://localhost:8000/api/v1';

// State
let semesters = [];
let filteredSemesters = [];
let editingSemesterId = null;

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
        await loadSemesters();
        renderSemesters();
        updateStats();
    } catch (error) {
        console.error('Error initializing page:', error);
        alert('Failed to load data: ' + error.message);
    }
};

async function loadSemesters() {
    try {
        semesters = await apiCall('/semesters/');
        filteredSemesters = [...semesters];
    } catch (error) {
        console.error('Error loading semesters:', error);
        throw error;
    }
}

function renderSemesters() {
    const tbody = document.getElementById('semestersTableBody');
    
    if (filteredSemesters.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No semesters found</td></tr>';
        return;
    }
    
    tbody.innerHTML = filteredSemesters.map(semester => `
        <tr>
            <td><strong>${semester.name}</strong></td>
            <td>${formatDate(semester.start_date)}</td>
            <td>${formatDate(semester.end_date)}</td>
            <td>${semester.academic_year}</td>
            <td>
                <span class="badge ${semester.is_active ? 'badge-success' : 'badge-secondary'}">
                    ${semester.is_active ? 'Active' : 'Inactive'}
                </span>
            </td>
            <td class="actions">
                <button class="btn-edit" onclick="editSemester(${semester.id})">Edit</button>
                <button class="btn-danger" onclick="deleteSemester(${semester.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function updateStats() {
    document.getElementById('totalSemesters').textContent = semesters.length;
}

function searchSemesters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    filteredSemesters = semesters.filter(sem => 
        sem.name.toLowerCase().includes(searchTerm) ||
        sem.academic_year.toLowerCase().includes(searchTerm)
    );
    renderSemesters();
}

function openAddModal() {
    editingSemesterId = null;
    document.getElementById('modalTitle').textContent = 'Add New Semester';
    document.getElementById('semesterForm').reset();
    document.getElementById('semesterModal').classList.add('active');
}

function editSemester(id) {
    const semester = semesters.find(s => s.id === id);
    if (!semester) return;
    
    editingSemesterId = id;
    document.getElementById('modalTitle').textContent = 'Edit Semester';
    document.getElementById('semesterId').value = semester.id;
    document.getElementById('semesterName').value = semester.name;
    document.getElementById('startDate').value = semester.start_date;
    document.getElementById('endDate').value = semester.end_date;
    document.getElementById('academicYear').value = semester.academic_year;
    document.getElementById('semesterType').value = semester.semester_type || 'ODD';
    document.getElementById('isActive').checked = semester.is_active;
    
    document.getElementById('semesterModal').classList.add('active');
}

async function deleteSemester(id) {
    if (!confirm('Are you sure you want to delete this semester?')) return;
    
    try {
        await apiCall(`/semesters/${id}`, 'DELETE');
        semesters = semesters.filter(s => s.id !== id);
        filteredSemesters = filteredSemesters.filter(s => s.id !== id);
        renderSemesters();
        updateStats();
        alert('Semester deleted successfully');
    } catch (error) {
        console.error('Error deleting semester:', error);
        alert('Failed to delete semester: ' + error.message);
    }
}

async function saveSemester(event) {
    event.preventDefault();
    
    // API expects: name, academic_year, semester_type (ODD/EVEN), start_date, end_date, is_active (optional)
    const semesterData = {
        name: document.getElementById('semesterName').value,
        academic_year: document.getElementById('academicYear').value,
        semester_type: document.getElementById('semesterType').value,
        start_date: document.getElementById('startDate').value,
        end_date: document.getElementById('endDate').value,
        is_active: document.getElementById('isActive').checked
    };
    
    try {
        if (editingSemesterId) {
            await apiCall(`/semesters/${editingSemesterId}`, 'PUT', semesterData);
        } else {
            await apiCall('/semesters/', 'POST', semesterData);
        }
        
        await loadSemesters();
        renderSemesters();
        updateStats();
        closeModal();
        alert('Semester saved successfully');
    } catch (error) {
        console.error('Error saving semester:', error);
        alert('Failed to save semester: ' + error.message);
    }
}

function closeModal() {
    document.getElementById('semesterModal').classList.remove('active');
    document.getElementById('semesterForm').reset();
    editingSemesterId = null;
}

window.onclick = function(event) {
    const modal = document.getElementById('semesterModal');
    if (event.target === modal) closeModal();
};
