import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
  },
  outDir: 'dist',
  format: ['esm', 'cjs'],
  target: 'es2017',
  clean: true,
})
