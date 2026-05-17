import '../styles/main.scss';
import './header.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initWebGLBackground } from './webgl.js';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Contact Form Handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const status = document.getElementById('form-status');
        const name = contactForm.querySelector('#name').value.trim();
        const email = contactForm.querySelector('#email').value.trim();
        const message = contactForm.querySelector('#message').value.trim();

        // Advanced validation
        let errors = [];
        if (!name) errors.push('Le nom est requis.');
        if (!email) errors.push("L'email est requis.");
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("L'email n'est pas valide.");
        if (!message) errors.push('Le message est requis.');
        else if (message.length < 10) errors.push('Le message doit contenir au moins 10 caractères.');

        if (errors.length > 0) {
            status.innerHTML = errors.join('<br>');
            status.classList.remove('hidden', 'success');
            status.classList.add('error');
            status.setAttribute('role', 'alert');
            status.setAttribute('aria-live', 'polite');
            return;
        }

        const subject = encodeURIComponent(`Contact Portfolio de ${name}`);
        const body = encodeURIComponent(`De: ${name} (${email})\n\nMessage:\n${message}`);
        const mailtoUrl = `mailto:niangaffou@gmail.com?subject=${subject}&body=${body}`;

        status.innerHTML = "Votre application de messagerie va s'ouvrir pour envoyer le mail.";
        status.classList.remove('hidden', 'error');
        status.classList.add('success');
        status.setAttribute('role', 'status');
        status.setAttribute('aria-live', 'polite');

        setTimeout(() => {
            window.location.href = mailtoUrl;
        }, 1000);
    });
}

// Reveal Animation Logic
function initReveal() {
    if (prefersReducedMotion) return;
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length === 0) return;

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

// GSAP Dynamic Animations
function initDynamicAnimations() {
    if (prefersReducedMotion) return;

    // 1. Text reveal animation for section titles (excluding typewriter titles to avoid conflicts)
    const titles = document.querySelectorAll('.section-title:not(.typewriter-title)');
    titles.forEach(title => {
        const text = title.textContent;
        title.innerHTML = text.split('').map(char =>
            `<span class="split-char">${char === ' ' ? '&nbsp;' : char}</span>`
        ).join('');

        gsap.from(title.querySelectorAll('.split-char'), {
            scrollTrigger: {
                trigger: title,
                start: "top 85%",
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.02,
            ease: "power3.out"
        });
    });

    // 2. Parallax effect for hero section (only on index page)
    const heroImage = document.querySelector('.hero__image');
    if (heroImage) {
        gsap.to('.hero__image', {
            scrollTrigger: {
                trigger: '.hero',
                start: "top top",
                end: "bottom top",
                scrub: true
            },
            y: 100,
            scale: 1.1,
            ease: "none"
        });
    }

    // 3. Magnetic effect on nav links (desktop only)
    if (window.matchMedia('(hover: hover)').matches) {
        const navLinks = document.querySelectorAll('.nav__link, .btn');
        navLinks.forEach(link => {
            link.addEventListener('mousemove', (e) => {
                const rect = link.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                gsap.to(link, {
                    x: x * 0.3,
                    y: y * 0.3,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });

            link.addEventListener('mouseleave', () => {
                gsap.to(link, {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: "elastic.out(1, 0.3)"
                });
            });
        });
    }
}

// Typewriter Effect
function initTypewriterEffect() {
    if (prefersReducedMotion) return;
    const titleElements = document.querySelectorAll('.typewriter-title');
    if (titleElements.length === 0) return;

    titleElements.forEach(titleElement => {
        const text = titleElement.textContent.trim();
        titleElement.innerHTML = '';
        titleElement.setAttribute('aria-label', text);
        let i = 0;

        function typeWriter() {
            if (i < text.length) {
                titleElement.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            } else {
                titleElement.style.borderRight = '4px solid #6d28d9';
                gsap.to(titleElement, { borderRightColor: 'transparent', repeat: -1, yoyo: true, duration: 0.8 });
            }
        }

        setTimeout(typeWriter, 500);
    });
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    initReveal();
    initDynamicAnimations();
    initTypewriterEffect();

    // Only initialize WebGL on the homepage to save resources
    const path = window.location.pathname;
    const isHomePage = path === '/' || path.endsWith('/index.html') || path === '';
    if (isHomePage) {
        initWebGLBackground();
    }
});
