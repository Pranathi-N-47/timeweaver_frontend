// Faculty Logic

let currentUser = null;
let timetableData = [];
let facultyList = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    initLogin();
});

function loadData() {
    facultyList = JSON.parse(localStorage.getItem('timeWeaver_faculty')) || [];
    timetableData = JSON.parse(localStorage.getItem('timeWeaver_timetable')) || [];
}

function initLogin() {
    const select = document.getElementById('user-select');

    if (facultyList.length === 0) {
        // Fallback if no data
        facultyList = [{ id: 1, name: "Dr. Sarah Thorne", dept: "CS", max: 18 }];
    }

    select.innerHTML = facultyList.map(f =>
        `<option value="${f.id}">${f.name}</option>`
    ).join('');

    // Check if previously logged in (mock session)
    // For now, simpler to always ask, or just default to first
    // document.getElementById('login-modal').classList.remove('hidden');
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
    document.getElementById('login-modal').classList.remove('hidden');
}

function updateUI() {
    // Update Sidebar Profile
    document.getElementById('current-user-name').innerText = currentUser.name;

    // Calculate Stats
    const myClasses = timetableData.filter(t => t.faculty === currentUser.name);
    const currentLoad = myClasses.length;

    document.getElementById('stat-current-load').innerText = currentLoad;
    document.getElementById('stat-max-load').innerText = currentUser.max || 18;

    const loadPercent = Math.min((currentLoad / (currentUser.max || 18)) * 100, 100);
    document.getElementById('load-bar').style.width = `${loadPercent}%`;
    document.getElementById('load-bar').className = `h-full rounded-full ${currentLoad > (currentUser.max || 18) ? 'bg-red-500' : 'bg-blue-500'}`;

    // Render Timetable
    renderMySchedule(myClasses);

    // update Next Class view
    // (Simple logic: just show a random one or first one for demo)
    if (myClasses.length > 0) {
        const next = myClasses[0]; // Just showing first found
        document.getElementById('next-class-container').innerHTML = `
            <p class="text-xl font-bold mt-1 text-text-main">${next.subject}</p>
            <div class="flex items-center gap-2 mt-2 text-sm text-text-muted font-semibold">
                <i class="fa-regular fa-clock text-fuchsia-400"></i> ${next.day} @ ${next.time}
            </div>
            <div class="flex items-center gap-2 mt-1 text-sm text-text-muted font-semibold">
                <i class="fa-solid fa-location-dot text-fuchsia-400"></i> ${next.room}
            </div>
        `;
    } else {
        document.getElementById('next-class-container').innerHTML = `
            <p class="text-xl font-bold mt-1 text-text-muted">No classes assigned</p>
        `;
    }
}

function renderMySchedule(classes) {
    const times = ["09:00", "10:00", "11:00", "12:00", "01:00", "02:00", "03:00"];
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const container = document.getElementById('faculty-timetable-body');

    container.innerHTML = times.map(time => `
        <div class="grid grid-cols-6 border-b border-border-color min-h-[100px]">
            <div class="p-4 border-r border-border-color text-xs font-bold text-text-muted flex items-center justify-center bg-main">
                ${time}
            </div>
            ${days.map(day => {
        const cls = classes.find(c => c.day === day && c.time === time);
        return `
                    <div class="p-2 border-r border-border-color relative group transition-colors hover:bg-main">
                        ${cls ? `
                            <div class="bg-fuchsia-500/10 border border-fuchsia-500/20 p-3 rounded-xl h-full shadow-sm hover:shadow-lg hover:shadow-fuchsia-900/20 transition-all cursor-pointer group-hover:-translate-y-1">
                                <p class="text-[10px] font-black text-fuchsia-400 uppercase tracking-tight neon-text">Lecture</p>
                                <p class="text-xs font-extra-bold text-text-main leading-tight mt-1 mb-2">${cls.subject}</p>
                                <div class="flex items-center gap-1 text-[10px] font-bold text-text-muted bg-main inline-block px-2 py-1 rounded-md border border-border-color">
                                    <i class="fa-solid fa-location-dot text-fuchsia-400"></i> ${cls.room}
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
    document.getElementById(`page-${pageId}`).classList.remove('hidden');
    document.getElementById(`btn-${pageId}`).classList.add('active');
}

function printSchedule() {
    window.print();
}
