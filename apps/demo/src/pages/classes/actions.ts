import type {
  NavigationAction,
  NavigationToolbar,
  NavigationViewAction
} from '@vx/react'
import type {
  SectionAction,
  SectionViewAction
} from '@vx/react/layouts/section'
import type { ToolbarActionEvent } from '@vx/react/toolbar-actions'

export const getToolbarActions = (
  toolbar: NavigationToolbar,
  context: Omit<ToolbarActionEvent, 'actionKey'>,
  emit: (event: ToolbarActionEvent) => boolean
) => {
  const bindAction = (action: NavigationAction): SectionAction => ({
    ...action,
    children: action.children?.map(bindAction),
    onAction: () => {
      emit({ ...context, actionKey: action.key })
    }
  })
  const bindViewAction = (action: NavigationViewAction): SectionViewAction => ({
    key: action.key,
    label: action.label,
    icon: action.icon
  })
  return {
    sync: toolbar.sync ?? false,
    filter: toolbar.filter ?? false,
    sort: toolbar.sort ?? false,
    view: toolbar.view
      ?.filter(action => action.enabled !== false)
      .map(bindViewAction),
    menuActions: toolbar.menuActions?.map(bindAction) ?? [],
    primaryAction: toolbar.primaryAction
      ? bindAction(toolbar.primaryAction)
      : undefined
  }
}
