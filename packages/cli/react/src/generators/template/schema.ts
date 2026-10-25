export interface GeneratorSchema {
  name: string
  directory?: string
  tags?: string
  publishable?: boolean
  importPath?: string
  templateType?: 'page' | 'component' | 'feature' | 'layout'
}
