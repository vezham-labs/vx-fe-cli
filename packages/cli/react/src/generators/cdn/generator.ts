import type { Tree } from '@nx/devkit'
import * as path from 'node:path'

import { generateApplication } from '../application/generator'
import type { ApplicationGeneratorSchema } from '../application/schema'

export const cdnGenerator = (
  tree: Tree,
  options: ApplicationGeneratorSchema<'cdn'>
) =>
  generateApplication(
    tree,
    options,
    'cdn',
    path.join(import.meta.dirname, 'files')
  )
