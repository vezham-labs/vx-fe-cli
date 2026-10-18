import { Outlet, useChildMatches } from '@tanstack/react-router'
import { useMemo, useState } from 'react'

import { toast } from '@vezham/react-v3'

import { getNavigationToolbar } from '@vx/react'
import { SectionLayout } from '@vx/react/layouts/section'
import { useToolbarAction, useToolbarActions } from '@vx/react/toolbar-actions'

import { navigationItems } from '@generated/navigation'

import { getToolbarActions } from './actions'
import { type MenuKey, getNavigationPage } from './navigation'
import { ClassesSearchContext } from './search-context'

type Props = { menuKey: MenuKey }

const ClassesLayout = ({ menuKey }: Props) => {
  // vx-bot/NOTE: Read the mounted child route, not a destination URL from a navigation in progress.
  const pathname = useChildMatches({
    select: matches =>
      [...matches]
        .reverse()
        .find(match => match.pathname.startsWith(`/${menuKey}/`))?.pathname
  })
  return pathname ? (
    <ClassesSection menuKey={menuKey} pathname={pathname} />
  ) : null
}

const ClassesSection = ({
  menuKey,
  pathname
}: Props & { pathname: string }) => {
  const { items, section, page, tabs } = getNavigationPage(menuKey, pathname)

  const [search, setSearch] = useState('')
  const toolbar = getNavigationToolbar(navigationItems, pathname)
  const { emit } = useToolbarActions()
  const actions = getToolbarActions(
    toolbar,
    { pageKey: page.key, pathname },
    emit
  )
  useToolbarAction('sync', () => {
    // vx-bot/TODO: Replace this notice with server synchronization.
    toast.info('Server sync is not implemented yet.')
  })
  useToolbarAction('print', () => window.print())
  useToolbarAction('create', () => {
    toast.info('Create is not implemented on this page.')
  })

  const searchContext = useMemo(
    () => ({ query: search, setQuery: setSearch }),
    [search, setSearch]
  )

  return (
    <ClassesSearchContext.Provider value={searchContext}>
      <SectionLayout
        sectionKey={menuKey === 'tabs' ? menuKey : section.key}
        title={menuKey === 'tabs' ? 'Demo' : section.title}
        navigationLabel={
          menuKey === 'academic' ? 'Academic sections' : 'Workspace sections'
        }
        sidebarItems={menuKey !== 'tabs' ? items : undefined}
        tabs={tabs}
        {...actions}
        onSync={() => {
          emit({ actionKey: 'sync', pageKey: page.key, pathname })
        }}
        search={
          toolbar.search
            ? {
                ...toolbar.search,
                value: search,
                onChange: setSearch
              }
            : undefined
        }>
        <Outlet />
      </SectionLayout>
    </ClassesSearchContext.Provider>
  )
}

export default ClassesLayout
