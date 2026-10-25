import type { ApplicationCategory } from '../../utils/application-category'

export interface GeneratorSchema {
  name: string
  directory?: string
  category?: ApplicationCategory
}
