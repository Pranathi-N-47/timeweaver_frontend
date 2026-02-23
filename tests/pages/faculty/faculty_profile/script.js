// Faculty Logic - Updated for Profile & Dropdown

let currentUser = null;
let timetableData = [];
let facultyList = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    initLogin();
    loadSettings();

    // Close dropdown when clicking outside
    window.addEventListener('click', (e) => {
        const dropdown = document.getElementById('profile-dropdown');
        const circle = document.getElementById('profile-circle-init');
        if (dropdown && dropdown.classList.contains('show') && !circle.contains(e.target)) {
            dropdown.classList.remove('show');
        }
    });
});

function loadData() {
    facultyList = JSON.parse(localStorage.getItem('timeWeaver_faculty')) || [];
    timetableData = JSON.parse(localStorage.getItem('timeWeaver_timetable')) || [];
}

function initLogin() {
    const select = document.getElementById('user-select');

    if (facultyList.length === 0) {
        // Fallback if no data
        facultyList = [
            { id: 1, name: "Dr. Sarah Thorne", dept: "Computer Science", max: 18, email: "sarah.thorne@timeweaver.edu" },
            { id: 2, name: "Prof. James Wilson", dept: "Mathematics", max: 15, email: "j.wilson@timeweaver.edu" }
        ];
    }

    select.innerHTML = facultyList.map(f =>
        `<option value="${f.id}">${f.name}</option>`
    ).join('');
}

function login() {
    const select = document.getElementById('user-select');
    const selectedId = select.value;
    currentUser = facultyList.find(f => f.id == selectedId);

    if (currentUser) {
        document.getElementById('login-modal').classList.add('hidden');
        updateUI();
    }
}

function logout() {
    currentUser = null;
    initLogin(); // Refresh list to show any name changes
    document.getElementById('login-modal').classList.remove('hidden');
    document.getElementById('profile-dropdown').classList.remove('show');
}

function toggleDropdown() {
    const dropdown = document.getElementById('profile-dropdown');
    dropdown.classList.toggle('show');
}

function updateUI() {
    if (!currentUser) return;

    // Update Header
    document.getElementById('header-user-name').innerText = currentUser.name;
    document.getElementById('header-user-dept').innerText = currentUser.dept;

    // Update Header Initials
    const initials = currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    document.getElementById('profile-circle-init').innerText = initials;

    // Update Profile Page
    document.getElementById('profile-avatar-big').innerText = initials;
    document.getElementById('profile-name').innerText = currentUser.name;
    document.getElementById('profile-dept').innerText = currentUser.dept + " Department";
    document.getElementById('profile-id').innerText = `FAC-${String(currentUser.id).padStart(3, '0')}`;
    document.getElementById('profile-email').innerText = currentUser.email || `${currentUser.name.toLowerCase().split(' ').join('.')}@timeweaver.edu`;

    // Calculate Stats
    const myClasses = timetableData.filter(t => t.faculty === currentUser.name);
    const currentLoad = myClasses.length;

    document.getElementById('stat-current-load').innerText = currentLoad;
    document.getElementById('stat-max-load').innerText = currentUser.max || 18;

    document.getElementById('profile-load').innerText = currentLoad;
    document.getElementById('profile-max').innerText = currentUser.max || 18;

    const loadPercent = Math.min((currentLoad / (currentUser.max || 18)) * 100, 100);
    const loadBar = document.getElementById('load-bar');
    loadBar.style.width = `${loadPercent}%`;
    loadBar.className = `h-full rounded-full ${currentLoad > (currentUser.max || 18) ? 'bg-red-500' : 'bg-indigo-500'}`;

    // Render Timetable
    renderMySchedule(myClasses);

    // Update Next Class view
    if (myClasses.length > 0) {
        const next = myClasses[0];
        document.getElementById('next-class-container').innerHTML = `
            <p class="text-xl font-bold mt-1 text-slate-800">${next.subject}</p>
            <div class="flex items-center gap-2 mt-2 text-sm text-slate-500 font-semibold">
                <i class="fa-regular fa-clock"></i> ${next.day} @ ${next.time}
            </div>
            <div class="flex items-center gap-2 mt-1 text-sm text-slate-500 font-semibold">
                <i class="fa-solid fa-location-dot"></i> ${next.room}
            </div>
        `;
    } else {
        document.getElementById('next-class-container').innerHTML = `
            <p class="text-xl font-bold font-medium mt-1 text-slate-400 italic">No classes assigned</p>
        `;
    }
}

