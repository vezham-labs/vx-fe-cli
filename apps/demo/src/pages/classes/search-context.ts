import { createContext, useContext } from 'react'

type ClassesSearchContextValue = {
  query: string
  setQuery: (query: string) => void
}

export const ClassesSearchContext =
  createContext<ClassesSearchContextValue | null>(null)

export const useClassesSearch = () => {
  const context = useContext(ClassesSearchContext)

  if (!context) {
    throw new Error('useClassesSearch must be used within ClassesSearchContext')
  }

  return context
}
