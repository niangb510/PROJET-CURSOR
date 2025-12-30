document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
    } else if (currentTheme === 'light') {
        body.classList.remove('dark-mode');
    }

    if (!currentTheme && prefersDarkScheme.matches) {
        body.classList.add('dark-mode');
    }

    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        let theme = 'light';
        if (body.classList.contains('dark-mode')) {
            theme = 'dark';
        }
        localStorage.setItem('theme', theme);
        darkModeToggle.classList.add('pulse-effect');
        setTimeout(() => {
            darkModeToggle.classList.remove('pulse-effect');
        }, 500);
    });

    const toggleButtons = document.querySelectorAll('.toggle-btn');

    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            const icon = button.querySelector('i');

            if (!targetElement) return;

            const isVisible = targetElement.style.maxHeight !== '0px';

            if (isVisible) {
                targetElement.style.maxHeight = '0px';
                targetElement.style.paddingTop = '0';
                targetElement.style.opacity = '0';
                icon.classList.remove('fa-minus-circle');
                icon.classList.add('fa-plus-circle');
                targetElement.classList.add('collapsed');
            } else {
                targetElement.style.maxHeight = targetElement.scrollHeight + 'px';
                targetElement.style.paddingTop = '20px';
                targetElement.style.opacity = '1';
                icon.classList.remove('fa-plus-circle');
                icon.classList.add('fa-minus-circle');
                targetElement.classList.remove('collapsed');
            }
        });

        const targetId = button.getAttribute('data-target');
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.style.transition = 'max-height 0.4s ease-in-out, opacity 0.4s ease-in-out, padding 0.4s ease-in-out';
            targetElement.style.maxHeight = targetElement.scrollHeight + 'px';
            targetElement.style.overflow = 'hidden';
        }
    });

});
