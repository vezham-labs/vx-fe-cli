import { useCallback, useMemo } from 'react'

import {
  AltArrowDown as AltArrowDownIcon,
  ArrowRightUp as ArrowRightUpIcon,
  Copy as CopyIcon,
  Link as LinkIcon,
  SortVertical as SortVerticalIcon
} from '@vezham/icons-react'
import {
  Button,
  Drawer,
  Dropdown,
  type SortDescriptor,
  Surface,
  Tooltip
} from '@vezham/react-v3'
import { useToolbarAction } from '@vezham/react/toolbar-actions'

import { copyRecordValue } from '@pages/_shared/clipboard'
import { PageDateRangeDropdown } from '@pages/_shared/date-range-dropdown'
import { DrawerEditAction } from '@pages/_shared/drawer-edit-action'
import { DrawerToggle } from '@pages/_shared/drawer-toggle'
import { RecordDrawerBody } from '@pages/_shared/record-drawer-body'
import { RecordDrawerFooter } from '@pages/_shared/record-drawer-footer'
import { RecordDrawerFrame } from '@pages/_shared/record-drawer-frame'
import { RecordDrawerNavigation } from '@pages/_shared/record-drawer-navigation'
import { RecordFilterDropdown as FilterDropdown } from '@pages/_shared/record-filter-dropdown'
import { createRecordRowActions } from '@pages/_shared/record-row-actions'
import { saveExistingRecordRow } from '@pages/_shared/record-row-update'
import { RecordSearchField } from '@pages/_shared/record-search-field'
import {
  RecordPersonCell,
  RecordTableEmptyState
} from '@pages/_shared/record-table-cells'
import { RecordTableHeader } from '@pages/_shared/record-table-header'
import { RecordTableShell } from '@pages/_shared/record-table-shell'
import { RecordToastLayer } from '@pages/_shared/record-toast-layer'
import { RowCountControl } from '@pages/_shared/row-count-control'
import {
  filterRecordRows,
  getRecordDrawerTitle as getDrawerTitle,
  getPresetDateRange,
  getRecordSearchText,
  getRecordSortValue,
  isPersonValue,
  recordRowToForm,
  sortRecordRows
} from '@pages/_shared/table-utils'
import {
  useRecordDrawerToggle,
  useRecordRowNavigation,
  useRecordTableInteractions
} from '@pages/_shared/use-record-interactions'
import { useRecordTableState } from '@pages/_shared/use-record-table-state'
import { useRecordTableViewState } from '@pages/_shared/use-record-table-view-state'
import { dateOptions } from '@src/utils/date-options'

import type {
  DrawerMode,
  FilterDraft,
  OperationColumn,
  OperationPageConfig,
  OperationRow,
  OperationStatus
} from './types'
import { useDisclosure } from './types'
import { classNames, getTableRowClassName } from './variant'

const getSearchText = (value: unknown) => getRecordSearchText(value, true)
const getSortValue = getRecordSortValue
const rowToForm = recordRowToForm

const rowCountOptions = ['10', '25', '50']

