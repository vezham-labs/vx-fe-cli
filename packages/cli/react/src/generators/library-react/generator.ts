import type { Tree } from '@nx/devkit'

import { generatePackageLibrary } from '../../utils/package-library'
import type { GeneratorSchema } from './schema'

export const reactLibraryGenerator = async (
  tree: Tree,
  options: GeneratorSchema
) => generatePackageLibrary(tree, options, import.meta.dirname)
