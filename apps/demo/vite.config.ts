import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react-swc'
import { nitro } from 'nitro/vite'

import { defineConfig, getPrerenderPages } from '@vezham/config/presets/app'

export default defineConfig({
  root: __dirname,
  ssr: { noExternal: ['@vezham/start', '@vezham/env'] },
  plugins: [
    nitro({ rollupConfig: { external: [/^@sentry\//] } }),
    tailwindcss(),
    tanstackStart({
      spa: {
        enabled: true,
        prerender: {
          enabled: true,
          crawlLinks: true
        }
      },
      pages: getPrerenderPages(__dirname)
    }),
    react()
  ]
})
