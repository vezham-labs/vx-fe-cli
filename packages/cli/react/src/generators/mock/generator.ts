import {
  type Tree,
  formatFiles,
  generateFiles,
  names,
  offsetFromRoot
} from '@nx/devkit'
import * as path from 'node:path'

import {
  assertApplicationCategory,
  normalizeApplicationLocation
} from '../../utils/application-category'
import { assertProjectLocationsAvailable } from '../../utils/project-location'
import { assertTemplateFiles } from '../../utils/templates'
import { resolveInitialVersion } from '../../utils/version'
import type { GeneratorSchema } from './schema'

export const mockGenerator = async (tree: Tree, options: GeneratorSchema) => {
  assertApplicationCategory(options.category, 'mock')
  assertTemplateFiles(path.join(import.meta.dirname, 'files'), 'mock')

  const location = normalizeApplicationLocation(
    options.name,
    options.category,
    options.directory,
    { type: 'mock', skipSuffix: options.skipSuffix }
  )
  const projectName = location.projectName
  const projectRoot = location.projectDirectory
  const applicationName = projectName.endsWith('-mock')
    ? projectName.slice(0, -'-mock'.length)
    : projectName
  assertProjectLocationsAvailable(tree, [
    { name: projectName, root: projectRoot }
  ])
  const nxSchemaPath = path.posix.relative(
    projectRoot,
    'node_modules/nx/schemas/project-schema.json'
  )

  generateFiles(tree, path.join(import.meta.dirname, 'files'), projectRoot, {
    ...names(options.name),
    applicationName,
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
