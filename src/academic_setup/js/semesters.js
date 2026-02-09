let semesters = [
    { id: 1, name: 'Fall 2024', start_date: '2024-08-01', end_date: '2024-12-15', academic_year: '2024-2025', is_active: true },
    { id: 2, name: 'Spring 2025', start_date: '2025-01-10', end_date: '2025-05-20', academic_year: '2024-2025', is_active: false },
    { id: 3, name: 'Fall 2025', start_date: '2025-08-01', end_date: '2025-12-15', academic_year: '2025-2026', is_active: false }
];

let filteredSemesters = [...semesters];
let editingSemesterId = null;

window.onload = function() {
    renderSemesters();
    updateStats();
};

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
    document.getElementById('isActive').checked = semester.is_active;
    
    document.getElementById('semesterModal').classList.add('active');
}

function deleteSemester(id) {
    if (confirm('Are you sure you want to delete this semester?')) {
        semesters = semesters.filter(s => s.id !== id);
        filteredSemesters = filteredSemesters.filter(s => s.id !== id);
        renderSemesters();
        updateStats();
    }
}

function saveSemester(event) {
    event.preventDefault();
    
    const semesterData = {
        id: editingSemesterId || Date.now(),
        name: document.getElementById('semesterName').value,
        start_date: document.getElementById('startDate').value,
        end_date: document.getElementById('endDate').value,
        academic_year: document.getElementById('academicYear').value,
        is_active: document.getElementById('isActive').checked
    };
    
    if (editingSemesterId) {
        const index = semesters.findIndex(s => s.id === editingSemesterId);
        if (index !== -1) semesters[index] = semesterData;
    } else {
        semesters.push(semesterData);
    }
    
    filteredSemesters = [...semesters];
    renderSemesters();
    updateStats();
    closeModal();
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
