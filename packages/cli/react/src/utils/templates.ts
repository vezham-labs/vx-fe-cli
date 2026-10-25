import { existsSync } from 'node:fs'

export const assertTemplateFiles = (directory: string, generator: string) => {
  if (!existsSync(directory)) {
    throw new Error(
      `The ${generator} generator has no committed templates yet. Add its files directory before using it.`
    )
  }
}
