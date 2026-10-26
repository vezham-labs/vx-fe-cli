const { createProjectGraphAsync } = require('@nx/devkit')

const maxScopes = 3
const scopeDelimiter = ','
const standaloneScopes = new Set(['repo', 'workspace'])

const types = [
  'feat',
  'fix',
  'perf',
  'refactor',
  'style',
  'docs',
  'test',
  'build',
  'ci',
  'chore',
  'revert',
  'deps',
  'release',
  'i18n',
  'mocks',
  'stories'
]

module.exports = async () => {
  const graph = await createProjectGraphAsync()

  const projectsByScope = new Map()
  for (const name of Object.keys(graph.nodes).sort()) {
    const scope = name.replace(/^@[^/]+\//, '')
    const projects = projectsByScope.get(scope) ?? []
    projects.push(name)
    projectsByScope.set(scope, projects)
  }

  // vx-bot/NOTE: Nx release requires full project names when short scopes collide.
  const scopes = new Set([
    'workspace',
    'repo',
    'vx',
    'agents',
    'apps',
    'e2e',
    ...Array.from(projectsByScope).flatMap(([scope, projects]) =>
      projects.length === 1 ? [scope] : projects
    )
  ])

  const validateScopes = parsed => {
    if (!parsed.scope) return [true]

    const commitScopes = parsed.scope.split(scopeDelimiter)
    for (const scope of commitScopes) {
      const projects = projectsByScope.get(scope)
      if (projects?.length > 1) {
        return [
          false,
          `scope "${scope}" is ambiguous; use a full Nx project name: ${projects.join(', ')}`
        ]
      }
    }
    const invalidScopes = commitScopes.filter(scope => !scopes.has(scope))

    if (invalidScopes.length > 0) {
      return [
        false,
        `scope must only use configured values: ${invalidScopes.join(', ')}`
      ]
    }

    if (commitScopes.length > maxScopes) {
      return [false, `scope must contain at most ${maxScopes} values`]
    }

    if (new Set(commitScopes).size !== commitScopes.length) {
      return [false, 'scope values must be unique']
    }

    if (
      commitScopes.length > 1 &&
      commitScopes.some(scope => standaloneScopes.has(scope))
    ) {
      return [false, 'repo and workspace scopes must be used alone']
    }

    const sortedScopes = [...commitScopes].sort()

    if (commitScopes.some((scope, index) => scope !== sortedScopes[index])) {
      return [false, 'scope values must be sorted alphabetically']
    }

    return [true]
  }

  return {
    extends: ['@commitlint/config-conventional'],
    plugins: ['commitlint-plugin-function-rules'],
    helpUrl:
      'https://storybook.vezham.com/?path=/docs/guidelines-contribution--overview#commit-convention',
    rules: {
      'type-enum': [2, 'always', types],
      'scope-enum': [0],
      'function-rules/scope-enum': [2, 'always', validateScopes],
      'scope-case': [
        2,
        'always',
        { cases: ['lower-case'], delimiters: [scopeDelimiter] }
      ],
      // vx-bot/NOTE: validateScopes enforces commas while allowing @ and / in full project names.
      'scope-delimiter-style': [0],
      'scope-empty': [2, 'never'],
      'header-max-length': [2, 'always', 120],
      'subject-case': [2, 'never', []],
      'body-leading-blank': [2, 'always'],
      'footer-leading-blank': [2, 'always'],
      'body-max-length': [2, 'always', 2500],
      'body-max-line-length': [2, 'always', 2500],
      'footer-max-line-length': [2, 'always', 250]
    }
  }
}
