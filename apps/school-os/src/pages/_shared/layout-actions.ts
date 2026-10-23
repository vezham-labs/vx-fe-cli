import { type NavigationAction, getNavigationToolbar } from '@vezham/react'
import type { ToolbarActionEvent } from '@vezham/react/toolbar-actions'

import { navigationItems } from '@generated/navigation'
import type { ActionItem } from '@pages/academic/layout/types'

export const defaultLeftActions: ActionItem[] = [
  {
    key: 'back',
    label: 'Back',
    icon: 'vx:arrow-left',
    onAction: () => window.history.back()
  },
  {
    key: 'forward',
    label: 'Forward',
    icon: 'vx:arrow-right',
    onAction: () => window.history.forward()
  }
]

export const getLayoutRightActions = (
  pathname: string,
  pageKey: string,
  emit: (event: ToolbarActionEvent) => boolean
): ActionItem[] => {
  const toolbar = getNavigationToolbar(navigationItems, pathname)
  const bindAction = (action: NavigationAction): ActionItem => ({
    ...action,
    kind: 'menu',
    children: action.children?.map(bindAction),
    onAction: () => {
      emit({ actionKey: action.key, pageKey, pathname })
    }
  })
  const actions: ActionItem[] = []
  if (toolbar.search)
    actions.push({
      key: 'search',
      label: toolbar.search.label ?? 'Search',
      placeholder: toolbar.search.placeholder,
      icon: 'vx:search',
      kind: 'search'
    })
  actions.push(...(toolbar.menuActions?.map(bindAction) ?? []))
  if (toolbar.sync)
    actions.push({
      key: 'sync',
      label: 'Sync',
      icon: 'vx:refresh',
      kind: 'sync',
      onAction: () => {
        emit({ actionKey: 'sync', pageKey, pathname })
      }
    })
  if (toolbar.primaryAction)
    actions.push({ ...bindAction(toolbar.primaryAction), kind: 'primary' })
  return actions
}
