import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  const isWpBuild = process.env.WP_BUILD === 'true';

  return {
    base: isWpBuild ? './' : '/',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: isWpBuild
      ? {
          outDir: 'dist-wp',
          emptyOutDir: true,
          rollupOptions: {
            output: {
              entryFileNames: 'assets/iramo-lms.js',
              chunkFileNames: 'assets/[name].js',
              assetFileNames: (assetInfo) => {
                if (assetInfo.name && assetInfo.name.endsWith('.css')) {
                  return 'assets/iramo-lms.css';
                }
                return 'assets/[name][extname]';
              },
            },
          },
        }
      : undefined,
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
