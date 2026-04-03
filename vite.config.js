import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    root: './',
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                about: resolve(__dirname, 'about.html'),
                projects: resolve(__dirname, 'projects.html'),
                pedagogical: resolve(__dirname, 'pedagogical.html'),
                skills: resolve(__dirname, 'skills.html'),
                contact: resolve(__dirname, 'contact.html'),
            },
        },
    },
    server: {
        port: 3000,
    }
});
