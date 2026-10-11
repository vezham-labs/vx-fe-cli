import nextEslintPluginNext from '@next/eslint-plugin-next'
import nx from '@nx/eslint-plugin'

import baseConfig from '../../eslint.config.mjs'

export default [
  ...nx.configs['flat/react-typescript'],
  ...baseConfig,
  {
    ...nextEslintPluginNext.configs.recommended,
    files: ['**/*.{js,jsx,ts,tsx}'],
    settings: { next: { rootDir: import.meta.dirname } }
  },
  {
    ignores: ['.next/**/*']
  }
]
