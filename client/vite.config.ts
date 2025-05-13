import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Load environment variables
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE'); // Load .env variables prefixed with VITE_

  return {
    define: {
      'process.env': { ...process.env, ...env }, // Merge Vite environment variables
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      origin: '127.0.0.1',
      port: parseInt(env.VITE_PORT) || 5173, // Use VITE_PORT or default to 5173
      proxy: {
        '/assets': {
          target: 'http://localhost:4500',
          changeOrigin: true,
        },
      },
    },
  };
});
