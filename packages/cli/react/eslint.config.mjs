import baseConfig from '../../../eslint.config.mjs'

export default [
  ...baseConfig,
  {
    files: ['**/*.json'],
    rules: {
      '@nx/dependency-checks': [
        'error',
        {
          // vx-bot/NOTE: Nx is the plugin host supplied by the consumer workspace.
          // vx-bot/NOTE: The CLI resolves its own package.json for its version.
          ignoredDependencies: ['nx', '@vx-cli/react'],
          ignoredFiles: [
            '{projectRoot}/eslint.config.{js,cjs,mjs,ts,cts,mts}',
            '{projectRoot}/vite.config.{js,ts,mjs,mts}',
            '{projectRoot}/vitest.config.{js,ts,mjs,mts}'
          ]
        }
      ]
    },
    languageOptions: {
      parser: await import('jsonc-eslint-parser')
    }
  },
  {
    files: ['**/package.json'],
    rules: {
      '@nx/nx-plugin-checks': 'error'
    },
    languageOptions: {
      parser: await import('jsonc-eslint-parser')
    }
  }
]
