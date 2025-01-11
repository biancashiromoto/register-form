import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './setupTests.ts',
    css: true,
    reporters: ['verbose'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules',
        'dist',
        'vite.config.ts',
        'vitest.config.ts',
        'eslint.config.cjs',
        '**/*.d.ts',
        'src/main.tsx',
        'src/**/spec/*.spec.tsx',
        'src/types/*.ts',
        'src/context/index.types.ts',
        'src/context/*',
        'src/tests/setup.ts',
      ],
    },
  },
});
