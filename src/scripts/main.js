import '../styles/main.scss';

// Projects Data
const projects = [
    {
        id: 1,
        title: "Site Web pour Agent de Football",
        description: "Site vitrine complet avec gestion de formulaires et présentation de joueurs.",
        image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800",
        tags: ["HTML5", "CSS3", "JavaScript"],
        rncp: "Développer une interface utilisateur",
        analysis: {
            progression: "Maîtrise de la structure sémantique et du responsive design.",
            errors: "Difficultés initiales avec la validation des formulaires côté client.",
            solutions: "Implémentation de Regex personnalisées et de retours visuels immédiats."
        }
    },
    {
        id: 2,
        title: "Application To-Do List",
        description: "Gestionnaire de tâches avec persistance locale et filtrage dynamique.",
        image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=800",
        tags: ["JavaScript", "Local Storage", "DOM Manipulation"],
        rncp: "Concevoir une application web",
        analysis: {
            progression: "Compréhension profonde de la manipulation du DOM et du cycle de vie des données.",
            errors: "Gestion complexe des états lors du filtrage.",
            solutions: "Refactorisation vers une approche basée sur les données (Data-driven)."
        }
    },
    {
        id: 3,
        title: "Portfolio RNCP",
        description: "Ce portfolio hybride conçu pour la validation du titre Epitech.",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
        tags: ["Vite", "Sass", "BEM"],
        rncp: "Démarche DevOps & Qualité",
        analysis: {
            progression: "Utilisation d'un workflow moderne (Vite, Sass) et méthodologie BEM.",
            errors: "Architecture CSS initiale trop monolithique.",
            solutions: "Découpage en modules SCSS pour une meilleure maintenance."
        }
    }
];

// DOM Elements
const viewToggle = document.getElementById('view-toggle');
const showcaseView = document.getElementById('showcase-view');
const pedagogicalView = document.getElementById('pedagogical-view');
const themeToggle = document.getElementById('theme-toggle');
const projectsContainer = document.getElementById('projects-container');
const pedagogicalList = document.getElementById('pedagogical-list');
const contactForm = document.getElementById('contact-form');

// Initialize Projects
function initProjects() {
    // Showcase View
    projectsContainer.innerHTML = projects.map(project => `
        <article class="project-card">
            <img src="${project.image}" alt="${project.title}" class="project-card__image">
            <div class="project-card__content">
                <span class="project-card__rncp">${project.rncp}</span>
                <h3 class="project-card__title">${project.title}</h3>
                <p class="project-card__description">${project.description}</p>
                <div class="project-card__tags">
                    ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <button class="btn btn--secondary btn--small" onclick="document.getElementById('view-toggle').click()">Détails RNCP</button>
            </div>
        </article>
    `).join('');

    // Pedagogical View
    pedagogicalList.innerHTML = projects.map(project => `
        <div class="pedagogical-item">
            <div class="pedagogical-item__header">
                <h3>${project.title}</h3>
                <span class="tag">${project.rncp}</span>
            </div>
            <div class="pedagogical-item__analysis">
                <div class="pedagogical-item__block">
                    <h4>Progression & Compétences</h4>
                    <p>${project.analysis.progression}</p>
                </div>
                <div class="pedagogical-item__block">
                    <h4>Erreurs & Solutions</h4>
                    <p><strong>Problème :</strong> ${project.analysis.errors}</p>
                    <p><strong>Solution :</strong> ${project.analysis.solutions}</p>
                </div>
            </div>
        </div>
    `).join('');
}

// View Switching
viewToggle.addEventListener('click', () => {
    const currentView = viewToggle.getAttribute('data-view');
    const nextView = currentView === 'showcase' ? 'pedagogical' : 'showcase';

    viewToggle.setAttribute('data-view', nextView);

    // Update labels
    const labels = viewToggle.querySelectorAll('.view-toggle__label');
    labels.forEach(label => {
        if (label.getAttribute('data-view') === nextView) {
            label.classList.add('view-toggle__label--active');
        } else {
            label.classList.remove('view-toggle__label--active');
        }
    });

    // Switch views
    if (nextView === 'pedagogical') {
        showcaseView.classList.add('hidden');
        pedagogicalView.classList.remove('hidden');
    } else {
        showcaseView.classList.remove('hidden');
        pedagogicalView.classList.add('hidden');
    }
});

// Theme Toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const icon = themeToggle.querySelector('i');
    if (document.body.classList.contains('dark-mode')) {
        icon.classList.replace('fa-moon', 'fa-sun');
    } else {
        icon.classList.replace('fa-sun', 'fa-moon');
    }
});

// Contact Form Handling with Formspree
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const status = document.getElementById('form-status');
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const data = new FormData(e.target);

    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = "Envoi en cours...";

    try {
        const response = await fetch(e.target.action, {
            method: contactForm.method,
            body: data,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            status.innerHTML = "Merci ! Votre message a été envoyé avec succès.";
            status.classList.remove('hidden', 'error');
            status.classList.add('success');
            contactForm.reset();
        } else {
            const result = await response.json();
            if (Object.hasOwn(result, 'errors')) {
                status.innerHTML = result.errors.map(error => error.message).join(", ");
            } else {
                status.innerHTML = "Oups ! Un problème est survenu lors de l'envoi.";
            }
            status.classList.remove('hidden', 'success');
            status.classList.add('error');
        }
    } catch (error) {
        status.innerHTML = "Oups ! Impossible de contacter le serveur.";
        status.classList.remove('hidden', 'success');
        status.classList.add('error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Envoyer";
    }
});

// Reveal Animation Logic
function initReveal() {
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.15
    });

    revealElements.forEach(el => revealObserver.observe(el));
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    initProjects();
    initReveal();

    // Check system preference for dark mode
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark-mode');
        themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
    }
});
