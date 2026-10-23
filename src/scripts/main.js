import '../styles/main.scss';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initNavigation() {
    const toggle = document.querySelector('.nav__toggle');
    const menu = document.getElementById('nav-menu');
    if (!toggle || !menu) return;

    const setOpen = (open) => {
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
        toggle.textContent = open ? '[ fermer ]' : '[ menu ]';
        menu.classList.toggle('is-open', open);
        document.body.classList.toggle('nav-open', open);
    };

    toggle.addEventListener('click', () => {
        setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    menu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => setOpen(false));
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && menu.classList.contains('is-open')) {
            setOpen(false);
        }
    });

    const desktop = window.matchMedia('(min-width: 901px)');
    const closeOnDesktop = (event) => {
        if (event.matches) setOpen(false);
    };

    if (typeof desktop.addEventListener === 'function') {
        desktop.addEventListener('change', closeOnDesktop);
    } else {
        desktop.addListener(closeOnDesktop);
    }
}

function initAnimations() {
    if (document.querySelector('.hero')) {
        const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });

        intro
            .from('.hero .prompt', { opacity: 0, y: 12, duration: 0.45 })
            .from('.hero__title', { opacity: 0, y: 26, duration: 0.8 }, '-=0.15')
            .from('.hero__role', { opacity: 0, y: 12, duration: 0.5 }, '-=0.5')
            .from('.hero__lead', { opacity: 0, y: 12, duration: 0.5 }, '-=0.35')
            .from('.hero__status', { opacity: 0, duration: 0.45 }, '-=0.3')
            .from('.hero__actions .btn', { opacity: 0, y: 10, duration: 0.4, stagger: 0.08 }, '-=0.25')
            .from('.profile', { opacity: 0, y: 20, duration: 0.7 }, '-=0.6');
    }

    gsap.utils.toArray('[data-reveal]').forEach((element) => {
        gsap.from(element, {
            opacity: 0,
            y: 24,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: element,
                start: 'top 88%',
                once: true,
            },
        });
    });
}

function initHeroCanvas() {
    const host = document.getElementById('hero-canvas');
    if (!host) return;

    import('./webgl.js')
        .then(({ initHeroDots }) => initHeroDots(host))
        .catch((error) => {
            host.classList.add('is-static');
            console.warn('Canvas du hero indisponible.', error);
        });
}

function start() {
    initNavigation();

    if (!prefersReducedMotion) {
        initAnimations();
        initHeroCanvas();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
} else {
    start();
}
