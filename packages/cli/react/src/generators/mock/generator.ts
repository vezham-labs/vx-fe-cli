import {
  type Tree,
  formatFiles,
  generateFiles,
  names,
  normalizePath,
  offsetFromRoot
} from '@nx/devkit'
import * as path from 'node:path'

import { normalizeApplicationLocation } from '../../utils/application-category'
import { assertTemplateFiles } from '../../utils/templates'
import { resolveInitialVersion } from '../../utils/version'
import type { GeneratorSchema } from './schema'

export const mockGenerator = async (tree: Tree, options: GeneratorSchema) => {
  assertTemplateFiles(path.join(import.meta.dirname, 'files'), 'mock')

  const location = normalizeApplicationLocation(
    options.name,
    options.category,
    options.directory
  )
  const projectName = `${location.projectName}-mock`
  const projectRoot = normalizePath(`${location.projectDirectory}-mock`)
  const nxSchemaPath = path.posix.relative(
    projectRoot,
    'node_modules/nx/schemas/project-schema.json'
  )

  generateFiles(tree, path.join(import.meta.dirname, 'files'), projectRoot, {
    ...names(options.name),
    applicationName: names(options.name).fileName,
    category: location.category,
    projectName,
    projectVersion: await resolveInitialVersion(tree, projectName),
    projectRoot,
    nxSchemaPath,
    offsetFromRoot: offsetFromRoot(projectRoot),
    template: ''
  })

  await formatFiles(tree)
}
