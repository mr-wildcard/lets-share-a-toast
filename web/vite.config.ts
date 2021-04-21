import { join, resolve } from 'path';
import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  resolve: {
    alias: {
      '@shared': resolve(__dirname, '..', 'shared', 'index.ts'),
      '@web': resolve(__dirname, 'src'),
    },
  },
});
