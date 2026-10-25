import {
  type Tree,
  readJson,
  readNxJson,
  readProjectConfiguration,
  updateNxJson
} from '@nx/devkit'
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  applicationGenerator,
  commonGenerator,
  componentGenerator,
  componentStoreGenerator,
  coreGenerator,
  hookGenerator,
  initGenerator,
  layoutGenerator,
  libraryGenerator,
  reactLibraryGenerator,
  templateGenerator,
  utilitiesGenerator
} from '../src/index'

const createWorkspace = () => {
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
  return tree
}

const generatedFiles = (tree: Tree) =>
  tree.listChanges().map(change => change.path)

// vx-bot/NOTE: In-memory generation tests have no on-disk formatter workspace.
beforeEach(() => vi.stubEnv('NX_SKIP_FORMAT', 'true'))
afterEach(() => vi.unstubAllEnvs())

describe('legacy generator baseline', () => {
  it('initializes defaults idempotently without registering a task-inference plugin', async () => {
    const tree = createWorkspace()
    updateNxJson(tree, {
      plugins: ['@nx/vite/plugin'],
      generators: { '@vx-cli/react:application': { cdnHost: 'self' } }
    })
    await initGenerator(tree)
    const initialized = readNxJson(tree)
    await initGenerator(tree)
    expect(readNxJson(tree)).toEqual(initialized)
    expect(initialized?.plugins).toEqual(['@nx/vite/plugin'])
    expect(
      initialized?.generators?.['@vx-cli/react:application']
    ).toMatchObject({
      category: 'app',
      cdnHost: 'self',
      strict: true
    })
    expect(initialized?.generators?.['@nx/react:application']).toBeUndefined()
  })

  it('allows init to leave existing generator defaults unchanged', async () => {
    const tree = createWorkspace()
    const before = readNxJson(tree)
    await initGenerator(tree, { overrideDefaults: false })
    expect(readNxJson(tree)).toEqual(before)
  })

  it('renders the app, Playwright, and mock templates with nested category paths', async () => {
    const tree = createWorkspace()
    await applicationGenerator(tree, {
      name: 'portal',
      directory: 'team',
      category: 'internal',
      cdnHost: 'cdn',
      mockServer: true,
      strict: true
    })
    expect(readProjectConfiguration(tree, 'team-portal').root).toBe(
      'apps_internals/team/portal'
    )
    expect(
      readProjectConfiguration(tree, 'team-portal-e2e').implicitDependencies
    ).toEqual(['team-portal'])
    expect(readProjectConfiguration(tree, 'team-portal-mock').root).toBe(
      'apps_internals/team/portal-mock'
    )
    expect(readJson(tree, 'apps_internals/team/portal/package.json').name).toBe(
      'team-portal'
    )
    expect(
      tree.read('apps_internals/team/portal/index.html', 'utf8')
    ).toContain('TeamPortal')
    expect(
      generatedFiles(tree).some(file => file.includes('__template__'))
    ).toBe(false)
  })

  it('uses schema defaults for direct app calls and can omit the mock backend', async () => {
    const tree = createWorkspace()
    await applicationGenerator(tree, { name: 'portal', mockServer: false })
    expect(readProjectConfiguration(tree, 'portal').root).toBe(
      'apps_internals/portal'
    )
    expect(tree.read('apps_internals/portal/index.html', 'utf8')).toContain(
      'https://static.cdn.vezham.com/apps_internals/portal'
    )
    expect(tree.exists('apps_internals/portal-mock/project.json')).toBe(false)
  })

  it('generates a plain package at packages/<name> by default', async () => {
    const tree = createWorkspace()
    await libraryGenerator(tree, { name: 'helpers' })
    expect(readProjectConfiguration(tree, 'helpers').root).toBe(
      'packages/helpers'
    )
    expect(readJson(tree, 'packages/helpers/package.json').name).toBe(
      '@vezham/helpers'
    )
    expect(readJson(tree, 'packages/helpers/package.json').private).toBe(true)
    expect(readJson(tree, 'packages/helpers/package.json').repository).toEqual({
      type: 'git',
      url: 'https://example.test/consumer.git',
      directory: 'packages/helpers'
    })
    expect(tree.exists('packages/helpers/src/lib/helpers.ts')).toBe(true)
    expect(tree.exists('packages/helpers/src/lib/helpers.spec.ts')).toBe(true)
    expect(
      generatedFiles(tree).some(file => file.includes('__template__'))
    ).toBe(false)
  })

  it('lets a plain package use a workspace-relative directory override', async () => {
    const tree = createWorkspace()
    await libraryGenerator(tree, { name: 'helpers', directory: 'libs/shared' })
    expect(readProjectConfiguration(tree, 'helpers').root).toBe('libs/shared')
    expect(tree.exists('libs/shared/src/lib/helpers.ts')).toBe(true)
  })

  it('omits private for a publishable plain package', async () => {
    const tree = createWorkspace()
    await libraryGenerator(tree, { name: 'helpers', publishable: true })
    expect(readJson(tree, 'packages/helpers/package.json')).not.toHaveProperty(
      'private'
    )
  })

  it('generates a React package at packages/<name> by default', async () => {
    const tree = createWorkspace()
    await reactLibraryGenerator(tree, { name: 'button' })
    expect(readProjectConfiguration(tree, 'button').root).toBe(
      'packages/button'
    )
    expect(readJson(tree, 'packages/button/package.json').name).toBe(
      '@vezham/button'
    )
    expect(readJson(tree, 'packages/button/package.json').private).toBe(true)
    expect(tree.exists('packages/button/src/lib/button.tsx')).toBe(true)
    expect(tree.exists('packages/button/src/lib/button.spec.tsx')).toBe(true)
  })

  it('omits private for a publishable React package', async () => {
    const tree = createWorkspace()
    await reactLibraryGenerator(tree, { name: 'button', publishable: true })
    expect(readJson(tree, 'packages/button/package.json')).not.toHaveProperty(
      'private'
    )
  })

  it('rejects output directories outside the workspace', async () => {
    const tree = createWorkspace()
    await expect(
      libraryGenerator(tree, { name: 'helpers', directory: '../outside' })
    ).rejects.toThrow('The output directory must stay within the workspace.')
  })

  const missingTemplates = {
    common: commonGenerator,
    component: componentGenerator,
    'component-store': componentStoreGenerator,
    core: coreGenerator,
    hook: hookGenerator,
    layout: layoutGenerator,
    template: templateGenerator,
    utilities: utilitiesGenerator
  }

  it.each(Object.entries(missingTemplates))(
    'reports the missing legacy %s templates before writing files',
    async (name, generator) => {
      const tree = createWorkspace()
      const before = generatedFiles(tree)
      await expect(generator(tree, { name: 'example' })).rejects.toThrow(
        `The legacy ${name} generator has no committed templates`
      )
      expect(generatedFiles(tree)).toEqual(before)
    }
  )
})
