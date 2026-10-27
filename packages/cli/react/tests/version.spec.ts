import { type Tree, readJson, readJsonFile, updateNxJson } from '@nx/devkit'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { FsTree } from 'nx/src/generators/tree'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { parse as parseYaml } from 'yaml'

import {
  applicationGenerator,
  cdnGenerator,
  docGenerator,
  libraryGenerator,
  mockGenerator,
  reactLibraryGenerator,
  startGenerator
} from '../src/index'
import { resolveInitialVersion } from '../src/utils/version'

let directory: string
let tree: Tree
const cliVersion = readJsonFile(
  path.resolve(import.meta.dirname, '../package.json')
).version

const git = (...args: string[]) =>
  execFileSync(
    'git',
    [
      '-c',
      `core.hooksPath=${path.join(directory, 'no-hooks')}`,
      '-c',
      'tag.gpgSign=false',
      ...args
    ],
    { cwd: directory, encoding: 'utf8', stdio: 'pipe' }
  )

const commit = () =>
  git(
    '-c',
    'user.name=Vx Test',
    '-c',
    'user.email=test@example.test',
    '-c',
    'commit.gpgsign=false',
    'commit',
    '--allow-empty',
    '-m',
    'test fixture'
  )

beforeEach(() => {
  directory = mkdtempSync(path.join(tmpdir(), 'vx-cli-version-'))
  tree = new FsTree(directory, false)
  tree.write('nx.json', '{}')
  updateNxJson(tree, {
    release: { releaseTag: { pattern: '{version}', strictPreid: false } }
  })
  git('init', '--initial-branch=main')
  commit()
  vi.stubEnv('NX_SKIP_FORMAT', 'true')
})

afterEach(() => {
  vi.unstubAllEnvs()
  rmSync(directory, { recursive: true, force: true })
})

