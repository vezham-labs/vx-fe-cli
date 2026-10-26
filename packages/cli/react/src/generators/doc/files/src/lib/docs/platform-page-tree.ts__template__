import type { Item, Node } from '@vezham/docs-core/page-tree'

type Props = {
  docsBase: string
  nodes: Node[]
  prefix: string
}

const matchesPlatform = (node: Item, docsBase: string, prefix: string) => {
  const base = `${docsBase}/`
  if (!node.url.startsWith(base)) return false

  const path = node.url.slice(base.length)
  return path === prefix || path.startsWith(`${prefix}/`)
}

const filterNodes = ({ docsBase, nodes, prefix }: Props): Node[] =>
  nodes.flatMap((node): Node[] => {
    if (node.type === 'page') {
      return matchesPlatform(node, docsBase, prefix) ? [node] : []
    }
    if (node.type !== 'folder') return []

    const children = filterNodes({
      docsBase,
      nodes: node.children,
      prefix
    })
    const index =
      node.index && matchesPlatform(node.index, docsBase, prefix)
        ? node.index
        : undefined

    return children.length || index
      ? [
          {
            ...node,
            defaultOpen: true,
            root: false,
            children,
            index
          }
        ]
      : []
  })

export const filterPlatformPageTree = (props: Props): Node[] => {
  const nodes = filterNodes(props)
  if (nodes.length !== 1 || nodes[0].type !== 'folder') return nodes

  const { children, index } = nodes[0]
  return index?.type === 'page' ? [index, ...children] : children
}
