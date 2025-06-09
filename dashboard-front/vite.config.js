import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import path from 'path';

export default defineConfig({
  plugins: [
    react({
      babel: {
        presets: [
          ['@babel/preset-react', { runtime: 'automatic' }]
        ],
        overrides: [
          {
            test: /\.js$/,
            presets: [
              ['@babel/preset-react', { runtime: 'automatic' }]
            ]
          }
        ]
      }
    }),
  ],
  resolve: {
    alias: {
      // This maps any import beginning with these paths to the corresponding directory under src
      'components': path.resolve(__dirname, './src/components'),
      'layouts': path.resolve(__dirname, './src/layouts'),
      'views': path.resolve(__dirname, './src/views'),
      'assets': path.resolve(__dirname, './src/assets'),
      'theme': path.resolve(__dirname, './src/theme'),
      'contexts': path.resolve(__dirname, './src/contexts'),
      // This was overriding all your other aliases
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  // Ensure proper JavaScript parsing
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.[jt]sx?$/,
    exclude: [],
  },
  server: {
    open: false,
    port: 3000, // Set the port to 3000
  },
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
});