const useOperationsTableModel = (config: OperationPageConfig) => {
  const sectionTitle = getOperationSectionTitle(config)
  const pageSubtitle = getOperationPageSubtitle(config)
  const state = useRecordTableState(config, useDisclosure, 'view' as DrawerMode)
  const { drawer, setActiveRowId, setForm, setMode } = state

  const activeDateRange = useMemo(() => {
    if (state.datePreset === 'custom') {
      return state.customDateRange
    }

    return getPresetDateRange(state.datePreset)
  }, [state.customDateRange, state.datePreset])
  const sortOptions = useMemo(() => getSortOptions(config), [config])
  const editableColumns = useMemo(
    () => config.columns.filter(column => column.type !== 'button'),
    [config.columns]
  )
  const tableColumns = useMemo(
    () => config.columns.filter(column => column.type !== 'button'),
    [config.columns]
  )

  const filteredRows = useMemo(
    () =>
      filterRecordRows(
        state.data,
        config.columns,
        config.filters,
        state.filters,
        activeDateRange,
        state.searchQuery,
        getSearchText,
        getSortValue
      ),
    [
      activeDateRange,
      config.columns,
      config.filters,
      state.data,
      state.filters,
      state.searchQuery
    ]
  )

  const sortedRows = useMemo(
    () =>
      sortRecordRows(filteredRows, state.sortDescriptor, getSortValue, true),
    [filteredRows, state.sortDescriptor]
  )

  const view = useRecordTableViewState({
    activeRowId: state.activeRowId,
    customDateRange: state.customDateRange,
    data: state.data,
    datePreset: state.datePreset,
    page: state.page,
    rowsPerPage: state.rowsPerPage,
    selectedRowKeys: state.selectedRowKeys,
    sortDescriptor: state.sortDescriptor,
    sortOptions: sortOptions,
    sortedRows
  })

  const openDrawer = useCallback(
    (nextMode: DrawerMode, row?: OperationRow) => {
      setMode(nextMode)

      if (row) {
        setActiveRowId(row.id)
        setForm(rowToForm(row, editableColumns))
      } else {
        setActiveRowId(null)
        setForm(createEmptyForm(editableColumns))
      }

      drawer.onOpen()
    },
    [drawer, editableColumns, setActiveRowId, setForm, setMode]
  )

  const closeDrawer = useCallback(() => {
    drawer.onClose()
    setActiveRowId(null)
    setMode('view')
  }, [drawer, setActiveRowId, setMode])

  const toggleDrawer = useRecordDrawerToggle({
    isOpen: state.drawer.isOpen,
    closeDrawer,
    selectedRowKeys: state.selectedRowKeys,
    sortedRows: sortedRows,
    onSelected: row => openDrawer('view', row),
    onEmpty: () => openDrawer('create')
  })

  const goToRowAt = useCallback(
    (index: number) => {
      const nextRow = sortedRows[index]

      if (!nextRow) {
        return
      }

      openDrawer(state.mode === 'create' ? 'view' : state.mode, nextRow)
    },
    [state.mode, openDrawer, sortedRows]
  )

  const { goToNextRow, goToPreviousRow } = useRecordRowNavigation(
    view.selectedRowIndex,
    sortedRows.length,
    goToRowAt
  )

  useToolbarAction('create', () => openDrawer('create'), {
    pageKey: config.key
  })

  useRecordTableInteractions({
    activeRowId: state.activeRowId,
    currentPage: view.currentPage,
    drawerOpen: state.drawer.isOpen,
    enableRowHotkeys: state.mode !== 'create',
    goToNextRow,
    goToPreviousRow,
    pageSize: view.pageSize,
    rowAttribute: 'data-operation-row-id',
    rows: sortedRows,
    setPage: state.setPage,
    setToast: state.setToast,
    toast: state.toast,
    toggleDrawer
  })

  const saveRow = () => {
    if (state.mode === 'create') {
      const nextRow = formToNewRow(
        state.form,
        editableColumns,
        state.data.length + 1
      )

      state.setData(current => [nextRow, ...current])
      state.setToast({
        message: `${config.pageTitle} added`,
        status: 'success'
      })
      closeDrawer()
      return
    }

    const updatedRow = saveExistingRecordRow({
      selectedRow: view.selectedRow,
      form: state.form,
      columns: editableColumns,
      toRow: formToRow,
      setData: state.setData,
      setActiveRowId: state.setActiveRowId,
      setForm: state.setForm,
      formFromRow: row => rowToForm(row, editableColumns),
      setMode: state.setMode
    })
    if (!updatedRow) return
    state.setToast({
      message: `${config.pageTitle} updated`,
      status: 'success'
    })
  }

  const deleteRow = (rowId: string) => {
    state.setData(current => current.filter(row => row.id !== rowId))
    state.setToast({ message: 'Item deleted', status: 'success' })

    if (state.activeRowId === rowId) {
      closeDrawer()
    }
  }

  const getRowUrl = (row: OperationRow) => {
    const url = new URL(window.location.href)

    url.searchParams.set('id', row.id)
    url.hash = ''

    return url.toString()
  }

  const copyRowLink = (row: OperationRow) => {
    copyRecordValue(getRowUrl(row), 'URL', state.setToast)
  }

  const copyRowId = (row: OperationRow) => {
    copyRecordValue(getDrawerTitle(row), 'ID', state.setToast)
  }

  const openRowPage = (row: OperationRow) => {
    window.open(getRowUrl(row), '_blank', 'noopener,noreferrer')
  }

  return (
    <section className={classNames.page}>
      <Surface className={classNames.toolbar}>
        <div className={classNames.toolbarTop}>
          <div className={classNames.toolbarHead}>
            <h1 className={classNames.title}>{sectionTitle}</h1>
            <p className={classNames.mutedText}>{pageSubtitle}</p>
          </div>

          <div className={classNames.toolbarActions}>
            <PageDateRangeDropdown
              activeDateLabel={view.activeDateLabel}
              ariaLabel={`${config.pageTitle} custom date range`}
              classes={classNames}
              closeCustomOnDismiss
              dateOptions={dateOptions}
              datePreset={state.datePreset}
              isCustomDateRangeOpen={state.isCustomDateRangeOpen}
              isDateDropdownOpen={state.isDateDropdownOpen}
              onCustomDateRangeChange={state.updateCustomDateRange}
              onCustomDateRangeOpenChange={state.setIsCustomDateRangeOpen}
              onDateDropdownOpenChange={state.setIsDateDropdownOpen}
              onDatePresetChange={state.updateDatePreset}
            />

            <FilterDropdown
              classes={classNames}
              showChevron
              draftFilters={state.draftFilters}
              filters={config.filters}
              setDraftFilters={state.setDraftFilters}
              onApply={() => {
                state.setFilters(state.draftFilters)
                state.setPage(1)
              }}
              onReset={() => {
                state.setDraftFilters(state.emptyFilters)
                state.setFilters(state.emptyFilters)
                state.setPage(1)
              }}
            />

            <Dropdown>
              <Dropdown.Trigger>
                <Button variant="outline">
                  <SortVerticalIcon size={16} aria-hidden="true" />
                  Sort by {view.activeSortLabel}
                  <AltArrowDownIcon size={16} aria-hidden="true" />
                </Button>
              </Dropdown.Trigger>
              <Dropdown.Popover>
                <Dropdown.Menu aria-label={`Sort ${config.pageTitle}`}>
                  {sortOptions.map(option => (
                    <Dropdown.Item
                      key={option.key}
                      id={option.key}
                      textValue={option.label}
                      onPress={() => {
                        state.setSortDescriptor(option.descriptor)
                        state.setPage(1)
                      }}>
                      {option.label}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          </div>
        </div>

        <div className={classNames.controlsRow}>
          <RowCountControl
            className={classNames.rowsControls}
            options={rowCountOptions}
            value={state.rowsPerPage}
            onChange={value => {
              state.setRowsPerPage(value)
              state.setPage(1)
            }}
          />

          <RecordSearchField
            title={config.pageTitle}
            value={state.searchQuery}
            onChange={value => {
              state.setSearchQuery(value)
              state.setPage(1)
            }}
          />
        </div>
      </Surface>

      <RecordTableShell
        contentProps={{
          'aria-label': config.ariaLabel,
          className: classNames.tableContent,
          selectedKeys: view.tableSelectedKeys,
          selectionMode: 'multiple',
          sortDescriptor: state.sortDescriptor,
          style: { minWidth: config.tableMinWidth },
          onSelectionChange: state.setSelectedRowKeys,
          onSortChange: descriptor => {
            state.setSortDescriptor(descriptor)
            state.setPage(1)
          }
        }}
        header={
          <RecordTableHeader
            columns={tableColumns}
            selectionColumnClassName={classNames.selectionColumn}
            actionLabel="Action"
            renderHeader={(columnLabel, sortDirection) => (
              <SortableHeader sortDirection={sortDirection}>
                {columnLabel}
              </SortableHeader>
            )}
          />
        }
        bodyProps={{
          activeRowId: state.activeRowId,
          classes: classNames,
          columns: tableColumns,
          emptyState: <TableEmptyState />,
          getRowClassName: getTableRowClassName,
          rowDataAttribute: 'data-operation-row-id',
          rows: view.paginatedRows,
          renderCell: (row, column) => (
            <OperationCell
              column={column}
              row={row}
              onAction={() => openDrawer('view', row)}
            />
          ),
          ...createRecordRowActions<OperationRow>(deleteRow, openDrawer)
        }}
        paginationProps={{
          className: classNames.paginationFooter,
          currentPage: view.currentPage,
          pageSize: view.pageSize,
          totalItems: sortedRows.length,
          totalPages: view.totalPages,
          onPageChange: state.setPage
        }}
      />

      <OperationsDrawer
        columns={editableColumns}
        drawerState={state.drawer}
        form={state.form}
        mode={state.mode}
        row={view.selectedRow}
        title={config.pageTitle}
        canGoNext={
          view.selectedRowIndex >= 0 &&
          view.selectedRowIndex < sortedRows.length - 1
        }
        canGoPrevious={view.selectedRowIndex > 0}
        onCancel={closeDrawer}
        onClose={closeDrawer}
        onEdit={() => state.setMode('edit')}
        onFormChange={(field, value) =>
          state.setForm(current => ({ ...current, [field]: value }))
        }
        onGoNext={goToNextRow}
        onGoPrevious={goToPreviousRow}
        onCopyId={copyRowId}
        onCopyLink={copyRowLink}
        onOpenPage={openRowPage}
        onSave={saveRow}
      />

      <RecordToastLayer
        className={classNames.toast}
        toast={state.toast}
        onClose={() => state.setToast(null)}
      />
    </section>
  )
}

const OperationsTablePage = ({ config }: { config: OperationPageConfig }) =>
  useOperationsTableModel(config)

export default OperationsTablePage

function OperationCell({
  column,
  row,
  onAction
}: {
  column: OperationColumn
  row: OperationRow
  onAction: () => void
}) {
  const value = row[column.key]

  if (column.type === 'person') return <PersonCell value={value} />
  if (column.type === 'link') {
    return <span className={classNames.link}>{String(value)}</span>
  }
  if (column.type === 'status') {
    return <StatusChip status={String(value) as OperationStatus} />
  }
  if (column.type === 'badge') return <Badge value={String(value)} />
  if (column.type === 'button') {
    return (
      <Button
        className={classNames.actionButton}
        variant="secondary"
        onPress={onAction}>
        {String(value)}
      </Button>
    )
  }
  if (column.type === 'code') {
    return <span className={classNames.code}>{String(value)}</span>
  }

  return <span>{String(value ?? '')}</span>
}

function PersonCell({ value }: { value: unknown }) {
  return (
    <RecordPersonCell
      value={value}
      secondaryKey="subtitle"
      classes={{
        personCell: classNames.personCell,
        personAvatar: classNames.personAvatar,
        personText: classNames.personText,
        personName: classNames.personName,
        personSecondary: classNames.personSubtitle
      }}
    />
  )
}

function StatusChip({ status }: { status: OperationStatus }) {
  const isPositive = status === 'Active' || status === 'Paid'
  const color = isPositive ? '#56bf3b' : '#ef4860'

  return (
    <span
      className={classNames.statusText}
      style={{ backgroundColor: isPositive ? '#eef9ec' : '#fdecef', color }}>
      <span
        className={classNames.statusDot}
        style={{ backgroundColor: color }}
      />
      {status}
    </span>
  )
}

function Badge({ value }: { value: string }) {
  const color =
    value === 'Fixed'
      ? ['#fdecef', '#ef4860']
      : value === 'Percentage'
        ? ['#eaf2ff', '#2f6fe4']
        : ['#fff7df', '#d89b10']

  return (
    <span
      className={classNames.badge}
      style={{ backgroundColor: color[0], color: color[1] }}>
      {value}
    </span>
  )
}

function SortableHeader({
  children,
  sortDirection
}: {
  children: string
  sortDirection?: 'ascending' | 'descending'
}) {
  return (
    <span className={classNames.sortableHeader}>
      {children}
      {sortDirection && <SortVerticalIcon size={12} aria-hidden="true" />}
    </span>
  )
}

function TableEmptyState() {
  return <RecordTableEmptyState classes={classNames} />
}

function OperationsDrawer({
  columns,
  drawerState,
  form,
  mode,
  row,
  title,
  canGoNext,
  canGoPrevious,
  onCancel,
  onClose,
  onEdit,
  onFormChange,
  onGoNext,
  onGoPrevious,
  onCopyId,
  onCopyLink,
  onOpenPage,
  onSave
}: {
  columns: OperationColumn[]
  drawerState: ReturnType<typeof useDisclosure>
  form: FilterDraft
  mode: DrawerMode
  row: OperationRow | null
  title: string
  canGoNext: boolean
  canGoPrevious: boolean
  onCancel: () => void
  onClose: () => void
  onEdit: () => void
  onFormChange: (field: string, value: string) => void
  onGoNext: () => void
  onGoPrevious: () => void
  onCopyId: (row: OperationRow) => void
  onCopyLink: (row: OperationRow) => void
  onOpenPage: (row: OperationRow) => void
  onSave: () => void
}) {
  const isFormMode = mode === 'edit' || mode === 'create'
  const showRecordActions = Boolean(row && mode !== 'create')
  const drawerTitle =
    mode === 'create' ? `Add ${title}` : row ? getDrawerTitle(row) : title

  return (
    <RecordDrawerFrame state={drawerState} className={classNames.drawerDialog}>
      <Drawer.Header className={classNames.drawerHeader}>
        <div className={classNames.drawerHeaderRow}>
          <div className={classNames.drawerTitleGroup}>
            <DrawerToggle onPress={onClose} />
            <span className={classNames.drawerTitle}>{drawerTitle}</span>
            {row && mode !== 'create' ? (
              <Tooltip delay={0}>
                <Tooltip.Trigger>
                  <Button
                    isIconOnly
                    aria-label={`Copy ID ${drawerTitle}`}
                    variant="ghost"
                    onPress={() => onCopyId(row)}>
                    <CopyIcon size={16} aria-hidden="true" />
                  </Button>
                </Tooltip.Trigger>
                <Tooltip.Content>Copy</Tooltip.Content>
              </Tooltip>
            ) : null}
          </div>
          <div className={classNames.drawerActions}>
            {showRecordActions ? (
              <>
                <Tooltip delay={0}>
                  <Tooltip.Trigger>
                    <Button
                      isIconOnly
                      aria-label={`Copy URL for ${drawerTitle}`}
                      variant="secondary"
                      onPress={() => row && onCopyLink(row)}>
                      <LinkIcon size={16} aria-hidden="true" />
                    </Button>
                  </Tooltip.Trigger>
                  <Tooltip.Content>Copy clipboard</Tooltip.Content>
                </Tooltip>
                <DrawerEditAction
                  ariaLabel={`Edit ${drawerTitle}`}
                  onPress={onEdit}
                />
                <Tooltip delay={0}>
                  <Tooltip.Trigger>
                    <Button
                      isIconOnly
                      aria-label={`Open ${drawerTitle}`}
                      variant="secondary"
                      onPress={() => row && onOpenPage(row)}>
                      <ArrowRightUpIcon size={16} aria-hidden="true" />
                    </Button>
                  </Tooltip.Trigger>
                  <Tooltip.Content>Open ↗</Tooltip.Content>
                </Tooltip>
              </>
            ) : null}
            {showRecordActions && (
              <RecordDrawerNavigation
                canGoNext={canGoNext}
                canGoPrevious={canGoPrevious}
                variant="secondary"
                onGoNext={onGoNext}
                onGoPrevious={onGoPrevious}
              />
            )}
          </div>
        </div>
      </Drawer.Header>
      <Drawer.Body className={classNames.drawerBody}>
        <RecordDrawerBody
          isFormMode={isFormMode}
          columns={columns}
          classes={classNames}
          form={form}
          row={row}
          renderCell={(item, column) => (
            <OperationCell
              column={column}
              row={item}
              onAction={() => undefined}
            />
          )}
          onFormChange={onFormChange}
        />
      </Drawer.Body>
      <Drawer.Footer className={classNames.drawerFooter}>
        <RecordDrawerFooter
          isFormMode={isFormMode}
          isCreateMode={mode === 'create'}
          formActionsClassName={classNames.drawerFormFooterActions}
          viewActionsClassName={classNames.drawerViewFooterActions}
          flexOneClassName={classNames.flexOne}
          onCancel={onCancel}
          onClose={onClose}
          onEdit={onEdit}
          onSave={onSave}
        />
      </Drawer.Footer>
    </RecordDrawerFrame>
  )
}

function getOperationSectionTitle(config: OperationPageConfig) {
  if (operationSectionTitles[config.key]) {
    return operationSectionTitles[config.key]
  }

  return config.title
}

function getOperationPageSubtitle(config: OperationPageConfig) {
  if (operationPageSubtitles[config.key]) {
    return operationPageSubtitles[config.key]
  }

  return config.pageTitle
}

const operationSectionTitles: Record<string, string> = {
  'fees-group': 'Fees Collection',
  'fees-type': 'Fees Collection',
  'fees-master': 'Fees Collection',
  'fees-assign': 'Fees Collection',
  'collect-fees': 'Fees Collection',
  members: 'Library',
  books: 'Library',
  'issue-book': 'Library',
  return: 'Library',
  'hostel-list': 'Hostel',
  'hostel-room': 'Hostel',
  'room-type': 'Hostel',
  routes: 'Transport',
  'pickup-points': 'Transport',
  'vehicle-drivers': 'Transport',
  vehicles: 'Transport',
  assign: 'Transport'
}

const operationPageSubtitles: Record<string, string> = {
  'fees-group': 'Fees Group',
  'fees-type': 'Fees Type',
  'fees-master': 'Fees Master',
  'fees-assign': 'Fees Assign',
  'collect-fees': 'Collect Fees',
  members: 'Library Members',
  books: 'Books',
  'issue-book': 'Issue Books',
  return: 'Return Books',
  sports: 'Sports',
  players: 'Players',
  'hostel-list': 'Hostel List',
  'hostel-room': 'Hostel Room',
  'room-type': 'Room Type',
  routes: 'Routes',
  'pickup-points': 'Pickup Points',
  'vehicle-drivers': 'Drivers',
  vehicles: 'Vehicles',
  assign: 'Assign Vehicles'
}

function createEmptyForm(columns: OperationColumn[]): FilterDraft {
  return columns.reduce<FilterDraft>((draft, column) => {
    draft[column.key] = ''
    return draft
  }, {})
}

function formToRow(
  row: OperationRow,
  form: FilterDraft,
  columns: OperationColumn[]
) {
  return columns.reduce<OperationRow>(
    (draft, column) => {
      const original = row[column.key]
      const value = form[column.key] ?? ''

      draft[column.key] =
        typeof original === 'number'
          ? Number(value)
          : isPersonValue(original)
            ? { ...original, name: value }
            : value

      return draft
    },
    { ...row }
  )
}

function formToNewRow(
  form: FilterDraft,
  columns: OperationColumn[],
  index: number
) {
  const row: OperationRow = {
    id: `operation-${Date.now()}`,
    createdAt: '2026-05-11'
  }

  columns.forEach(column => {
    row[column.key] =
      form[column.key] || (column.type === 'status' ? 'Active' : `New ${index}`)
  })

  return row
}

function getSortOptions(config: OperationPageConfig) {
  return [
    {
      key: 'ascending',
      label: 'Ascending',
      descriptor: {
        column: config.initialSort.column,
        direction: 'ascending'
      } satisfies SortDescriptor
    },
    {
      key: 'descending',
      label: 'Descending',
      descriptor: {
        column: config.initialSort.column,
        direction: 'descending'
      } satisfies SortDescriptor
    },
    {
      key: 'recentlyViewed',
      label: 'Recently Viewed',
      descriptor: {
        column: 'createdAt',
        direction: 'ascending'
      } satisfies SortDescriptor
    },
    {
      key: 'recentlyAdded',
      label: 'Recently Added',
      descriptor: {
        column: 'createdAt',
        direction: 'descending'
      } satisfies SortDescriptor
    }
  ]
}
