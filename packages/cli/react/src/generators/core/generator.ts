import {
  type Tree,
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  updateJson
} from '@nx/devkit'
import * as path from 'path'

import { assertTemplateFiles } from '../../utils/templates'
import type { GeneratorSchema } from './schema'

interface NormalizedSchema extends GeneratorSchema {
  projectName: string
  projectRoot: string
  projectDirectory: string
  parsedTags: string[]
}
const normalizeOptions = (
  tree: Tree,
  options: GeneratorSchema
): NormalizedSchema => {
  const name = names(options.name).fileName
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-')
  const projectRoot = `${getWorkspaceLayout(tree).libsDir}/${projectDirectory}`
  const parsedTags = options.tags
    ? options.tags.split(',').map(s => s.trim())
    : []
  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags
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
}
const updateTsConfig = (tree: Tree, options: NormalizedSchema) => {
  updateJson(tree, 'tsconfig.base.json', json => {
    const c = json.compilerOptions
    c.paths = c.paths || {}
    if (options.publishable) {
      c.paths[`@${options.name}`] = [`${options.projectRoot}/src/index.ts`]
    } else {
      c.paths[`@${options.projectName}/src`] = [
        `${options.projectRoot}/src/index.ts`
      ]
    }
    return json
  })
}
export const coreGenerator = async (tree: Tree, options: GeneratorSchema) => {
  assertTemplateFiles(path.join(import.meta.dirname, 'files'), 'core')
  const normalizedOptions = normalizeOptions(tree, options)
  addProjectConfiguration(tree, normalizedOptions.projectName, {
    root: normalizedOptions.projectRoot,
    projectType: 'library',
    sourceRoot: `${normalizedOptions.projectRoot}/src`,
    targets: {
      build: {
        executor: '@nx/vite:build',
        outputs: ['{options.outputPath}'],
        options: {
          outputPath: `dist/${normalizedOptions.projectRoot}`
        }
      },
      lint: {
        executor: '@nx/eslint:lint',
        outputs: ['{options.outputFile}'],
        options: {
          lintFilePatterns: [
            `${normalizedOptions.projectRoot}/**/*.{ts,tsx,js,jsx}`
          ]
        }
      },
      test: {
        executor: '@nx/vitest:test',
        outputs: ['{workspaceRoot}/coverage/{projectRoot}'],
        options: {
          config: `${normalizedOptions.projectRoot}/vite.config.ts`,
          passWithNoTests: true
        }
      }
    },
    tags: normalizedOptions.parsedTags
  })
  addFiles(tree, normalizedOptions)
  updateTsConfig(tree, normalizedOptions)
  await formatFiles(tree)
}
