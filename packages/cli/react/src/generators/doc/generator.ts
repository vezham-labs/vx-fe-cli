import type { Tree } from '@nx/devkit'
import * as path from 'node:path'

import { generateApplication } from '../application/generator'
import type { ApplicationGeneratorSchema } from '../application/schema'

export const docGenerator = (
  tree: Tree,
  options: ApplicationGeneratorSchema<'doc'>
) =>
  generateApplication(
    tree,
    options,
    'doc',
    path.join(import.meta.dirname, 'files')
  )
