import { execFileSync, spawnSync } from 'node:child_process'
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync
} from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi
} from 'vitest'
import { parse as parseYaml } from 'yaml'

const packageRoot = path.resolve(import.meta.dirname, '..')
const temporaryRoot = mkdtempSync(path.join(tmpdir(), 'vx-cli-react-package-'))
const installedRoot = path.join(temporaryRoot, 'node_modules/@vx-cli/react')
const readJson = (file: string) => JSON.parse(readFileSync(file, 'utf8'))

beforeAll(() => {
  execFileSync('pnpm', ['pack', '--pack-destination', temporaryRoot], {
    cwd: packageRoot,
    stdio: 'pipe'
  })
  const tarballs = readdirSync(temporaryRoot).filter(file =>
    file.endsWith('.tgz')
  )
  expect(tarballs).toHaveLength(1)
  mkdirSync(installedRoot, { recursive: true })
  const require = createRequire(path.join(packageRoot, 'package.json'))
  const dependencies = readJson(
    path.join(packageRoot, 'package.json')
  ).dependencies
  for (const name of Object.keys(dependencies)) {
    const target = path.join(temporaryRoot, 'node_modules', name)
    mkdirSync(path.dirname(target), { recursive: true })
    symlinkSync(
      path.dirname(require.resolve(`${name}/package.json`)),
      target,
      'dir'
    )
  }
  symlinkSync(
    path.dirname(require.resolve('nx/package.json')),
    path.join(temporaryRoot, 'node_modules/nx'),
    'dir'
  )
  execFileSync('tar', [
    '-xzf',
    path.join(temporaryRoot, tarballs[0]),
    '--strip-components=1',
    '-C',
    installedRoot
  ])
}, 30000)

afterAll(() => rmSync(temporaryRoot, { recursive: true, force: true }))

beforeEach(() => vi.stubEnv('NX_SKIP_FORMAT', 'true'))
afterEach(() => vi.unstubAllEnvs())

