import {
  type Tree,
  formatFiles,
  generateFiles,
  names,
  offsetFromRoot
} from '@nx/devkit'
import * as path from 'path'

import {
  assertApplicationCategory,
  normalizeApplicationLocation
} from '../../utils/application-category'
import type { ApplicationType } from '../../utils/application-type'
import { toTitleCase } from '../../utils/casing'
import { assertProjectLocationsAvailable } from '../../utils/project-location'
import { assertTemplateFiles } from '../../utils/templates'
import { resolveInitialVersion } from '../../utils/version'
import type { ApplicationGeneratorSchema, GeneratorSchema } from './schema'

interface NormalizedSchema extends ApplicationGeneratorSchema<ApplicationType> {
  projectName: string
  projectRoot: string
  projectDirectory: string
  categoryPrefix: string
  parsedTags: string[]
  projectDisplayName: string
  projectVersion: string
  cdnPath: string
  e2eProjectName: string
  e2eProjectRoot: string
}
const normalizeOptions = async (
  tree: Tree,
  options: ApplicationGeneratorSchema<ApplicationType>
): Promise<NormalizedSchema> => {
  const {
    category,
    categoryPrefix,
    parsedTags,
    projectDirectory,
    projectName
  } = normalizeApplicationLocation(
    options.name,
    options.category,
    options.directory
  )
  const projectRoot = `${projectDirectory}`
  const e2eProjectName = `${projectName}-e2e`
  const e2eProjectRoot = `${projectDirectory}-e2e`
  const projectDisplayName = toTitleCase(projectName)
  const projectVersion = await resolveInitialVersion(tree, projectName)
  // wjdlz/NOTE: for CDN
  const cdnPath =
    (options.cdnHost ?? 'cdn') === 'cdn'
      ? `https://static.cdn.vezham.com/${projectDirectory}`
      : '/vx-app'

  return {
    ...options,
    category,
    strict: options.strict ?? true,
    cdnHost: options.cdnHost ?? 'cdn',
    projectName,
    projectRoot,
    projectDirectory,
    categoryPrefix,
    parsedTags,
    projectDisplayName,
    projectVersion,
    cdnPath,
    e2eProjectName,
    e2eProjectRoot
  }
}
const addFiles = (
  tree: Tree,
  options: NormalizedSchema,
  templateDirectory: string,
  applicationType: ApplicationType
) => {
  const templateOptions = {
    ...options,
    ...names(options.name),
    applicationType,
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: ''
  }
  generateFiles(tree, templateDirectory, options.projectRoot, templateOptions)
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
}
export const generateApplication = async (
  tree: Tree,
  options: ApplicationGeneratorSchema<ApplicationType>,
  applicationType: ApplicationType,
  templateDirectory: string
) => {
  assertApplicationCategory(options.category, applicationType)
  assertTemplateFiles(templateDirectory, `${applicationType} application`)
  const normalizedOptions = await normalizeOptions(tree, options)
  assertProjectLocationsAvailable(tree, [
    {
      name: normalizedOptions.projectName,
      root: normalizedOptions.projectRoot
    },
    {
      name: normalizedOptions.e2eProjectName,
      root: normalizedOptions.e2eProjectRoot
    }
  ])
  addFiles(tree, normalizedOptions, templateDirectory, applicationType)
  addE2eFiles(tree, normalizedOptions)
  await formatFiles(tree)
}

export const applicationGenerator = (tree: Tree, options: GeneratorSchema) =>
  generateApplication(
    tree,
    options,
    'app',
    path.join(import.meta.dirname, 'files')
  )
