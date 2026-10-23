import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react-swc'

import { defineConfig } from '@vezham/config/presets/cdn'

export default defineConfig({
  root: __dirname,
  ssr: { noExternal: ['@vezham/start', '@vezham/env'] },
  plugins: [
    tanstackRouter({ target: 'react', autoCodeSplitting: true }),
    react(),
    tailwindcss()
  ]
})
