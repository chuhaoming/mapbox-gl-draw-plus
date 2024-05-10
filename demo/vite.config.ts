import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { join, resolve } from 'node:path';
import unocss from 'unocss/vite';

export default defineConfig({
  plugins: [
    vue(),
  ],
  server: { port: 3333 },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: join(__dirname, 'src'),
      },
      {
        find: /^@chmpr\/(.+)$/,
        replacement: join(__dirname, '..', 'packages', '$1', 'src'),
      },
    ],
  },
});
