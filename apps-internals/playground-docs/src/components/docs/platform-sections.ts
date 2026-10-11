export const platformSections = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    prefix: 'getting-started',
    page: 'getting-started/overview'
  },
  {
    id: 'components',
    title: 'Components',
    prefix: 'components',
    page: 'components/openapi/vezham-demo/authentication/authentication_auth_post'
  },
  {
    id: 'releases',
    title: 'Releases',
    prefix: 'releases',
    page: 'releases/markdown-101/ref/md-affine'
  },
  {
    id: 'migration',
    title: 'Migration',
    prefix: 'migration',
    page: 'migration/markdown-101/handbooks/basic'
  }
] as const

export type PlatformSection = (typeof platformSections)[number]['id']
