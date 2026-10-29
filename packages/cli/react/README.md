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

## Generators

The first supported library generators are `library` (`lib`) and
`library-react` (`react-lib`). They create package projects based on the
templates in `.vezham/library` and `.vezham/library-react`.

Application generation is split into app, app-cdn, app-doc, and app-start.
They share category and directory options and each has its own template.
The `cdn` category is available only to `app-cdn`, and the `doc` category is
available only to `app-doc`. The other categories are shared across app,
app-start, app-cdn, app-doc, and mock generators.

Choose the generator type first, then category, project name, and an optional
directory group. `app-doc` and `app-cdn` can use a shared category such as `app`
or their dedicated `doc` and `cdn` categories. App folder basenames, Nx names,
and package names match; `--directory` adds grouping without prefixing the name.
`app-doc`, `app-cdn`, and `mock` add `-docs`, `-cdn`, and `-mock` only when
missing from the normalized name. An existing `-doc` ending is also preserved.
All five generators accept `--skipSuffix` to keep a standalone project's supplied
name, for example `app-doc home --category=doc --skipSuffix` creates
`apps-docs/home`. `app` and `app-start` keep their supplied names by default;
enter optional role suffixes such as `-widget` yourself.

Existing project names and output paths are rejected before writing files.
See [Application Types and Categories](../../../vx/handbooks/application-categories.md)
for the category matrix and main-group versus dedicated-group examples.

The `mock` generator creates a standalone mock API project from
`.vezham/app-mock`. It uses the application category folders and names the
generated project `<name>-mock`, preserving an existing `-mock` ending.
`--skipSuffix` keeps the supplied project name.

Both library generators default to `packages/<name>`. `--directory` overrides
the full workspace-relative output path; for example,
`--directory=packages/shared/ui` creates the project at that exact location.
Absolute paths and paths outside the workspace are rejected. The generated npm
package name is `@vezham/<name>`.
Packages default to non-publishable and include `"private": true`; pass
`--publishable` to omit that field for a package intended for npm publishing.

Unfinished generators from the older CLI implementation remain in source
and tests, but are not registered with Nx or listed in CLI help until their
templates are ready.

## Consumer usage

Consumer workspaces provide `nx` and `@nx/devkit` as root development
dependencies, satisfying the CLI package's published peer versions. Both tools
also remain in this repository's root `devDependencies` for development.

After publishing, install at the workspace root:

```sh
pnpm add -Dw @vx-cli/react
pnpm nx list @vx-cli/react
pnpm nx generate @vx-cli/react:init
pnpm nx generate @vx-cli/react:app portal --category=internal --dry-run
pnpm nx generate @vx-cli/react:mock portal --category=internal --dry-run
pnpm nx generate @vx-cli/react:lib utils --publishable --dry-run
pnpm nx generate @vx-cli/react:react-lib button --directory=packages/ui/button --publishable --dry-run
```

The `vx-react` binary forwards generator commands to the installed Nx CLI:

```sh
pnpm exec vx-react app portal --category=internal --dry-run
```

Supports Nx 24.0.2 and compatible Nx 24 versions on Node 24 or later.
The root `pnpm-workspace.yaml` default catalog owns the `@nx/devkit` pin
and Nx range used by the CLI's peer dependencies. Root and CLI manifests reference `catalog:`; the root Nx
installation stays pinned to `24.0.2`. pnpm writes real versions into the packed
npm manifest.
A generator-only package does not require an entry in the `nx.json` plugins
array. `init` preserves existing defaults and plugin registrations. Its
`overrideDefaults` option now configures this plugin's own defaults; it does not
redirect `@nx/react` generators or register an empty task-inference plugin.

## Template updates

- Update plain package files in `src/generators/library/files`.
- Update React package files in `src/generators/library-react/files`.
- Add CDN application files in `src/generators/cdn/files`.
- Add documentation application files in `src/generators/doc/files`.
- Add Start application files in `src/generators/start/files`.
- Update standalone mock API files in `src/generators/mock/files`.
- Keep each generator schema and TypeScript interface aligned.
- Keep generated package output paths workspace-relative, defaulting to
  `packages/<name>`.
- Keep reusable runtime behavior in `@vezham/*` packages.

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

Vite writes published output, including bundled declarations, into `dist`.
Typechecking writes library declarations and compiler state into
`dist/typecheck`, which is excluded from the npm package. This keeps all library
output under `dist` while preventing typechecking from overwriting the published
artifacts. Test compiler output remains in `out-tsc/vitest`.

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
