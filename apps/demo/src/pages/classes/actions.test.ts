import { describe, expect, it, vi } from 'vitest'

import type { NavigationToolbar } from '@vx/react'

import { getToolbarActions } from './actions'

describe('getToolbarActions', () => {
  it('removes only view actions explicitly disabled in navigation metadata', () => {
    const toolbar: NavigationToolbar = {
      filter: true,
      sort: true,
      view: [
        {
          key: 'grid',
          label: 'Grid view',
          icon: 'vx:grid',
          enabled: false
        },
        { key: 'list', label: 'List view', icon: 'vx:list' }
      ]
    }

    expect(
      getToolbarActions(
        toolbar,
        { pageKey: 'classes', pathname: '/classes' },
        vi.fn()
      ).sort
    ).toBe(true)
    expect(
      getToolbarActions(
        toolbar,
        { pageKey: 'classes', pathname: '/classes' },
        vi.fn()
      ).filter
    ).toBe(true)
    expect(
      getToolbarActions(
        toolbar,
        { pageKey: 'classes', pathname: '/classes' },
        vi.fn()
      ).view
    ).toEqual([{ key: 'list', label: 'List view', icon: 'vx:list' }])
  })
})
