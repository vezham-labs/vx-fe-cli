import { type Tree, readNxJson, updateNxJson } from '@nx/devkit'

export const configureGeneratorDefaults = (tree: Tree) => {
  const nxJson = readNxJson(tree) ?? {}
  nxJson.generators ??= {}
  nxJson.generators['@vx-cli/react:application'] = {
    category: 'app',
    cdnHost: 'cdn',
    strict: true,
    ...nxJson.generators['@vx-cli/react:application']
  }
  nxJson.generators['@vx-cli/react:library'] = {
    component: true,
    publishable: false,
    ...nxJson.generators['@vx-cli/react:library']
  }
  updateNxJson(tree, nxJson)
}
