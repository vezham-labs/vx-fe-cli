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

interface GeneratorOptions {
  name: string
  directory?: string
  publishable?: boolean
}

const getRepositoryUrl = (tree: Tree) => {
  const workspacePackage = tree.exists('package.json')
    ? readJson<{ repository?: string | { url?: string } }>(tree, 'package.json')
    : {}
  const repository = workspacePackage.repository
  const configuredUrl =
    typeof repository === 'string' ? repository : repository?.url
  if (configuredUrl) return configuredUrl

  try {
    return execFileSync('git', ['remote', 'get-url', 'origin'], {
      cwd: process.cwd(),
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim()
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

  const configTsconfigPath = path.posix.relative(
    projectRoot,
    'packages/vx/config/tsconfig.lib.json'
  )
  const nxSchemaPath = path.posix.relative(
    projectRoot,
    'node_modules/nx/schemas/project-schema.json'
  )

  generateFiles(tree, path.join(templateDirectory, 'files'), projectRoot, {
    ...normalizedName,
    fileName: normalizedName.fileName,
    projectName: normalizedName.fileName,
    projectRoot,
    offsetFromRoot: offsetFromRoot(projectRoot),
    configTsconfigPath,
    nxSchemaPath,
    repositoryUrl: getRepositoryUrl(tree),
    publishable: options.publishable ?? false,
    template: ''
  })
  await formatFiles(tree)
}
