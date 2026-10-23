import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    root: './',
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                pedagogical: resolve(__dirname, 'pedagogical.html'),
            },
        },
    },
    server: {
        port: 3000,
    }
});
