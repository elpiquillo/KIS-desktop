import path from 'path';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import checker from 'vite-plugin-checker';

// ----------------------------------------------------------------------

export default defineConfig({
  plugins: [
    react(),
    checker({
      typescript: true,
      eslint: {
        lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"', // Ensure eslint is configured correctly
      },
      overlay: {
        initialIsOpen: false,
      },
    }),
  ],
  base: './', // Ensure this base path fits your project structure
  resolve: {
    alias: [
      {
        find: /^~(.+)/,
        replacement: path.resolve('node_modules/$1'), // Use path.resolve for consistent results
      },
      {
        find: /^src(.+)/,
        replacement: path.resolve('src/$1'), // Use path.resolve for consistent results
      },
    ],
  },
  server: {
    port: 8081, // Ensure this port is not in use
  },
  preview: {
    port: 8081, // Ensure this port is not in use
  },
  test: {
    environment: 'jsdom', // Correct environment for testing with JSDOM
    globals: true, // Enable globals for tests
    setupFiles: 'src/tests/setup.ts', // Ensure the setup file exists
  }
});
