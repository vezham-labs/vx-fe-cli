import { type Tree, formatFiles } from '@nx/devkit'

import { configureGeneratorDefaults } from '../../utils/nx-json'
import type { GeneratorSchema } from './schema'

export const initGenerator = async (
  tree: Tree,
  options: GeneratorSchema = {}
) => {
  if (options.overrideDefaults !== false) configureGeneratorDefaults(tree)
  await formatFiles(tree)
}
