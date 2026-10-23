/// <reference types='vitest' />
import react from '@vitejs/plugin-react-swc'

import { defineConfig } from '@vezham/config/vitest'

export default defineConfig({
  root: __dirname,
  plugins: [react()]
})
