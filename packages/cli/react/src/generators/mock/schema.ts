import type { ApplicationCategoryFor } from '../../utils/application-category'

export interface GeneratorSchema {
  name: string
  directory?: string
  skipSuffix?: boolean
  category?: ApplicationCategoryFor<'mock'>
}
