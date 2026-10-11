import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import path from 'node:path'

import story from '@vezham/docs-story/vite'

import {
  defineConfig,
  docsMdx,
  getPrerenderPages
} from '@vx/config/presets/docs'

export default defineConfig({
  root: __dirname,
  plugins: [
    docsMdx(),
    nitro({ rollupConfig: { external: [/^@sentry\//] } }),
    tailwindcss(),
    story({
      tsconfigPath: path.join(__dirname, 'tsconfig.app.json')
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
      pages: getPrerenderPages(__dirname)
    }),
    react()
  ]
})