function renderMySchedule(classes) {
    const times = ["09:00", "10:00", "11:00", "12:00", "01:00", "02:00", "03:00"];
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const container = document.getElementById('faculty-timetable-body');

    if (!container) return;

    container.innerHTML = times.map(time => `
        <div class="grid grid-cols-6 border-b border-slate-100 min-h-[100px]">
            <div class="p-4 border-r border-slate-100 text-[10px] font-black text-slate-400 flex items-center justify-center bg-slate-50/30">
                ${time}
            </div>
            ${days.map(day => {
        const cls = classes.find(c => c.day === day && c.time === time);
        return `
                    <div class="p-2 border-r border-slate-50 relative group transition-colors hover:bg-slate-50/50">
                        ${cls ? `
                            <div class="bg-indigo-50/50 border border-indigo-100 p-3 rounded-xl h-full shadow-sm hover:shadow-md transition-all cursor-pointer">
                                <p class="text-[9px] font-black text-indigo-400 uppercase tracking-tight">Lecture</p>
                                <p class="text-[11px] font-bold text-slate-700 leading-tight mt-1 mb-2">${cls.subject}</p>
                                <div class="flex items-center gap-1 text-[9px] font-bold text-slate-400 bg-white/50 inline-block px-2 py-1 rounded-md">
                                    <i class="fa-solid fa-location-dot text-indigo-300"></i> ${cls.room}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                `;
    }).join('')}
        </div>
    `).join('');
}

// Navigation
function showPage(pageId) {
    document.querySelectorAll('.page-content').forEach(p => p.classList.add('hidden'));
    document.querySelectorAll('.sidebar-item').forEach(b => b.classList.remove('active'));

    const page = document.getElementById(`page-${pageId}`);
    const btn = document.getElementById(`btn-${pageId}`);

    if (page) page.classList.remove('hidden');
    if (btn) btn.classList.add('active');

    // Hide dropdown if open
    document.getElementById('profile-dropdown').classList.remove('show');
}

function printSchedule() {
    window.print();
}

// Edit Profile Logic
function openEditModal() {
    if (!currentUser) return;

    document.getElementById('edit-name').value = currentUser.name;
    document.getElementById('edit-email').value = currentUser.email || `${currentUser.name.toLowerCase().split(' ').join('.')}@timeweaver.edu`;
    document.getElementById('edit-dept').value = currentUser.dept;

    document.getElementById('edit-profile-modal').classList.remove('hidden');
}

function closeEditModal() {
    document.getElementById('edit-profile-modal').classList.add('hidden');
}

function saveProfile(event) {
    event.preventDefault();

    const newName = document.getElementById('edit-name').value;
    const newEmail = document.getElementById('edit-email').value;
    const newDept = document.getElementById('edit-dept').value;

    // Update current user
    currentUser.name = newName;
    currentUser.email = newEmail;
    currentUser.dept = newDept;

    // Update in faculty list
    const index = facultyList.findIndex(f => f.id === currentUser.id);
    if (index !== -1) {
        facultyList[index] = { ...currentUser };
    }

    // Persist to localStorage
    localStorage.setItem('timeWeaver_faculty', JSON.stringify(facultyList));

    // Update UI
    updateUI();
    closeEditModal();

    alert('Profile updated successfully!');
}

// Settings Logic
function toggleSwitch(element) {
    const isEnabled = element.classList.contains('bg-indigo-600');
    const dot = element.querySelector('div');
    const settingId = element.getAttribute('data-setting');

    if (isEnabled) {
        // Disable
        element.classList.remove('bg-indigo-600');
        element.classList.add('bg-slate-200');
        dot.classList.remove('right-1');
        dot.classList.add('left-1');
        saveSetting(settingId, false);
    } else {
        // Enable
        element.classList.remove('bg-slate-200');
        element.classList.add('bg-indigo-600');
        dot.classList.remove('left-1');
        dot.classList.add('right-1');
        saveSetting(settingId, true);
    }
}

function saveSetting(id, value) {
    let settings = JSON.parse(localStorage.getItem('timeWeaver_settings')) || {};
    settings[id] = value;
    localStorage.setItem('timeWeaver_settings', JSON.stringify(settings));
}

function loadSettings() {
    let settings = JSON.parse(localStorage.getItem('timeWeaver_settings')) || {
        'email-notif': true,
        'system-alerts': false
    };

    document.querySelectorAll('[data-setting]').forEach(el => {
        const id = el.getAttribute('data-setting');
        const val = settings[id];
        const dot = el.querySelector('div');

        if (val) {
            el.classList.add('bg-indigo-600');
            el.classList.remove('bg-slate-200');
            dot.classList.add('right-1');
            dot.classList.remove('left-1');
        } else {
            el.classList.remove('bg-indigo-600');
            el.classList.add('bg-slate-200');
            dot.classList.add('left-1');
            dot.classList.remove('right-1');
        }
    });
}
