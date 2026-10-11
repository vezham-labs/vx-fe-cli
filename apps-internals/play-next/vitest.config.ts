/// <reference types='vitest' />
import react from '@vitejs/plugin-react-swc'

import { defineConfig } from '@vx/config/vitest'

export default defineConfig({
  root: __dirname,
  plugins: [react()]
})
