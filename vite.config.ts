/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  define: {
    'process.env.VITE_PROJECT_URL': JSON.stringify(
      process.env.VITE_PROJECT_URL,
    ),
    'process.env.VITE_SUPABASE_KEY': JSON.stringify(
      process.env.VITE_SUPABASE_KEY,
    ),
  },
});
