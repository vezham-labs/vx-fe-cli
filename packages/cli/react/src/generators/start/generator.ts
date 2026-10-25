import type { Tree } from '@nx/devkit'
import * as path from 'node:path'

import { generateApplication } from '../application/generator'
import type { ApplicationGeneratorSchema } from '../application/schema'

export const startGenerator = (
  tree: Tree,
  options: ApplicationGeneratorSchema
) =>
  generateApplication(
    tree,
    options,
    'start',
    path.join(import.meta.dirname, 'files')
  )
