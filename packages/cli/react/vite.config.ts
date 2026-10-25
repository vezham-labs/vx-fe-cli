import { copyFileSync, mkdirSync, readdirSync } from 'node:fs'
import path from 'node:path'
import dts from 'vite-plugin-dts'

import { defineConfig } from '@vezham/config/vite-lib'

const root = import.meta.dirname

const copyGeneratorAssets = () => ({
  name: 'vx-cli:generator-assets',
  closeBundle() {
    const sourceRoot = path.join(root, 'src')
    const outputRoot = path.join(root, 'dist')

    const copyDirectory = (directory: string) => {
      for (const entry of readdirSync(directory, { withFileTypes: true })) {
        const source = path.join(directory, entry.name)
        if (entry.isDirectory()) {
          copyDirectory(source)
          continue
        }

        if (/\.(?:ts|tsx)$/.test(entry.name) && !entry.name.endsWith('.d.ts')) {
          continue
        }

        if (/\.(?:html|css)$/.test(entry.name)) continue

        const destination = path.join(
          outputRoot,
          path.relative(sourceRoot, source)
        )
        mkdirSync(path.dirname(destination), { recursive: true })
        copyFileSync(source, destination)
      }
    }

    copyDirectory(sourceRoot)
  }
})

export default defineConfig({
  root,
  plugins: [
    dts({
      entryRoot: path.join(root, 'src'),
      outDir: path.join(root, 'dist'),
      rollupTypes: true,
      tsconfigPath: path.join(root, 'tsconfig.lib.json')
    }),
    copyGeneratorAssets()
  ]
})
