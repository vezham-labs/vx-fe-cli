import type { ApplicationCategoryFor } from '../../utils/application-category'
import type { ApplicationType } from '../../utils/application-type'

export interface ApplicationGeneratorSchema<
  TType extends ApplicationType = 'app'
> {
  name: string
  directory?: string
  skipSuffix?: boolean
  category?: ApplicationCategoryFor<TType>
  cdnHost?: 'cdn' | 'self'
  strict?: boolean
}

export type GeneratorSchema = ApplicationGeneratorSchema
