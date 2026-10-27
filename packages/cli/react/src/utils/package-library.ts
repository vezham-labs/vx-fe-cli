import {
  type Tree,
  formatFiles,
  generateFiles,
  names,
  normalizePath,
  offsetFromRoot,
  readJson
} from '@nx/devkit'
import { execFileSync } from 'node:child_process'
import * as path from 'node:path'

import { assertProjectLocationsAvailable } from './project-location'
import { resolveInitialVersion } from './version'

interface GeneratorOptions {
  name: string
  directory?: string
  publishable?: boolean
}

const normalizeRepositoryUrl = (value: string) => {
  const url = value
    .trim()
    .replace(/^git\+/, '')
    .replace(/^git@([^:]+):/, 'ssh://git@$1/')
  if (!/^(https?|ssh):\/\//.test(url)) return value

  const repository = new URL(url)
  const pathname = repository.pathname.replace(/\/+$/, '')
  repository.pathname = pathname.endsWith('.git') ? pathname : `${pathname}.git`
  return `git+${repository.toString()}`
}

const getRepositoryUrl = (tree: Tree) => {
  const workspacePackage = tree.exists('package.json')
    ? readJson<{ repository?: string | { url?: string } }>(tree, 'package.json')
    : {}
  const repository = workspacePackage.repository
  const configuredUrl =
    typeof repository === 'string' ? repository : repository?.url
  if (configuredUrl) return normalizeRepositoryUrl(configuredUrl)

  try {
    const origin = execFileSync('git', ['remote', 'get-url', 'origin'], {
      cwd: tree.root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim()
    return normalizeRepositoryUrl(origin)
  } catch {
    return undefined
  }
}

export const generatePackageLibrary = async (
  tree: Tree,
  options: GeneratorOptions,
  templateDirectory: string
) => {
  const normalizedName = names(options.name)
  const requestedDirectory =
    options.directory || path.posix.join('packages', normalizedName.fileName)
  const projectRoot = normalizePath(path.posix.normalize(requestedDirectory))
  if (
    path.posix.isAbsolute(projectRoot) ||
    path.win32.isAbsolute(requestedDirectory) ||
    projectRoot === '..' ||
    projectRoot.startsWith('../')
  ) {
    throw new Error('The output directory must stay within the workspace.')
  }

  assertProjectLocationsAvailable(tree, [
    { name: normalizedName.fileName, root: projectRoot }
  ])

  const nxSchemaPath = path.posix.relative(
    projectRoot,
    'node_modules/nx/schemas/project-schema.json'
  )

  generateFiles(tree, path.join(templateDirectory, 'files'), projectRoot, {
    ...normalizedName,
    fileName: normalizedName.fileName,
    projectName: normalizedName.fileName,
    projectVersion: await resolveInitialVersion(tree, normalizedName.fileName),
    projectRoot,
    offsetFromRoot: offsetFromRoot(projectRoot),
    nxSchemaPath,
    repositoryUrl: getRepositoryUrl(tree),
    publishable: options.publishable ?? false,
    template: ''
  })
  await formatFiles(tree)
}
