import { names } from '@nx/devkit'

export const applicationCategories = [
  'cdn',
  'pod',
  'suit',
  'platform',
  'widget',
  'internal',
  'app',
  'vezham',
  'doc',
  'demo'
] as const

export type ApplicationCategory = (typeof applicationCategories)[number]

export const normalizeApplicationLocation = (
  name: string,
  category: ApplicationCategory = 'internal',
  directory?: string
) => {
  const categoryPrefix =
    category === 'app'
      ? 'apps'
      : `apps_${category === 'vezham' ? category : `${category}s`}`
  const normalizedDirectory = directory ? names(directory).fileName : undefined
  const normalizedName = names(name).fileName
  const projectDirectory = [categoryPrefix, normalizedDirectory, normalizedName]
    .filter(Boolean)
    .join('/')
  const projectName = [normalizedDirectory, normalizedName]
    .filter(Boolean)
    .join('-')

  return {
    category,
    categoryPrefix,
    projectDirectory,
    projectName,
    parsedTags: [`category:${category}`]
  }
}
