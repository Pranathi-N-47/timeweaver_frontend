let sections = [
    { id: 1, name: 'Section A', semester_id: 1, semester_name: 'Fall 2024', max_students: 60, current_students: 58 },
    { id: 2, name: 'Section B', semester_id: 1, semester_name: 'Fall 2024', max_students: 60, current_students: 55 },
    { id: 3, name: 'Section C', semester_id: 2, semester_name: 'Spring 2025', max_students: 50, current_students: 48 }
];

let semesters = [
    { id: 1, name: 'Fall 2024' },
    { id: 2, name: 'Spring 2025' },
    { id: 3, name: 'Fall 2025' }
];

let filteredSections = [...sections];
let editingSectionId = null;

window.onload = function() {
    loadSemesters();
    renderSections();
    updateStats();
};

function loadSemesters() {
    const filterSelect = document.getElementById('filterSemester');
    const sectionSelect = document.getElementById('semesterId');
    
    semesters.forEach(sem => {
        const option1 = new Option(sem.name, sem.id);
        const option2 = new Option(sem.name, sem.id);
        filterSelect.add(option1);
        sectionSelect.add(option2);
    });
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
            <td>${section.semester_name}</td>
            <td>${section.max_students}</td>
            <td>
                <span class="badge ${section.current_students >= section.max_students ? 'badge-info' : 'badge-success'}">
                    ${section.current_students}
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
        section.semester_name.toLowerCase().includes(searchTerm)
    );
    renderSections();
}

function applyFilters() {
    const semesterFilter = document.getElementById('filterSemester').value;
    
    filteredSections = sections.filter(section => {
        if (semesterFilter && section.semester_id != semesterFilter) return false;
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
    document.getElementById('semesterId').value = section.semester_id;
    document.getElementById('maxStudents').value = section.max_students;
    document.getElementById('currentStudents').value = section.current_students || 0;
    
    document.getElementById('sectionModal').classList.add('active');
}

function deleteSection(id) {
    if (confirm('Are you sure you want to delete this section?')) {
        sections = sections.filter(s => s.id !== id);
        filteredSections = filteredSections.filter(s => s.id !== id);
        renderSections();
        updateStats();
    }
}

function saveSection(event) {
    event.preventDefault();
    
    const semId = parseInt(document.getElementById('semesterId').value);
    const semester = semesters.find(s => s.id === semId);
    
    const sectionData = {
        id: editingSectionId || Date.now(),
        name: document.getElementById('sectionName').value,
        semester_id: semId,
        semester_name: semester ? semester.name : '',
        max_students: parseInt(document.getElementById('maxStudents').value),
        current_students: parseInt(document.getElementById('currentStudents').value) || 0
    };
    
    if (editingSectionId) {
        const index = sections.findIndex(s => s.id === editingSectionId);
        if (index !== -1) sections[index] = sectionData;
    } else {
        sections.push(sectionData);
    }
    
    filteredSections = [...sections];
    renderSections();
    updateStats();
    closeModal();
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
