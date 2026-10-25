export interface GeneratorSchema {
  name: string
  directory?: string
  tags?: string
  publishable?: boolean
  importPath?: string
  stateManager?: 'zustand' | 'redux-toolkit' | 'jotai' | 'valtio'
}
