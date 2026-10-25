export interface GeneratorSchema {
  name: string
  directory?: string
  category?:
    | 'vezham'
    | 'demo'
    | 'doc'
    | 'internal'
    | 'app'
    | 'cdn'
    | 'pod'
    | 'suit'
    | 'platform'
    | 'widget'
  mockServer?: boolean
  cdnHost?: 'cdn' | 'self'
  strict?: boolean
}