describe('published Nx plugin', () => {
  it('loads the packed entry through Node package resolution outside the workspace', async () => {
    const require = createRequire(path.join(temporaryRoot, 'package.json'))
    const packageName: string = readJson(
      path.join(installedRoot, 'package.json')
    ).name
    expect(typeof require(packageName)).toBe('object')
    const entry = require.resolve(packageName)
    expect(entry.startsWith(realpathSync(installedRoot) + path.sep)).toBe(true)
    expect(await import(pathToFileURL(entry).href)).toBeDefined()
    const manifest = require(`${packageName}/package.json`)
    expect(existsSync(path.join(installedRoot, manifest.types))).toBe(true)
  })

  it('ships Nx collection metadata and every registered factory and schema', () => {
    const manifest = readJson(path.join(installedRoot, 'package.json'))
    for (const key of ['generators', 'executors']) {
      const collection = readJson(path.join(installedRoot, manifest[key]))
      expect(collection[key]).toBeTypeOf('object')
      for (const registration of Object.values(collection[key]) as Array<{
        factory?: string
        implementation?: string
        schema: string
      }>) {
        const factory = registration.factory ?? registration.implementation
        if (!factory) throw new Error('Nx registration is missing its factory')
        const entry = factory.split('#')[0]
        expect(
          existsSync(
            path.join(installedRoot, entry + (path.extname(entry) ? '' : '.js'))
          )
        ).toBe(true)
        expect(existsSync(path.join(installedRoot, registration.schema))).toBe(
          true
        )
      }
    }
  })

  it('ships renderable app and library templates and an executable CLI', async () => {
    const require = createRequire(path.join(temporaryRoot, 'package.json'))
    const { createTreeWithEmptyWorkspace } = require('@nx/devkit/testing')
    const { updateNxJson } = require('@nx/devkit')
    const {
      applicationGenerator,
      libraryGenerator,
      mockGenerator,
      reactLibraryGenerator
    } = require(readJson(path.join(installedRoot, 'package.json')).name)
    const tree = createTreeWithEmptyWorkspace()
    updateNxJson(tree, {
      workspaceLayout: { appsDir: 'apps', libsDir: 'packages' }
    })
    tree.write(
      'package.json',
      JSON.stringify({
        repository: { type: 'git', url: 'https://example.test/consumer.git' }
      })
    )
    tree.write('tsconfig.base.json', JSON.stringify({ compilerOptions: {} }))
    await applicationGenerator(tree, {
      name: 'packed-app',
      category: 'app',
      strict: true,
      cdnHost: 'self'
    })
    await mockGenerator(tree, { name: 'packed-app', category: 'app' })
    await libraryGenerator(tree, { name: 'packed-lib' })
    await reactLibraryGenerator(tree, { name: 'packed-react-lib' })
    const reactLibraryPackageJson = tree.read(
      'packages/packed-react-lib/package.json',
      'utf8'
    )
    if (!reactLibraryPackageJson) {
      throw new Error('Expected the generated React library package.json.')
    }
    expect(JSON.parse(reactLibraryPackageJson).repository.url).toBe(
      'https://example.test/consumer.git'
    )
    expect(tree.exists('apps/packed-app/src/app/shell.tsx')).toBe(true)
    expect(tree.exists('apps/packed-app-mock/project.json')).toBe(true)
    expect(tree.exists('packages/packed-lib/src/lib/packed-lib.ts')).toBe(true)
    expect(tree.exists('packages/packed-lib/src/lib/packed-lib.spec.ts')).toBe(
      true
    )
    expect(
      tree.exists('packages/packed-react-lib/src/lib/packed-react-lib.tsx')
    ).toBe(true)
    const manifest = readJson(path.join(installedRoot, 'package.json'))
    const help = execFileSync(
      process.execPath,
      [path.join(installedRoot, manifest.bin['vx-react']), '--help'],
      { encoding: 'utf8' }
    )
    expect(help).toContain('Vx CLI - React Generators')
    expect(help).toContain('pnpx @vx-cli/react <generator> [options]')
    expect(help).toMatch(/application\s+app\s+Create a React application/)
    expect(help).toContain('app-cdn')
    expect(help).toContain('app-doc')
    expect(help).toContain('app-start')
    expect(help).toMatch(/library\s+lib\s+Create a TypeScript library package/)
    expect(help).toContain('init')
    expect(help).toContain('Examples:')
    expect(help).toContain('pnpx @vx-cli/react app my-app')
    expect(help).toContain('pnpx @vx-cli/react lib my-utils --publishable')
    expect(help).toContain(
      'pnpx @vx-cli/react react-lib my-components --publishable'
    )
  }, 30000)

  it('seeds every app type from the installed CLI manifest after a version change', async () => {
    const require = createRequire(path.join(temporaryRoot, 'package.json'))
    const { createTreeWithEmptyWorkspace } = require('@nx/devkit/testing')
    const manifestPath = path.join(installedRoot, 'package.json')
    const originalManifest = readFileSync(manifestPath, 'utf8')
    const manifest = JSON.parse(originalManifest)
    const generators = require(manifest.name)
    const version = '99.0.0-test.42'

    try {
      writeFileSync(manifestPath, JSON.stringify({ ...manifest, version }))
      for (const generator of [
        generators.applicationGenerator,
        generators.startGenerator,
        generators.cdnGenerator,
        generators.docGenerator
      ]) {
        const tree = createTreeWithEmptyWorkspace()
        tree.write(
          'package.json',
          JSON.stringify({ name: 'consumer', version: '0.0.1', private: true })
        )
        tree.write(
          'tsconfig.base.json',
          JSON.stringify({ compilerOptions: {} })
        )
        await generator(tree, { name: 'versioned-app', category: 'app' })
        const appRoot = 'apps/versioned-app'
        expect(
          JSON.parse(tree.read(`${appRoot}/package.json`, 'utf8') ?? '{}')
            .version
        ).toBe(version)
        expect(
          JSON.parse(tree.read(`${appRoot}-e2e/package.json`, 'utf8') ?? '{}')
            .version
        ).toBe(version)
        expect(
          parseYaml(tree.read(`${appRoot}/vx.app.yaml`, 'utf8') ?? '').core
            .version
        ).toBe(version)
        expect(tree.read(`${appRoot}/.env`, 'utf8')).toContain(
          `V_APP_VER=${version}`
        )
        if (generator === generators.cdnGenerator) {
          const html = tree.read(`${appRoot}/index.html`, 'utf8')
          expect(html).toContain(`?vx=${version}`)
          expect(html).not.toContain('?vx=0.0.0')
        }
      }
    } finally {
      writeFileSync(manifestPath, originalManifest)
    }
  })

  it('exposes usable declarations to a NodeNext TypeScript consumer', () => {
    const require = createRequire(path.join(packageRoot, 'package.json'))
    const consumer = path.join(temporaryRoot, 'consumer.mts')
    writeFileSync(
      consumer,
      `import { applicationGenerator, libraryGenerator, reactLibraryGenerator } from '@vx-cli/react'
const appOptions: Parameters<typeof applicationGenerator>[1] = { name: 'typed-app' }
const libOptions: Parameters<typeof libraryGenerator>[1] = { name: 'typed-lib' }
const reactLibOptions: Parameters<typeof reactLibraryGenerator>[1] = { name: 'typed-react-lib' }
void appOptions
void libOptions
void reactLibOptions
`
    )
    const result = spawnSync(
      process.execPath,
      [
        require.resolve('typescript/lib/tsc.js'),
        consumer,
        '--noEmit',
        '--strict',
        '--skipLibCheck',
        '--module',
        'NodeNext',
        '--moduleResolution',
        'NodeNext',
        '--target',
        'es2022',
        '--types',
        'node',
        '--typeRoots',
        path.dirname(path.dirname(require.resolve('@types/node/package.json')))
      ],
      { cwd: temporaryRoot, encoding: 'utf8' }
    )
    expect(result.status, result.stdout + result.stderr).toBe(0)
  }, 30000)

  it('ships documentation and license without workspace source or compiler state', () => {
    for (const file of ['README.md', 'LICENSE']) {
      expect(existsSync(path.join(installedRoot, file))).toBe(true)
    }
    expect(existsSync(path.join(installedRoot, 'src'))).toBe(false)
    expect(existsSync(path.join(installedRoot, 'tests'))).toBe(false)
    expect(
      existsSync(path.join(installedRoot, 'dist/tsconfig.lib.tsbuildinfo'))
    ).toBe(false)
  })
})
