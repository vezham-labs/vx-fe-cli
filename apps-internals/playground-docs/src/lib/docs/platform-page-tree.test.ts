import type { Item, Node } from '@vezham/docs-core/page-tree'

import { filterPlatformPageTree } from './platform-page-tree'

const page = (url: string): Item => ({ type: 'page', name: url, url })
const filter = (nodes: Node[]) =>
  filterPlatformPageTree({ docsBase: '/docs', prefix: 'web', nodes })

describe('platform page tree', () => {
  it('matches the exact platform and descendants within the docs base', () => {
    const index = page('/docs/web')
    const child = page('/docs/web/start')
    expect(
      filter([
        index,
        child,
        page('/docs/webview'),
        page('/docs/native/start'),
        page('/xxxx/web'),
        page('/docsx/web'),
        { type: 'separator', name: 'Other' }
      ])
    ).toEqual([index, child])
  })

  it('prunes empty folders and unwraps a single retained folder without mutating it', () => {
    const index = page('/docs/web')
    const child = page('/docs/web/start')
    const nodes: Node[] = [
      {
        type: 'folder',
        name: 'Web',
        root: true,
        index,
        children: [
          {
            type: 'folder',
            name: 'Guide',
            children: [child, page('/docs/native')]
          },
          { type: 'folder', name: 'Empty', children: [] }
        ]
      },
      { type: 'folder', name: 'Native', children: [page('/docs/native')] }
    ]
    const original = structuredClone(nodes)
    expect(filter(nodes)).toEqual([
      index,
      {
        type: 'folder',
        name: 'Guide',
        defaultOpen: true,
        root: false,
        index: undefined,
        children: [child]
      }
    ])
    expect(nodes).toEqual(original)
  })

  it('retains index-only folders and removes unrelated indexes', () => {
    const index = page('/docs/web')
    expect(
      filter([{ type: 'folder', name: 'Web', index, children: [] }])
    ).toEqual([index])
    const child = page('/docs/web/start')
    expect(
      filter([
        {
          type: 'folder',
          name: 'Web',
          index: page('/docs/native'),
          children: [child]
        }
      ])
    ).toEqual([child])
  })

  it('keeps multiple matching folders and returns an empty tree when none match', () => {
    const nodes: Node[] = ['a', 'b'].map(name => ({
      type: 'folder',
      name,
      children: [page(`/docs/web/${name}`)]
    }))
    expect(filter(nodes)).toHaveLength(2)
    expect(filter([])).toEqual([])
    expect(
      filter([
        {
          type: 'folder',
          name: 'Other',
          index: page('/docs/native'),
          children: []
        }
      ])
    ).toEqual([])
  })
})
