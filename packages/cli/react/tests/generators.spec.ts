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
  cdnGenerator,
  commonGenerator,
  componentGenerator,
  componentStoreGenerator,
  coreGenerator,
  docGenerator,
  hookGenerator,
  initGenerator,
  layoutGenerator,
  libraryGenerator,
  mockGenerator,
  reactLibraryGenerator,
  startGenerator,
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
      repository: { type: 'git', url: 'https://example.test/consumer' }
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

  it('renders app and Playwright templates with nested suite category paths', async () => {
    const tree = createWorkspace()
    await applicationGenerator(tree, {
      name: 'portal',
      directory: 'team',
      category: 'suite',
      cdnHost: 'cdn',
      strict: true
    })
    expect(readProjectConfiguration(tree, 'portal').root).toBe(
      'apps-suites/team/portal'
    )
    expect(
      readProjectConfiguration(tree, 'portal-e2e').implicitDependencies
    ).toEqual(['portal'])
    expect(readJson(tree, 'apps-suites/team/portal/package.json').name).toBe(
      'portal'
    )
    expect(tree.read('apps-suites/team/portal/vx.app.yaml', 'utf8')).toContain(
      'id: vezham-portal'
    )
    expect(tree.exists('apps-suites/team/portal-mock/project.json')).toBe(false)
    expect(
      generatedFiles(tree).some(file => file.includes('__template__'))
    ).toBe(false)
  })

  it('uses schema defaults and does not generate a mock backend', async () => {
    const tree = createWorkspace()
    await applicationGenerator(tree, { name: 'portal' })
    expect(readProjectConfiguration(tree, 'portal').root).toBe(
      'apps-internals/portal'
    )
    expect(tree.read('apps-internals/portal/vx.app.yaml', 'utf8')).toContain(
      'id: vezham-portal'
    )
    expect(tree.exists('apps-internals/portal-mock/project.json')).toBe(false)
  })

  it.each([
    { name: 'app', generator: applicationGenerator },
    { name: 'app-start', generator: startGenerator },
    { name: 'app-doc', generator: docGenerator },
    { name: 'mock', generator: mockGenerator }
  ])(
    'rejects the CDN category for $name before writing files',
    async ({ generator }) => {
      const tree = createWorkspace()
      const before = generatedFiles(tree)
      const options = { name: 'assets', category: 'cdn' } as const
      // @ts-expect-error Only app-cdn accepts the CDN category.
      const generation = generator(tree, options)
      await expect(generation).rejects.toThrow(
        'The "cdn" category is only available for the app-cdn generator.'
      )
      expect(generatedFiles(tree)).toEqual(before)
    }
  )

  it.each([
    { name: 'app', generator: applicationGenerator },
    { name: 'app-start', generator: startGenerator },
    { name: 'app-cdn', generator: cdnGenerator },
    { name: 'mock', generator: mockGenerator }
  ])(
    'rejects the docs category for $name before writing files',
    async ({ generator }) => {
      const tree = createWorkspace()
      const before = generatedFiles(tree)
      const options = { name: 'guide', category: 'doc' } as const
      // @ts-expect-error Only app-doc accepts the docs category.
      const generation = generator(tree, options)
      await expect(generation).rejects.toThrow(
        'The "doc" category is only available for the app-doc generator.'
      )
      expect(generatedFiles(tree)).toEqual(before)
    }
  )

  it('generates documentation applications and E2E projects in the docs category', async () => {
    const tree = createWorkspace()
    await docGenerator(tree, {
      name: 'guide',
      category: 'doc',
      skipSuffix: true
    })
    expect(readProjectConfiguration(tree, 'guide').root).toBe('apps-docs/guide')
    expect(readProjectConfiguration(tree, 'guide').tags).toContain(
      'category:doc'
    )
    expect(readProjectConfiguration(tree, 'guide-e2e').root).toBe(
      'apps-docs/guide-e2e'
    )
  })

  it('generates CDN applications and E2E projects in the CDN category', async () => {
    const tree = createWorkspace()
    await cdnGenerator(tree, { name: 'assets', category: 'cdn' })
    expect(readProjectConfiguration(tree, 'assets-cdn').root).toBe(
      'apps-cdns/assets-cdn'
    )
    expect(readProjectConfiguration(tree, 'assets-cdn').tags).toContain(
      'category:cdn'
    )
    expect(readProjectConfiguration(tree, 'assets-cdn-e2e').root).toBe(
      'apps-cdns/assets-cdn-e2e'
    )
  })

  it('generates a showcase mock project independently of the app', async () => {
    const tree = createWorkspace()
    await mockGenerator(tree, {
      name: 'portal',
      directory: 'team',
      category: 'showcase'
    })
    expect(readProjectConfiguration(tree, 'portal-mock').root).toBe(
      'apps-showcases/team/portal-mock'
    )
    expect(readProjectConfiguration(tree, 'portal-mock').tags).toEqual([
      'category:showcase',
      'mock'
    ])
    expect(
      readJson(tree, 'apps-showcases/team/portal-mock/package.json').name
    ).toBe('portal-mock')
    expect(tree.read('apps-showcases/team/portal-mock/.env', 'utf8')).toContain(
      'V_APP_ID=portal-mock'
    )
    expect(
      tree.read('apps-showcases/team/portal-mock/src/lib/config.ts', 'utf8')
    ).toContain('process.env.V_APP_ID')
    expect(
      generatedFiles(tree).some(file => file.includes('__template__'))
    ).toBe(false)
  })

  it.each([
    { type: 'app', generator: applicationGenerator, name: 'play-app' },
    { type: 'app-start', generator: startGenerator, name: 'play-start' },
    { type: 'app-doc', generator: docGenerator, name: 'play-docs' },
    { type: 'app-doc', generator: docGenerator, name: 'play-doc' },
    { type: 'app-cdn', generator: cdnGenerator, name: 'play-cdn' },
    { type: 'mock', generator: mockGenerator, name: 'play-mock' }
  ])(
    'preserves an existing role suffix for $type: $name',
    async ({ type, generator, name }) => {
      const tree = createWorkspace()
      await generator(tree, { name, category: 'app', directory: 'team' })
      const root = `apps/team/${name}`
      expect(readProjectConfiguration(tree, name).root).toBe(root)
      expect(readJson(tree, `${root}/package.json`).name).toBe(name)
      if (type === 'mock') {
        expect(tree.read(`${root}/.env`, 'utf8')).toContain(
          'HOST_NAME=play.mock.vezham.local'
        )
        expect(tree.read(`${root}/.env`, 'utf8')).toContain(`V_APP_ID=${name}`)
      } else {
        expect(readProjectConfiguration(tree, `${name}-e2e`).root).toBe(
          `${root}-e2e`
        )
        expect(readJson(tree, `${root}-e2e/package.json`).name).toBe(
          `${name}-e2e`
        )
      }
    }
  )

  it.each([
    {
      type: 'app-doc',
      generator: docGenerator,
      name: 'docs-center',
      expected: 'docs-center-docs'
    },
    {
      type: 'app-cdn',
      generator: cdnGenerator,
      name: 'cdn-center',
      expected: 'cdn-center-cdn'
    },
    {
      type: 'mock',
      generator: mockGenerator,
      name: 'mock-center',
      expected: 'mock-center-mock'
    }
  ])(
    'adds the missing $type suffix only at the end',
    async ({ type, generator, name, expected }) => {
      const tree = createWorkspace()
      await generator(tree, { name, category: 'app', directory: 'team' })
      const root = `apps/team/${expected}`
      expect(readProjectConfiguration(tree, expected).root).toBe(root)
      expect(readJson(tree, `${root}/package.json`).name).toBe(expected)
      if (type !== 'mock') {
        expect(tree.read(`${root}/vx.app.yaml`, 'utf8')).toContain(
          `id: vezham-${expected}`
        )
        expect(tree.read(`${root}/.env`, 'utf8')).toContain(
          `V_APP_ID=vezham-${expected}`
        )
        expect(
          readProjectConfiguration(tree, `${expected}-e2e`).implicitDependencies
        ).toEqual([expected])
      }
    }
  )

  it.each([
    { type: 'app', generator: applicationGenerator },
    { type: 'app-start', generator: startGenerator },
    { type: 'app-doc', generator: docGenerator },
    { type: 'app-cdn', generator: cdnGenerator },
    { type: 'mock', generator: mockGenerator }
  ])(
    'lets $type keep any standalone name with skipSuffix',
    async ({ type, generator }) => {
      const tree = createWorkspace()
      await generator(tree, {
        name: 'Landing Site',
        category: 'app',
        skipSuffix: true
      })
      const root = 'apps/landing-site'
      expect(readProjectConfiguration(tree, 'landing-site').root).toBe(root)
      expect(readJson(tree, `${root}/package.json`).name).toBe('landing-site')
      if (type !== 'mock') {
        expect(readProjectConfiguration(tree, 'landing-site-e2e').root).toBe(
          `${root}-e2e`
        )
        expect(readJson(tree, `${root}-e2e/package.json`).name).toBe(
          'landing-site-e2e'
        )
      }
    }
  )

  it.each(['home', 'knowledge-base', 'company-docs'])(
    'creates a standalone documentation site named %s in its own group',
    async name => {
      const tree = createWorkspace()
      await docGenerator(tree, { name, category: 'doc', skipSuffix: true })
      const root = `apps-docs/${name}`
      expect(readProjectConfiguration(tree, name).root).toBe(root)
      expect(readJson(tree, `${root}/package.json`).name).toBe(name)
      expect(readProjectConfiguration(tree, `${name}-e2e`).root).toBe(
        `${root}-e2e`
      )
    }
  )

  it('normalizes names before checking for a role suffix', async () => {
    const tree = createWorkspace()
    await cdnGenerator(tree, { name: 'Play CDN', category: 'cdn' })
    expect(readProjectConfiguration(tree, 'play-cdn').root).toBe(
      'apps-cdns/play-cdn'
    )
    expect(tree.read('apps-cdns/play-cdn/vx.app.yaml', 'utf8')).toContain(
      'name: Vezham Play CDN'
    )
  })

  it('creates a complete product group with matching folders, project names, and manifests', async () => {
    const tree = createWorkspace()
    await startGenerator(tree, { name: 'school-os', category: 'app' })
    await docGenerator(tree, { name: 'school-os-docs', category: 'app' })
    await cdnGenerator(tree, { name: 'school-os-cdn', category: 'cdn' })
    await applicationGenerator(tree, {
      name: 'school-os-widget',
      category: 'widget'
    })

    for (const root of [
      'apps/school-os',
      'apps/school-os-docs',
      'apps-cdns/school-os-cdn',
      'apps-widgets/school-os-widget'
    ]) {
      const name = root.slice(root.lastIndexOf('/') + 1)
      expect(readProjectConfiguration(tree, name).root).toBe(root)
      expect(readJson(tree, `${root}/package.json`).name).toBe(name)
      expect(readProjectConfiguration(tree, `${name}-e2e`).root).toBe(
        `${root}-e2e`
      )
      expect(
        readProjectConfiguration(tree, `${name}-e2e`).implicitDependencies
      ).toEqual([name])
      expect(readJson(tree, `${root}-e2e/package.json`).name).toBe(
        `${name}-e2e`
      )
    }
  })

  it.each([
    { type: 'docs', generator: docGenerator, name: 'school-os-docs' },
    { type: 'cdn', generator: cdnGenerator, name: 'school-os-cdn' }
  ])(
    'lets $type applications use the base app group',
    async ({ generator, name }) => {
      const tree = createWorkspace()
      await generator(tree, { name, category: 'app' })
      expect(readProjectConfiguration(tree, name).root).toBe(`apps/${name}`)
      expect(readProjectConfiguration(tree, name).tags).toContain(
        'category:app'
      )
      expect(readJson(tree, `apps/${name}/package.json`).name).toBe(name)
    }
  )

  it.each(['school-os-docs', 'school-os-docs-e2e'])(
    'rejects an existing project named %s in another category before writing files',
    async existingName => {
      const tree = createWorkspace()
      const root = `apps/${existingName}`
      tree.write(`${root}/project.json`, JSON.stringify({ name: existingName }))
      const before = tree.listChanges()
      await expect(
        docGenerator(tree, { name: 'school-os-docs', category: 'doc' })
      ).rejects.toThrow(
        `Project "${existingName}" already exists at "${root}".`
      )
      expect(tree.listChanges()).toEqual(before)
    }
  )

  it('rejects a name already used by a workspace package without a project manifest', async () => {
    const tree = createWorkspace()
    tree.write('package.json', JSON.stringify({ workspaces: ['packages/*'] }))
    tree.write(
      'packages/shared/package.json',
      JSON.stringify({ name: 'school-os-docs' })
    )
    const before = tree.listChanges()
    await expect(
      docGenerator(tree, { name: 'school-os-docs', category: 'doc' })
    ).rejects.toThrow(
      'Project "school-os-docs" already exists at "packages/shared".'
    )
    expect(tree.listChanges()).toEqual(before)
  })

  it('rejects mock names already used in another category', async () => {
    const tree = createWorkspace()
    await mockGenerator(tree, { name: 'school-os', category: 'app' })
    const before = tree.listChanges()
    await expect(
      mockGenerator(tree, { name: 'school-os-mock', category: 'internal' })
    ).rejects.toThrow(
      'Project "school-os-mock" already exists at "apps/school-os-mock".'
    )
    expect(tree.listChanges()).toEqual(before)
  })

  it('keeps existing output files intact when the project name is unused', async () => {
    const tree = createWorkspace()
    tree.write('apps/school-os-docs/README.md', 'Existing content')
    const before = tree.listChanges()
    await expect(
      docGenerator(tree, { name: 'school-os-docs', category: 'app' })
    ).rejects.toThrow('The output path "apps/school-os-docs" already exists.')
    expect(tree.listChanges()).toEqual(before)
  })

  it('applies the same duplicate-name check to library projects', async () => {
    const tree = createWorkspace()
    await libraryGenerator(tree, { name: 'helpers' })
    const before = tree.listChanges()
    await expect(
      reactLibraryGenerator(tree, {
        name: 'helpers',
        directory: 'packages/ui/helpers'
      })
    ).rejects.toThrow('Project "helpers" already exists at "packages/helpers".')
    expect(tree.listChanges()).toEqual(before)
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
      url: 'git+https://example.test/consumer.git',
      directory: 'packages/helpers'
    })
    expect(tree.read('packages/helpers/vite.config.ts', 'utf8')).toContain(
      "from '@vezham/config/vite-lib'"
    )
    expect(tree.read('packages/helpers/vitest.config.ts', 'utf8')).toContain(
      "from '@vezham/config/vitest'"
    )
    expect(
      readJson(tree, 'packages/helpers/tsconfig.lib.json').references
    ).toEqual([])
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
    expect(tree.read('packages/button/vite.config.ts', 'utf8')).toContain(
      "from '@vezham/config/vite-lib/react'"
    )
    expect(tree.read('packages/button/vitest.config.ts', 'utf8')).toContain(
      "from '@vezham/config/vitest/react'"
    )
    expect(
      readJson(tree, 'packages/button/tsconfig.lib.json').references
    ).toEqual([])
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
        `The ${name} generator has no committed templates yet`
      )
      expect(generatedFiles(tree)).toEqual(before)
    }
  )
})
