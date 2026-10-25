import { existsSync } from 'node:fs'

export const assertTemplateFiles = (directory: string, generator: string) => {
  if (!existsSync(directory)) {
    throw new Error(
      `The legacy ${generator} generator has no committed templates. Add its files directory before using it.`
    )
  }
}
