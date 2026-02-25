// Registration System Logic

const STUDENT_ID = 101; // Mock student ID for demo, should come from auth
const SEMESTER_ID = 1;
const API_STUDENT = '/api/student';
const API_ACADEMIC = '/api/academic';

let availableCourses = [];
let registeredCourses = [];
let backlogs = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchData();
});

async function fetchData() {
    try {
        // Fetch all courses
        const coursesRes = await fetch(`${API_ACADEMIC}/courses`);
        availableCourses = await coursesRes.json();

        // Fetch registered courses
        const regRes = await fetch(`${API_STUDENT}/registrations/${STUDENT_ID}?semester_id=${SEMESTER_ID}`);
        registeredCourses = await regRes.json();

        // Fetch backlogs
        const backlogRes = await fetch(`${API_STUDENT}/backlogs/${STUDENT_ID}`);
        backlogs = await backlogRes.json();

        updateUI();
    } catch (err) {
        console.error('Error fetching data:', err);
        showNotification('Failed to load data', 'error');
    }
}

function updateUI() {
    renderAvailableCourses();
    renderRegisteredCourses();
    renderBacklogs();
    updateRegCount();
}

function renderAvailableCourses() {
    const list = document.getElementById('available-courses-list');

    // Filter out already registered courses
    const unregistered = availableCourses.filter(c =>
        !registeredCourses.some(rc => rc.course_id === c.id)
    );

    if (unregistered.length === 0) {
        list.innerHTML = '<p class="text-text-muted text-center py-4">No more courses available for registration.</p>';
        return;
    }

    list.innerHTML = unregistered.map(course => `
        <div class="flex items-center justify-between p-4 rounded-xl border border-border-color bg-main/30 hover:bg-main/50 transition duration-300">
            <div>
                <h4 class="font-bold text-sm">${course.name}</h4>
                <p class="text-xs text-text-muted font-medium">${course.code} • ${course.credits} Credits</p>
            </div>
            <button onclick="registerCourse(${course.id})" 
                class="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-lg shadow-red-500/20">
                Register
            </button>
        </div>
    `).join('');
}

function renderRegisteredCourses() {
    const list = document.getElementById('registered-courses-list');

    if (registeredCourses.length === 0) {
        list.innerHTML = '<p class="text-text-muted text-center py-4">No courses registered yet.</p>';
        return;
    }

    list.innerHTML = registeredCourses.map(reg => `
        <div class="flex items-center justify-between p-4 rounded-xl border border-green-500/20 bg-green-500/5">
            <div>
                <h4 class="font-bold text-sm text-text-main">${reg.course_name}</h4>
                <p class="text-xs text-text-muted font-medium">${reg.course_code} • Registered</p>
            </div>
            <div class="flex items-center gap-2">
                <span class="text-[10px] font-bold text-green-500 uppercase tracking-widest bg-green-500/10 px-2 py-1 rounded">Confirmed</span>
            </div>
        </div>
    `).join('');
}

function renderBacklogs() {
    const list = document.getElementById('backlogs-list');

    if (backlogs.length === 0) {
        list.innerHTML = '<p class="text-red-400 text-sm italic">No backlogs detected. Great job!</p>';
        return;
    }

    list.innerHTML = backlogs.map(backlog => `
        <div class="p-3 rounded-xl bg-red-500/5 border border-red-500/10 mb-2">
            <h4 class="font-bold text-xs text-red-500">${backlog.course_name}</h4>
            <p class="text-[10px] text-red-400 font-medium">${backlog.course_code} • Grade: ${backlog.grade}</p>
            <button onclick="registerCourse(${backlog.course_id})" 
                class="mt-2 w-full bg-red-500/20 hover:bg-red-500/30 text-red-500 text-[10px] font-bold py-1.5 rounded-lg transition-colors">
                Re-register
            </button>
        </div>
    `).join('');
}

function updateRegCount() {
    const count = registeredCourses.length;
    const hasBacklogs = backlogs.length > 0;
    const limit = hasBacklogs ? 8 : 6;

    document.getElementById('reg-count').innerText = count;
    document.getElementById('reg-limit').innerText = limit;

    const badge = document.getElementById('reg-count');
    if (count >= limit) {
        badge.classList.remove('text-primary');
        badge.classList.add('text-red-500');
    } else {
        badge.classList.add('text-primary');
        badge.classList.remove('text-red-500');
    }
}

async function registerCourse(courseId) {
    const hasBacklogs = backlogs.length > 0;
    const limit = hasBacklogs ? 8 : 6;

    if (registeredCourses.length >= limit) {
        showNotification(`Registration limit reached (Max ${limit})`, 'error');
        return;
    }

    try {
        const response = await fetch(`${API_STUDENT}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                student_id: STUDENT_ID,
                course_id: courseId,
                semester_id: SEMESTER_ID
            })
        });

        const data = await response.json();

        if (response.ok) {
            showNotification('Successfully registered!', 'success');
            await fetchData();
        } else {
            showNotification(data.error || 'Registration failed', 'error');
        }
    } catch (err) {
        console.error('Error registering:', err);
        showNotification('Connection error', 'error');
    }
}

function showNotification(message, type = 'success') {
    const notif = document.getElementById('notification');
    const msgEl = document.getElementById('notif-message');
    const iconEl = document.getElementById('notif-icon');

    msgEl.innerText = message;

    if (type === 'error') {
        iconEl.innerHTML = '<i class="fa-solid fa-circle-xmark"></i>';
        iconEl.className = 'w-8 h-8 rounded-full flex items-center justify-center bg-red-500/20 text-red-500';
    } else {
        iconEl.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
        iconEl.className = 'w-8 h-8 rounded-full flex items-center justify-center bg-green-500/20 text-green-500';
    }

    notif.classList.remove('translate-y-20', 'opacity-0');
    notif.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
        notif.classList.add('translate-y-20', 'opacity-0');
        notif.classList.remove('translate-y-0', 'opacity-100');
    }, 3000);
}
