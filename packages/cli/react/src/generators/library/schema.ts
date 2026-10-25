export interface GeneratorSchema {
  name: string
  directory?: string
  tags?: string

  // vx-bot/NOTE: Generator tooling options.
  linter?: 'eslint' | 'none'
  unitTestRunner?: 'vitest' | 'none'

  // vx-bot/NOTE: Library output and build options.
  importPath?: string
  component?: boolean
  skipFormat?: boolean
  skipTsConfig?: boolean
  buildable?: boolean
  publishable?: boolean
}