describe('initial generated project version', () => {
  it('reads the latest matching prerelease from the consumer repository', async () => {
    git('tag', '1.0.0-beta.2')
    git('tag', '1.0.0-beta.10')
    git('tag', '0.9.0')
    git('tag', 'notes')
    expect(await resolveInitialVersion(tree, 'portal')).toBe('1.0.0-beta.10')
  })

  it('prefers a stable tag over a prerelease of the same version', async () => {
    git('tag', '1.0.0-beta.10')
    git('tag', '1.0.0')
    expect(await resolveInitialVersion(tree, 'portal')).toBe('1.0.0')
  })

  it('uses the default Nx v prefix when no release pattern is configured', async () => {
    tree.write('nx.json', '{}')
    git('tag', 'v2.3.4')
    git('tag', '9.0.0')
    expect(await resolveInitialVersion(tree, 'portal')).toBe('2.3.4')
  })

  it('extracts SemVer from the configured tag prefix', async () => {
    updateNxJson(tree, {
      release: {
        releaseTag: { pattern: 'release/{version}', strictPreid: false }
      }
    })
    git('tag', 'release/3.2.1-beta.4')
    git('tag', '99.0.0')
    expect(await resolveInitialVersion(tree, 'portal')).toBe('3.2.1-beta.4')
  })

  it('matches the generated project name for independent release tags', async () => {
    updateNxJson(tree, {
      release: {
        projectsRelationship: 'independent',
        releaseTag: { strictPreid: false }
      }
    })
    git('tag', 'portal@1.2.3')
    git('tag', 'another-project@99.0.0')
    expect(await resolveInitialVersion(tree, 'portal')).toBe('1.2.3')
  })

  it('honors the workspace strict prerelease preference', async () => {
    updateNxJson(tree, {
      release: { releaseTag: { pattern: '{version}', strictPreid: true } }
    })
    git('tag', '1.2.0')
    git('tag', '1.3.0-beta.2')
    expect(await resolveInitialVersion(tree, 'portal')).toBe('1.2.0')
  })

  it.each([
    { setting: undefined, expected: '1.0.0' },
    { setting: false, expected: '1.0.0' },
    { setting: true, expected: '9.0.0' },
    { setting: ['ma*'], expected: '9.0.0' },
    { setting: ['release/*'], expected: '1.0.0' }
  ])('honors branch lookup setting $setting', async ({ setting, expected }) => {
    git('tag', '1.0.0')
    git('checkout', '-b', 'release/next')
    commit()
    git('tag', '9.0.0')
    git('checkout', 'main')
    updateNxJson(tree, {
      release: {
        releaseTag: {
          pattern: '{version}',
          strictPreid: false,
          checkAllBranchesWhen: setting
        }
      }
    })
    expect(await resolveInitialVersion(tree, 'portal')).toBe(expected)
  })

  it('falls back to the CLI when the consumer has no release tags', async () => {
    tree.write('package.json', JSON.stringify({ version: '0.0.1' }))
    expect(await resolveInitialVersion(tree, 'portal')).toBe(cliVersion)
  })

  it('falls back to the CLI when tags do not match the release pattern', async () => {
    git('tag', 'docs-only')
    git('tag', '@vx-cli/react@99.0.0')
    expect(await resolveInitialVersion(tree, 'portal')).toBe(cliVersion)
  })

  it('falls back to the CLI outside a Git repository', async () => {
    rmSync(path.join(directory, '.git'), { recursive: true, force: true })
    expect(await resolveInitialVersion(tree, 'portal')).toBe(cliVersion)
  })

  const packageGenerators = [
    {
      generator: libraryGenerator,
      projectName: 'portal',
      projectRoot: 'packages/portal'
    },
    {
      generator: reactLibraryGenerator,
      projectName: 'portal',
      projectRoot: 'packages/portal'
    },
    {
      generator: mockGenerator,
      projectName: 'portal-mock',
      projectRoot: 'apps/portal-mock'
    }
  ]

  it.each(packageGenerators)(
    'seeds $generator.name manifests from the consumer Git tag',
    async ({ generator, projectRoot }) => {
      git('tag', '4.2.0-beta.7')
      tree.write(
        'package.json',
        JSON.stringify({ name: 'consumer', version: '0.0.1' })
      )
      await generator(tree, { name: 'portal', category: 'app' })
      expect(readJson(tree, `${projectRoot}/package.json`).version).toBe(
        '4.2.0-beta.7'
      )
    }
  )

  it.each(packageGenerators)(
    'uses the generated Nx project name for $generator.name independent releases',
    async ({ generator, projectName, projectRoot }) => {
      updateNxJson(tree, {
        release: {
          projectsRelationship: 'independent',
          releaseTag: { strictPreid: false }
        }
      })
      git('tag', `${projectName}@4.2.0-beta.7`)
      git('tag', 'unrelated@99.0.0')
      tree.write('package.json', JSON.stringify({ name: 'consumer' }))
      await generator(tree, {
        name: 'portal',
        category: 'app',
        publishable: true
      })
      expect(readJson(tree, `${projectRoot}/package.json`).version).toBe(
        '4.2.0-beta.7'
      )
    }
  )

  it.each([applicationGenerator, startGenerator, cdnGenerator, docGenerator])(
    'keeps generated app and E2E version fields aligned with the Git tag',
    async generator => {
      git('tag', '4.2.0-beta.7')
      tree.write(
        'package.json',
        JSON.stringify({ name: 'consumer', version: '0.0.1' })
      )
      tree.write('tsconfig.base.json', JSON.stringify({ compilerOptions: {} }))
      await generator(tree, { name: 'portal', category: 'app' })
      expect(readJson(tree, 'apps/portal/package.json').version).toBe(
        '4.2.0-beta.7'
      )
      expect(readJson(tree, 'apps/portal-e2e/package.json').version).toBe(
        '4.2.0-beta.7'
      )
      expect(
        parseYaml(tree.read('apps/portal/vx.app.yaml', 'utf8') ?? '').core
          .version
      ).toBe('4.2.0-beta.7')
      expect(tree.read('apps/portal/.env', 'utf8')).toContain(
        'V_APP_VER=4.2.0-beta.7'
      )
      if (generator === cdnGenerator) {
        expect(tree.read('apps/portal/index.html', 'utf8')).toContain(
          '?vx=4.2.0-beta.7'
        )
      }
    }
  )
})
