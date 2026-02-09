let departments = [
    { id: 1, code: 'CSE', name: 'Computer Science & Engineering', head: 'Dr. Sarah Johnson' },
    { id: 2, code: 'ECE', name: 'Electronics & Communication Engineering', head: 'Dr. Michael Chen' },
    { id: 3, code: 'ME', name: 'Mechanical Engineering', head: 'Dr. Robert Smith' },
    { id: 4, code: 'CE', name: 'Civil Engineering', head: 'Dr. Emily Davis' },
    { id: 5, code: 'EEE', name: 'Electrical & Electronics Engineering', head: 'Dr. James Wilson' }
];

let filteredDepartments = [...departments];
let editingDeptId = null;

window.onload = function() {
    renderDepartments();
    updateStats();
};

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
            <td>${dept.head || '-'}</td>
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
        (dept.head && dept.head.toLowerCase().includes(searchTerm))
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
    document.getElementById('deptHead').value = dept.head || '';
    
    document.getElementById('departmentModal').classList.add('active');
}

function deleteDepartment(id) {
    if (confirm('Are you sure you want to delete this department?')) {
        departments = departments.filter(d => d.id !== id);
        filteredDepartments = filteredDepartments.filter(d => d.id !== id);
        renderDepartments();
        updateStats();
    }
}

function saveDepartment(event) {
    event.preventDefault();
    
    const deptData = {
        id: editingDeptId || Date.now(),
        code: document.getElementById('deptCode').value,
        name: document.getElementById('deptName').value,
        head: document.getElementById('deptHead').value
    };
    
    if (editingDeptId) {
        const index = departments.findIndex(d => d.id === editingDeptId);
        if (index !== -1) departments[index] = deptData;
    } else {
        departments.push(deptData);
    }
    
    filteredDepartments = [...departments];
    renderDepartments();
    updateStats();
    closeModal();
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
