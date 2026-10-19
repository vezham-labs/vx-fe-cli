import {
  type ReactNode,
  createContext,
  useContext,
  useMemo,
  useState
} from 'react'

import {
  AltArrowLeft,
  AltArrowRight,
  CheckCircle,
  MenuDots,
  SortFromBottomToTop,
  SortFromTopToBottom
} from '@vezham/icons-react'
import { Button, Label, Separator } from '@vezham/react-v3'

import { AppIcon } from '../../components/app-icon'
import { MenuSheet } from '../../components/menu/sheet'
import { type SectionSort, sortDirections, sortFields } from './sort-menu'
import type {
  SectionAction,
  SectionFilterKey,
  SectionViewAction,
  SectionViewMode
} from './toolbar'

type Props = {
  filterAction?: SectionAction
  filterGroups: readonly {
    label: string
    options: readonly { key: SectionFilterKey; label: string; icon: string }[]
  }[]
  menuActions: SectionAction[]
  mobileToolbar?: ReactNode
  onSync: () => void
  onToggleFilter: (filter: SectionFilterKey) => void
  onViewModeChange: (view: SectionViewMode) => void
  selectedFilters: SectionFilterKey[]
  sync: boolean
  sort: boolean
  sortValue: SectionSort
  onSortChange?: (value: SectionSort) => void
  viewModeActions: SectionViewAction[]
}

type MobileToolbarPage = {
  key: string
  title: string
}

type MobileToolbarNavigation = {
  closeSheet: () => void
  page: MobileToolbarPage | null
  openPage: (page: MobileToolbarPage) => void
}

const MobileToolbarNavigationContext =
  createContext<MobileToolbarNavigation | null>(null)

export const useMobileToolbarNavigation = () => {
  const context = useContext(MobileToolbarNavigationContext)

  if (!context)
    throw new Error('Mobile toolbar navigation requires ToolbarMoreSheet')

  return context
}

const actionClass =
  'h-auto min-h-11 w-full justify-start gap-3 rounded-lg px-3 py-2 text-start'

const SheetFilters = ({
  filterGroups,
  selectedFilters,
  onToggleFilter
}: Pick<Props, 'filterGroups' | 'selectedFilters' | 'onToggleFilter'>) => {
  const selectedFilterKeys = new Set(selectedFilters)
  return filterGroups.map((group, index) => (
    <div key={group.label} className="flex flex-col gap-1">
      {index > 0 && <Separator className="my-1" />}
      <Label className="text-muted px-3 pt-2">{group.label}</Label>
      {group.options.map(option => (
        <Button
          key={option.key}
          variant="ghost"
          className={actionClass}
          aria-pressed={selectedFilterKeys.has(option.key)}
          onPress={() => onToggleFilter(option.key)}>
          <AppIcon icon={option.icon} size={18} aria-hidden="true" />
          <span className="flex-1">{option.label}</span>
          {selectedFilterKeys.has(option.key) && (
            <CheckCircle size={18} aria-hidden="true" weight="filled" />
          )}
        </Button>
      ))}
    </div>
  ))
}

const SheetSort = ({
  sortValue,
  onSortChange
}: Pick<Props, 'sortValue' | 'onSortChange'>) => (
  <>
    <Label className="text-muted px-3 pt-2">Sort by</Label>
    {sortFields.map(option => (
      <Button
        key={option.key}
        variant="ghost"
        className={actionClass}
        aria-pressed={sortValue.by === option.key}
        onPress={() => onSortChange?.({ ...sortValue, by: option.key })}>
        <span className="flex-1">{option.label}</span>
        {sortValue.by === option.key && (
          <CheckCircle size={18} aria-hidden="true" weight="filled" />
        )}
      </Button>
    ))}
    <Separator className="my-1" />
    <Label className="text-muted px-3 pt-2">Direction</Label>
    {sortDirections.map(option => (
      <Button
        key={option.key}
        variant="ghost"
        className={actionClass}
        aria-pressed={sortValue.direction === option.key}
        onPress={() => onSortChange?.({ ...sortValue, direction: option.key })}>
        <span className="flex-1">{option.label}</span>
        {sortValue.direction === option.key && (
          <CheckCircle size={18} aria-hidden="true" weight="filled" />
        )}
      </Button>
    ))}
  </>
)

const getHomeSeparators = ({
  sync,
  filterAction,
  sort,
  viewModeActions,
  menuActions,
  mobileToolbar
}: Pick<
  Props,
  | 'sync'
  | 'filterAction'
  | 'sort'
  | 'viewModeActions'
  | 'menuActions'
  | 'mobileToolbar'
>) => ({
  afterMobile: Boolean(
    mobileToolbar &&
    (sync ||
      filterAction ||
      sort ||
      viewModeActions.length > 0 ||
      menuActions.length > 0)
  ),
  beforeView: Boolean((filterAction || sort) && viewModeActions.length > 0),
  beforeMenu: Boolean(
    menuActions.length > 0 &&
    (sync || filterAction || sort || viewModeActions.length > 0)
  )
})

