// frontend-new/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // You can customize the port if needed
  },
  // Add other configurations as needed
});
