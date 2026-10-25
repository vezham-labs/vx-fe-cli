import {
  type TargetConfiguration,
  type Tree,
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  names,
  offsetFromRoot
} from '@nx/devkit'
import * as path from 'path'

import { toPascalCase } from '../../utils/casing'
import { assertTemplateFiles } from '../../utils/templates'
import type { GeneratorSchema } from './schema'

interface NormalizedSchema extends GeneratorSchema {
  projectName: string
  projectRoot: string
  projectDirectory: string
  categoryPrefix: string
  parsedTags: string[]
  projectLabel: string
  cdnPath: string
  e2eProjectName: string
  e2eProjectRoot: string
  mockProjectName: string
  mockProjectRoot: string
}
const normalizeOptions = (
  _tree: Tree,
  options: GeneratorSchema
): NormalizedSchema => {
  const name = names(options.name).fileName
  const category = options.category || 'apps'
  let categoryPrefix = 'apps'
  if (category !== 'app') {
    const suffix = category === 'vezham' ? `_${category}` : `_${category}s`
    categoryPrefix += suffix
  }
  const projectDirectory = options.directory
    ? `${categoryPrefix}/${names(options.directory).fileName}/${name}`
    : `${categoryPrefix}/${name}`
  const projectName = options.directory
    ? `${names(options.directory).fileName}-${name}`
    : name
  const projectRoot = `${projectDirectory}`
  const e2eProjectName = `${projectName}-e2e`
  const e2eProjectRoot = `${projectDirectory}-e2e`
  const mockProjectName = `${projectName}-mock`
  const mockProjectRoot = `${projectDirectory}-mock`
  const parsedTags = []
  parsedTags.push(`category:${category}`)
  const projectLabel = toPascalCase(projectName)
  // wjdlz/NOTE: for CDN
  const cdnPath =
    (options.cdnHost ?? 'cdn') === 'cdn'
      ? `https://static.cdn.vezham.com/${projectDirectory}`
      : '/vx-app'

  return {
    ...options,
    category,
    mockServer: options.mockServer ?? true,
    strict: options.strict ?? true,
    cdnHost: options.cdnHost ?? 'cdn',
    projectName,
    projectRoot,
    projectDirectory,
    categoryPrefix,
    parsedTags,
    projectLabel,
    cdnPath,
    e2eProjectName,
    e2eProjectRoot,
    mockProjectName,
    mockProjectRoot
  }
}
const addFiles = (tree: Tree, options: NormalizedSchema) => {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: ''
  }
  generateFiles(
    tree,
    path.join(import.meta.dirname, 'files'),
    options.projectRoot,
    templateOptions
  )
  addVxProjectConfiguration(tree, options)
}
const addVxProjectConfiguration = (tree: Tree, options: NormalizedSchema) => {
  const targets: Record<string, TargetConfiguration> = {}
  targets['hosts:setup'] = {}
  targets['routes:tanstack'] = {}
  addProjectConfiguration(tree, options.projectName, {
    root: options.projectRoot,
    projectType: 'application',
    sourceRoot: `${options.projectRoot}/src`,
    targets,
    tags: options.parsedTags
  })
}
const addE2eFiles = (tree: Tree, options: NormalizedSchema) => {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.e2eProjectRoot),
    template: ''
  }
  generateFiles(
    tree,
    path.join(import.meta.dirname, 'files-e2e-playwright'),
    options.e2eProjectRoot,
    templateOptions
  )
  addE2eProjectConfiguration(tree, options)
}
const addE2eProjectConfiguration = (tree: Tree, options: NormalizedSchema) => {
  const targets: Record<string, TargetConfiguration> = {}
  addProjectConfiguration(tree, options.e2eProjectName, {
    root: options.e2eProjectRoot,
    projectType: 'application',
    sourceRoot: `${options.e2eProjectRoot}/src`,
    targets,
    tags: [...options.parsedTags, 'e2e'],
    implicitDependencies: [options.projectName]
  })
}
const addMockFiles = (tree: Tree, options: NormalizedSchema) => {
  if (!options.mockServer) {
    return
  }
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.mockProjectRoot),
    template: ''
  }
  generateFiles(
    tree,
    path.join(import.meta.dirname, 'files-mock-server'),
    options.mockProjectRoot,
    templateOptions
  )
  addMockProjectConfiguration(tree, options)
}
const addMockProjectConfiguration = (tree: Tree, options: NormalizedSchema) => {
  const targets: Record<string, TargetConfiguration> = {}
  targets.serve = {
    executor: 'nx:run-commands',
    options: {
      cwd: '{projectRoot}',
      command: 'pnpm serve'
    }
  }
  targets.build = {
    executor: 'nx:run-commands',
    options: {
      cwd: '{projectRoot}',
      command: 'pnpm build'
    }
  }
  targets.generate = {
    executor: 'nx:run-commands',
    options: {
      cwd: '{projectRoot}',
      command: 'pnpm generate'
    }
  }
  addProjectConfiguration(tree, options.mockProjectName, {
    root: options.mockProjectRoot,
    projectType: 'application',
    sourceRoot: `${options.mockProjectRoot}/src`,
    targets,
    tags: [...options.parsedTags, 'mock']
  })
}
export const applicationGenerator = async (
  tree: Tree,
  options: GeneratorSchema
) => {
  assertTemplateFiles(path.join(import.meta.dirname, 'files'), 'application')
  const normalizedOptions = normalizeOptions(tree, options)
  addFiles(tree, normalizedOptions)
  addE2eFiles(tree, normalizedOptions)
  addMockFiles(tree, normalizedOptions)
  await formatFiles(tree)
}
