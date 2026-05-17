function getCurrentPage() {
    const path = window.location.pathname;
    if (path.endsWith('/index.html') || path === '/' || path === '') return 'index';
    if (path.endsWith('/about.html')) return 'about';
    if (path.endsWith('/projects.html')) return 'projects';
    if (path.endsWith('/pedagogical.html')) return 'pedagogical';
    if (path.endsWith('/skills.html')) return 'skills';
    if (path.endsWith('/contact.html')) return 'contact';
    return 'index';
}

const currentPage = getCurrentPage();

const navLinks = [
    { href: '/index.html', label: 'Accueil', id: 'index' },
    { href: '/about.html', label: 'Bio', id: 'about' },
    { href: '/projects.html', label: 'Projets', id: 'projects' },
    { href: '/pedagogical.html', label: 'Pédagogique', id: 'pedagogical' },
    { href: '/skills.html', label: 'Compétences', id: 'skills' },
    { href: '/contact.html', label: 'Contact', id: 'contact' },
];

const headerHTML = `
<nav class="nav container">
    <div class="nav__logo">
        <a href="/index.html" class="nav__logo-text">N'Baye Niang</a>
    </div>
    <button class="nav__toggle" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="nav-menu">
        <i class="fas fa-bars"></i>
    </button>
    <ul class="nav__list" id="nav-menu">
        ${navLinks.map(link => `
            <li><a href="${link.href}" class="nav__link ${currentPage === link.id ? 'nav__link--active' : ''}" ${currentPage === link.id ? 'aria-current="page"' : ''}>${link.label}</a></li>
        `).join('')}
    </ul>
    <button class="theme-toggle" id="theme-toggle" aria-label="Basculer entre le thème clair et sombre">
        <i class="fas fa-moon"></i>
    </button>
</nav>
`;

function initTheme() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

    if (isDark) {
        document.body.classList.add('dark-mode');
        toggle.querySelector('i').className = 'fas fa-sun';
    }

    toggle.addEventListener('click', () => {
        const isDarkMode = document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        toggle.querySelector('i').className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
    });
}

function initMobileMenu() {
    const toggle = document.querySelector('.nav__toggle');
    const menu = document.getElementById('nav-menu');
    if (!toggle || !menu) return;

    menu.setAttribute('aria-hidden', 'true');

    toggle.addEventListener('click', () => {
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!isExpanded));
        menu.classList.toggle('nav__list--open');
        menu.setAttribute('aria-hidden', String(isExpanded));
        const icon = toggle.querySelector('i');
        icon.className = isExpanded ? 'fas fa-bars' : 'fas fa-times';
    });

    menu.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
            toggle.setAttribute('aria-expanded', 'false');
            menu.classList.remove('nav__list--open');
            menu.setAttribute('aria-hidden', 'true');
            toggle.querySelector('i').className = 'fas fa-bars';
        });
    });
}

const header = document.getElementById('site-header');
if (header) {
    header.innerHTML = headerHTML;
    initTheme();
    initMobileMenu();
}
