// Theme Config & Toggle Logic
tailwind.config = {
    darkMode: 'class', // We'll control this via data-theme attribute mostly or class if needed
    theme: {
        extend: {
            colors: {
                main: 'var(--bg-main)',
                card: 'var(--bg-card)',
                'text-main': 'var(--text-main)',
                'text-muted': 'var(--text-muted)',
                'border-color': 'var(--border)',
                primary: 'var(--primary)',
                accent: 'var(--accent)',
            }
        }
    }
}

// Function to set theme
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('timeWeaver_theme', theme);

    // Update toggle button icon if it exists
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
        const icon = toggleBtn.querySelector('i');
        if (theme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            toggleBtn.title = "Switch to Light Mode";
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            toggleBtn.title = "Switch to Dark Mode";
        }
    }
}

// Function to toggle theme
function toggleTheme() {
    const current = localStorage.getItem('timeWeaver_theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
}

// Initialize on load
(function () {
    const saved = localStorage.getItem('timeWeaver_theme') || 'light'; // Default to light
    setTheme(saved);
})();
