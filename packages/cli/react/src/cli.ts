#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'

const require = createRequire(import.meta.url)
const [generator, ...options] = process.argv.slice(2)

if (!generator || ['--help', '-h'].includes(generator)) {
  let manifest: unknown
  try {
    manifest = JSON.parse(
      readFileSync(path.join(import.meta.dirname, '../generators.json'), 'utf8')
    )
  } catch (cause) {
    throw new Error('Could not parse the React generator collection.', {
      cause
    })
  }
  if (
    typeof manifest !== 'object' ||
    manifest === null ||
    !('generators' in manifest) ||
    typeof manifest.generators !== 'object' ||
    manifest.generators === null ||
    Array.isArray(manifest.generators)
  ) {
    throw new Error(
      'The React generator collection must define a generators object.'
    )
  }
  const generators = manifest.generators as Record<
    string,
    { aliases?: string[]; description: string }
  >
  const preferredOrder = [
    'application',
    'app-cdn',
    'app-doc',
    'app-start',
    'mock',
    'library',
    'library-react',
    'init'
  ]
  const entries = Object.entries(generators).sort(([left], [right]) => {
    const leftIndex = preferredOrder.indexOf(left)
    const rightIndex = preferredOrder.indexOf(right)
    return (
      (leftIndex < 0 ? preferredOrder.length : leftIndex) -
      (rightIndex < 0 ? preferredOrder.length : rightIndex)
    )
  })
  const nameWidth = Math.max(...entries.map(([name]) => name.length)) + 3
  const aliasWidth =
    Math.max(...entries.map(([, info]) => (info.aliases?.[0] ?? '').length)) + 3
  const list = entries
    .map(([name, info]) => {
      const alias = info.aliases?.[0] ?? ''
      return `  ${name.padEnd(nameWidth)}${alias.padEnd(aliasWidth)}${info.description}`
    })
    .join('\n')

  console.log(`
🚀 Vx CLI - React Generators

Usage:
  pnpx @vx-cli/react <generator> [options]

Available Generators:
${list}

Examples:
  pnpx @vx-cli/react init
  pnpx @vx-cli/react app my-app
  pnpx @vx-cli/react mock my-app --category=internal
  pnpx @vx-cli/react lib my-utils --publishable
  pnpx @vx-cli/react react-lib my-components --publishable`)
} else {
  const result = spawnSync(
    process.execPath,
    [
      require.resolve('nx/bin/nx.js'),
      'generate',
      `@vx-cli/react:${generator}`,
      ...options
    ],
    { stdio: 'inherit' }
  )
  if (result.error) throw result.error
  process.exitCode = result.status ?? 1
}
