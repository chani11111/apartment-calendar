import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// נתיבים יחסיים: האתר עובד גם בתת-תיקייה (GitHub Pages: /apartment-calendar/)
export default defineConfig({ base: './', plugins: [react()] });
