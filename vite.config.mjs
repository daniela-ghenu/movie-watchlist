import { defineConfig } from 'vite';
import { resolve } from 'path';
import handlebars from 'vite-plugin-handlebars';

// Import data from external files
import indexData from './src/data/indexData';
import watchlistData from './src/data/watchlistData';

const pageData = {
  '/index.html': indexData,
  '/watchlist.html': watchlistData
};

export default defineConfig({
  // Plugins configurations
  plugins: [
    handlebars({
      helpers: {
        eq: (a, b) => a === b
      },
      partialDirectory: [
        resolve(__dirname, './src/templates'),
        resolve(__dirname, './src/templates/partials'),
      ],
      context(pagePath) {
        return pageData[pagePath];
      }
    })
  ],
  // Build configurations
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        watchlist: resolve(__dirname, 'watchlist.html')
      }
    }
  }
});
