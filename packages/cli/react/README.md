<p align="center">
  <a href="https://vezham.com" target="_blank" rel="noreferrer">
      <picture>
        <source media="(prefers-color-scheme: dark)" srcset="https://static.cdn.vezham.com/images/logo-white.png">
        <img src="https://static.cdn.vezham.com/images/logo-black.png" width="20%" alt="vezham">
      </picture>
      <h3 align="center">Vezham</h3>
  </a>
</p>
<hr>

# @vx-cli/react

### Getting Started

Nx plugin for Vezham frontend generators, published as an npm package.

## Legacy baseline

The generator implementations, schemas, aliases, and available template files are
synced from the [previous implementation](https://github.com/vezham/vx-fe-pkgs-cli/tree/timeline/packages/cli/react).
The package uses the current Nx 23 build, lint, Node test setup, and npm packaging.
Templates retain the old application format; replacing them with the new format
is the next phase. Generated projects may still reference legacy `@vx/*` packages
and Nx executors from the reference workspace. Generation and packaging are tested;
modern application builds are not part of this baseline sync.

| Generator         | Aliases      | Template status                                                  |
| ----------------- | ------------ | ---------------------------------------------------------------- |
| `application`     | `app`        | Old app, Playwright, and optional mock-server templates included |
| `library`         | `lib`        | Old library templates included                                   |
| `init`            |              | Configures this plugin's recommended defaults                    |
| `common`          |              | No template files in the old reference                           |
| `component`       | `comp`       | No template files in the old reference                           |
| `component-store` | `comp-store` | No template files in the old reference                           |
| `core`            |              | No template files in the old reference                           |
| `hook`            |              | No template files in the old reference                           |
| `layout`          |              | No template files in the old reference                           |
| `template`        |              | No template files in the old reference                           |
| `utilities`       | `utils`      | No template files in the old reference                           |

Generators without template files report the missing directory before changing
the workspace. Their implementations and schemas are retained for later updates.

## Consumer usage

After publishing, install at the workspace root:

```sh
pnpm add -Dw @vx-cli/react
pnpm nx list @vx-cli/react
pnpm nx generate @vx-cli/react:init
pnpm nx generate @vx-cli/react:app portal --category=internal --dry-run
pnpm nx generate @vx-cli/react:lib buttons --directory=ui --dry-run
```

The `vx-react` binary forwards generator commands to the installed Nx CLI:

```sh
pnpm exec vx-react app portal --category=internal --dry-run
```

Supports Nx 23.2.1 and compatible Nx 23 versions on Node 24 or later.
A generator-only package does not require an entry in the `nx.json` plugins
array. `init` preserves existing defaults and plugin registrations. Its
`overrideDefaults` option now configures this plugin's own defaults; it does not
redirect `@nx/react` generators or register an empty task-inference plugin.

## Template updates

- Replace app files in `src/generators/application/files`.
- Update Playwright and mock-server companions in `files-e2e-playwright` and
  `files-mock-server` under the application generator.
- Replace shared library files in `src/generators/library/files`.
- Supply a `files` directory for each specialized generator before using it.
- Keep schemas and their TypeScript interfaces aligned with template options.
- Keep reusable runtime behavior in `@vezham/*` packages in the new format.

Factories use named exports registered in `generators.json`. The TypeScript
build emits ES modules to `dist` and copies schemas and template assets alongside
the compiled factories. Existing generator names and aliases are preserved.

## Development

```sh
pnpm nx build @vx-cli/react
pnpm nx test @vx-cli/react
pnpm nx lint @vx-cli/react
pnpm nx typecheck @vx-cli/react
```

Tests cover app/library rendering, init idempotence, missing-template behavior,
and generation from an extracted npm tarball with its dependencies linked in.
They verify entry points, schemas, templates, the CLI binary, documentation, and
the root license. A package-local license copy is unnecessary.

## Publishing

The existing workspace release runner builds and versions the package, updates
the changelog, and uses Nx's inferred npm publish target. `publishConfig.access`
is public. Publishing requires npm authorization for the `@vx-cli` scope.

```sh
pnpm nx build @vx-cli/react
pnpm --dir packages/cli/react pack --pack-destination ../../../test-output/packages
```

Nothing is published as part of the baseline sync.

## ES module output

The package uses `type: module` and TypeScript NodeNext resolution. Relative
source imports use `.ts` specifiers so Nx can load local source directly.
`rewriteRelativeImportExtensions` emits `.js` specifiers for the published output.
Generator asset paths use `import.meta.dirname`. The CLI resolves Nx with
`import.meta.resolve`. No CommonJS build is published.
