import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const htmlPages = Object.fromEntries(
  readdirSync(process.cwd())
    .filter((file) => file.endsWith('.html'))
    .map((file) => [file.slice(0, -5), resolve(process.cwd(), file)]),
);

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  build: {
    rollupOptions: {
      input: htmlPages,
    },
  },
});
