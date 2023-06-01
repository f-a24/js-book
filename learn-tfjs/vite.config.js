import { resolve } from 'path';
import { defineConfig } from 'vite';

const root = resolve(__dirname, 'src');

export default defineConfig({
  root,
  publicDir: resolve(__dirname, 'public'),
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: false,
    rollupOptions: {
      input: {
        '': resolve(root, 'index.html'),
        'chapter02/example': resolve(
          root,
          'chapter02',
          'example',
          'index.html'
        ),
        'chapter02/toxicity': resolve(
            root,
            'chapter02',
            'toxicity',
            'index.html'
          ),
          'chapter03/basics': resolve(
            root,
            'chapter03',
            'basics',
            'index.html'
          ),
          'chapter03/recommend': resolve(
            root,
            'chapter03',
            'recommend',
            'index.html'
          ),
      }
    }
}
});
