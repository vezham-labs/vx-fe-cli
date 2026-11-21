# Apple app generator

From the Apple workspace root, run `pnpm vx` and then:

```sh
pnpm nx g @vx-cli/apple:app field-notes --bundlePrefix=com.example
pnpm nx run field-notes:build-ios
pnpm nx run field-notes:build-mac
```

The generator creates `apps/field-notes/`. XcodeGen builds two OS 26+ targets, each with a separate bundle ID. `App/` contains the iPhone and iPad entry point. `Mac/` contains the macOS entry point and is the place for future menu commands or window scenes. Both targets compile `Shared/` for screens, models, and services. The starter renders the app name. The todo example shows how to extend it with offline storage and sync.

Use `--category` to select the workspace folder and Nx tag. Apple accepts the same categories as React’s `app` generator: `app` (default), `showcase`, `suite`, `platform`, `widget`, `pod`, `internal`, and `vezham`. An optional `--directory` groups the app inside that folder. The Nx project name, bundle IDs, and build targets are independent of the grouping.

```sh
pnpm nx g @vx-cli/apple:app field-notes --category=internal --directory=operations/mobile
```

This creates `apps-internals/operations/mobile/field-notes`, tagged `category:internal`. Build it with `pnpm nx run field-notes:build-ios`.

Use `pnpm nx run field-notes:generate` to create the Xcode project for development. Commit the XcodeGen spec and Swift sources. The generated Xcode project is ignored.

The generator source lives in this CLI repository. For an unpublished change, run `pnpm pack` in this directory and install the resulting tarball as a development dependency in the consumer.
