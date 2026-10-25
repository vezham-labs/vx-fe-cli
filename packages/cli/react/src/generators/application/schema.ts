import type { ApplicationCategory } from '../../utils/application-category'

export interface ApplicationGeneratorSchema {
  name: string
  directory?: string
  category?: ApplicationCategory
  cdnHost?: 'cdn' | 'self'
  strict?: boolean
}

export type GeneratorSchema = ApplicationGeneratorSchema
