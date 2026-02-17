// Student Logic

let timetableData = [];

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    updateUI();
});

function loadData() {
    timetableData = JSON.parse(localStorage.getItem('timeWeaver_timetable')) || [];
}

function updateUI() {
    renderFullSchedule();
    renderTodaysClasses();
}

function renderFullSchedule() {
    const times = ["09:00", "10:00", "11:00", "12:00", "01:00", "02:00", "03:00"];
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const container = document.getElementById('student-timetable-body');

    container.innerHTML = times.map(time => `
        <div class="grid grid-cols-6 border-b border-border-color min-h-[100px]">
             <div class="p-4 border-r border-border-color text-xs font-bold text-text-muted flex items-center justify-center bg-main">
                ${time}
            </div>
            ${days.map(day => {
        const cls = timetableData.find(c => c.day === day && c.time === time);
        return `
                    <div class="p-2 border-r border-border-color relative group transition-colors hover:bg-main">
                        ${cls ? `
                            <div class="bg-card border border-border-color p-3 rounded-xl h-full shadow-sm hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-900/20 transition-all cursor-pointer group-hover:-translate-y-1">
                                <p class="text-[10px] font-black text-cyan-400 uppercase tracking-tight neon-text">${cls.subject}</p>
                                <p class="text-xs font-bold text-text-main mt-1">${cls.faculty}</p>
                                <div class="flex justify-between items-end mt-2">
                                    <span class="text-[10px] font-bold text-text-muted bg-main border border-border-color px-2 py-0.5 rounded">${cls.room}</span>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                `;
    }).join('')}
        </div>
    `).join('');
}

function renderTodaysClasses() {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const currentDayName = days[new Date().getDay()];
    // For demo, if it's weekend, just default to Monday
    const displayDay = (currentDayName === "Sunday" || currentDayName === "Saturday") ? "Monday" : currentDayName;

    document.getElementById('current-day-badge').innerText = displayDay;

    const todaysClasses = timetableData.filter(t => t.day === displayDay).sort((a, b) => a.time.localeCompare(b.time));
    const container = document.getElementById('todays-classes-list');

    if (todaysClasses.length === 0) {
        container.innerHTML = '<p class="text-text-muted text-center py-4 text-sm font-medium">No classes scheduled for today.</p>';
        return;
    }

    container.innerHTML = todaysClasses.map(cls => `
        <div class="flex items-center gap-4 p-4 rounded-xl border border-border-color bg-card hover:bg-main hover:border-text-muted hover:shadow-md transition cursor-pointer">
            <div class="w-16 text-center">
                <p class="text-sm font-black text-text-main">${cls.time}</p>
                <p class="text-[10px] uppercase font-bold text-text-muted">Time</p>
            </div>
            <div class="w-1 h-10 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.6)]"></div>
            <div class="flex-1">
                <h4 class="font-bold text-text-main text-sm">${cls.subject}</h4>
                <p class="text-xs text-text-muted font-medium">${cls.faculty}</p>
            </div>
            <div class="px-3 py-1 bg-main border border-border-color rounded-lg text-xs font-bold text-text-muted shadow-sm">
                ${cls.room}
            </div>
        </div>
    `).join('');
}

function showPage(pageId) {
    document.querySelectorAll('.page-content').forEach(p => p.classList.add('hidden'));
    document.querySelectorAll('.sidebar-item').forEach(b => b.classList.remove('active'));
    document.getElementById(`page-${pageId}`).classList.remove('hidden');
    document.getElementById(`btn-${pageId}`).classList.add('active');
}
