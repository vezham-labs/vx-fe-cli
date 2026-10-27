import { type Tree, getProjects } from '@nx/devkit'

interface ProjectLocation {
  name: string
  root: string
}

export const assertProjectLocationsAvailable = (
  tree: Tree,
  locations: ProjectLocation[]
) => {
  const projects = getProjects(tree)
  for (const { name, root } of locations) {
    const existing = projects.get(name)
    if (existing) {
      throw new Error(
        `Project "${name}" already exists at "${existing.root}". Choose a unique project name.`
      )
    }
    if (tree.exists(root)) {
      throw new Error(
        `The output path "${root}" already exists. Choose an unused project location.`
      )
    }
  }
}
