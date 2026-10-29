import { nxReadySignal } from '@nx/vite/plugins/nx-ready-signal.plugin'
import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import path from 'node:path'

import {
  defineConfig,
  docsMdx,
  getPrerenderPages
} from '@vezham/config/presets/docs'
import story from '@vezham/docs-story/vite'

export default defineConfig({
  root: import.meta.dirname,
  plugins: [
    docsMdx(),
    nitro({ rollupConfig: { external: [/^@sentry\//] } }),
    story({
      tsconfigPath: path.join(import.meta.dirname, 'tsconfig.app.json')
    }),
    tanstackStart({
      spa: {
        enabled: true,
        // wjdlz/NOTE: Tanstack Router will automatically crawl your pages
        prerender: {
          enabled: true,
          crawlLinks: true
        }
      },
      pages: getPrerenderPages(import.meta.dirname)
    }),
    tailwindcss(),
    react(),
    nxReadySignal()
  ]
})
