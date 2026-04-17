// ===========================
// Dark/Light Theme Toggle
// ===========================
(function () {
    const saved = localStorage.getItem('theme');
    const theme = saved || 'dark';
    document.documentElement.setAttribute('data-theme', theme);

    document.addEventListener('DOMContentLoaded', function () {
        const btn = document.getElementById('themeToggle');
        if (!btn) return;

        function updateIcon() {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            btn.textContent = isDark ? '☀️' : '🌙';
            btn.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
        }

        updateIcon();

        btn.addEventListener('click', function () {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const next = isDark ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            updateIcon();
        });

        // Hamburger menu toggle
        const hamburger = document.getElementById('hamburgerBtn');
        const navLinks = document.querySelector('.nav-links');
        if (hamburger && navLinks) {
            hamburger.addEventListener('click', function () {
                navLinks.classList.toggle('nav-open');
                hamburger.classList.toggle('hamburger-active');
            });
            // Close menu when a nav link is clicked
            navLinks.querySelectorAll('.nav-link').forEach(function (link) {
                link.addEventListener('click', function () {
                    navLinks.classList.remove('nav-open');
                    hamburger.classList.remove('hamburger-active');
                });
            });
        }
    });
})();