const SheetHome = ({
  sync,
  onSync,
  filterAction,
  sort,
  sortValue,
  viewModeActions,
  onViewModeChange,
  menuActions,
  mobileToolbar,
  setPage,
  renderActions
}: Pick<
  Props,
  | 'sync'
  | 'onSync'
  | 'filterAction'
  | 'sort'
  | 'sortValue'
  | 'viewModeActions'
  | 'onViewModeChange'
  | 'menuActions'
  | 'mobileToolbar'
> & {
  setPage: (page: 'home' | 'filter' | 'sort') => void
  renderActions: (actions: SectionAction[]) => ReactNode
}) => {
  const separators = getHomeSeparators({
    sync,
    filterAction,
    sort,
    viewModeActions,
    menuActions,
    mobileToolbar
  })
  return (
    <>
      {mobileToolbar}
      {separators.afterMobile && <Separator className="my-1" />}
      {sync &&
        renderActions([
          {
            key: 'sync',
            label: 'Sync',
            icon: 'vx:refresh',
            onAction: onSync
          }
        ])}
      {filterAction && (
        <Button
          variant="ghost"
          className={actionClass}
          onPress={() => setPage('filter')}>
          <AppIcon icon={filterAction.icon} size={18} aria-hidden="true" />
          <span className="flex-1">Filter</span>
          <AltArrowRight size={18} aria-hidden="true" />
        </Button>
      )}
      {sort && (
        <Button
          variant="ghost"
          className={actionClass}
          onPress={() => setPage('sort')}>
          {sortValue.direction === 'ascending' ? (
            <SortFromBottomToTop size={18} aria-hidden="true" />
          ) : (
            <SortFromTopToBottom size={18} aria-hidden="true" />
          )}
          <span className="flex-1">Sort</span>
          <AltArrowRight size={18} aria-hidden="true" />
        </Button>
      )}
      {separators.beforeView && <Separator className="my-1" />}
      {renderActions(
        viewModeActions.map(action => ({
          ...action,
          onAction: () => onViewModeChange(action.key)
        }))
      )}
      {separators.beforeMenu && <Separator className="my-1" />}
      {renderActions(menuActions)}
    </>
  )
}

const SheetActions = ({
  actions,
  path,
  setPath,
  run
}: {
  actions: SectionAction[]
  path: SectionAction[]
  setPath: (path: SectionAction[]) => void
  run: (action?: () => void) => void
}) =>
  actions.map(action => (
    <Button
      key={action.key}
      variant="ghost"
      className={actionClass}
      onPress={() =>
        action.children?.length
          ? setPath([...path, action])
          : run(action.onAction)
      }>
      <AppIcon icon={action.icon} size={18} aria-hidden="true" />
      <span className="flex-1">{action.label}</span>
      {Boolean(action.children?.length) && (
        <AltArrowRight size={18} aria-hidden="true" />
      )}
    </Button>
  ))

const getSheetTitle = (
  mobilePage: MobileToolbarPage | null,
  page: string,
  current?: SectionAction
) => {
  if (mobilePage) return mobilePage.title
  if (page === 'filter') return 'Filter'
  if (page === 'sort') return 'Sort'
  return current?.label ?? 'More'
}

export const ToolbarMoreSheet = ({
  filterAction,
  filterGroups,
  menuActions,
  mobileToolbar,
  onSync,
  onToggleFilter,
  onViewModeChange,
  selectedFilters,
  sync,
  sort,
  sortValue,
  onSortChange,
  viewModeActions
}: Props) => {
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState<'home' | 'filter' | 'sort'>('home')
  const [path, setPath] = useState<SectionAction[]>([])
  const [mobilePage, setMobilePage] = useState<MobileToolbarPage | null>(null)
  const changeOpen = (value: boolean) => {
    setOpen(value)
    if (!value) {
      setPage('home')
      setPath([])
      setMobilePage(null)
    }
  }
  const run = (action?: () => void) => {
    changeOpen(false)
    action?.()
  }
  const current = path[path.length - 1]
  const title = getSheetTitle(mobilePage, page, current)
  const mobileToolbarNavigation = useMemo(
    () => ({
      closeSheet: () => changeOpen(false),
      page: mobilePage,
      openPage: (nextPage: MobileToolbarPage) => {
        setMobilePage(nextPage)
        setPage('home')
        setPath([])
      }
    }),
    [mobilePage]
  )
  const renderActions = (actions: SectionAction[]) => (
    <SheetActions actions={actions} path={path} setPath={setPath} run={run} />
  )
  return (
    <MobileToolbarNavigationContext.Provider value={mobileToolbarNavigation}>
      <MenuSheet
        title="Toolbar actions"
        hideTitle
        isOpen={open}
        onOpenChange={changeOpen}
        trigger={
          <Button
            isIconOnly
            variant="ghost"
            aria-label="More"
            className="h-9 w-9 min-w-9 rounded-full p-0">
            <MenuDots className="rotate-90" size={18} aria-hidden="true" />
          </Button>
        }>
        <div
          key={`${page}:${mobilePage?.key ?? ''}:${path
            .map(action => action.key)
            .join(':')}`}
          className="flex flex-col gap-1">
          {(page !== 'home' || current || mobilePage) && (
            <Button
              variant="ghost"
              className={actionClass}
              aria-label="Back to toolbar actions"
              onPress={() => {
                if (mobilePage) setMobilePage(null)
                else if (current) setPath(path.slice(0, -1))
                else setPage('home')
              }}>
              <AltArrowLeft size={18} aria-hidden="true" />
              {title}
            </Button>
          )}
          {mobilePage ? (
            mobileToolbar
          ) : page === 'filter' ? (
            <SheetFilters
              filterGroups={filterGroups}
              selectedFilters={selectedFilters}
              onToggleFilter={onToggleFilter}
            />
          ) : page === 'sort' ? (
            <SheetSort sortValue={sortValue} onSortChange={onSortChange} />
          ) : current ? (
            renderActions(current.children ?? [])
          ) : (
            <SheetHome
              sync={sync}
              onSync={onSync}
              filterAction={filterAction}
              sort={sort}
              sortValue={sortValue}
              viewModeActions={viewModeActions}
              onViewModeChange={onViewModeChange}
              menuActions={menuActions}
              mobileToolbar={mobileToolbar}
              setPage={setPage}
              renderActions={renderActions}
            />
          )}
        </div>
      </MenuSheet>
    </MobileToolbarNavigationContext.Provider>
  )
}
