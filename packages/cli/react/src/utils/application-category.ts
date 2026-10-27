import { names } from '@nx/devkit'

import type { ApplicationType } from './application-type'

export type ApplicationCategory =
  | 'app'
  | 'showcase'
  | 'suite'
  | 'platform'
  | 'widget'
  | 'doc'
  | 'pod'
  | 'cdn'
  | 'internal'
  | 'vezham'

export type ApplicationCategoryFor<TType extends ApplicationType | 'mock'> =
  TType extends 'cdn'
    ? Exclude<ApplicationCategory, 'doc'>
    : TType extends 'doc'
      ? Exclude<ApplicationCategory, 'cdn'>
      : Exclude<ApplicationCategory, 'cdn' | 'doc'>

export const assertApplicationCategory = (
  category: ApplicationCategory | undefined,
  applicationType: ApplicationType | 'mock'
) => {
  if (category === 'cdn' && applicationType !== 'cdn') {
    throw new Error(
      'The "cdn" category is only available for the app-cdn generator.'
    )
  }
  if (category === 'doc' && applicationType !== 'doc') {
    throw new Error(
      'The "doc" category is only available for the app-doc generator.'
    )
  }
}

export const normalizeApplicationLocation = (
  name: string,
  category: ApplicationCategory = 'internal',
  directory?: string
) => {
  const categoryPrefix =
    category === 'app'
      ? 'apps'
      : `apps-${category === 'vezham' ? category : `${category}s`}`
  const normalizedDirectory = directory ? names(directory).fileName : undefined
  const normalizedName = names(name).fileName
  const projectDirectory = [categoryPrefix, normalizedDirectory, normalizedName]
    .filter(Boolean)
    .join('/')
  const projectName = normalizedName

  return {
    category,
    categoryPrefix,
    projectDirectory,
    projectName,
    parsedTags: [`category:${category}`]
  }
}
