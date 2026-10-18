import {
  AltArrowDown,
  AltArrowRight,
  CheckCircle,
  Filter,
  SliderVertical,
  Sort
} from '@vezham/icons-react'
import {
  Button,
  Dropdown,
  Label,
  ListBox,
  Select,
  Separator,
  type SortDescriptor,
  Surface,
  Tooltip,
  useMediaQuery
} from '@vezham/react-v3'

import { useMobileToolbarNavigation } from '@vx/react/layouts/section'

import { classColumnOptions, classStatusOptions, sortOptions } from './data'
import type { ClassColumnKey, ClassFilters, ClassStatus } from './types'

const headerActionClassName = 'h-9 w-9 min-w-9 shrink-0 rounded-full p-0'
const mobileActionClassName =
  'flex h-auto min-h-11 w-full items-center justify-start gap-3 rounded-lg px-3 py-2 text-start'
const filterControlClassName =
  'border-border bg-surface-secondary focus-within:border-accent dark:border-foreground/20'

type ClassFilterDropdownProps = {
  classCodeOptions: readonly string[]
  classNameOptions: readonly string[]
  draftFilters: ClassFilters
  isOpen: boolean
  isHeaderAction?: boolean
  hasFilters?: boolean
  onApply: () => void
  onDraftFiltersChange: (filters: ClassFilters) => void
  onOpenChange: (isOpen: boolean) => void
  onReset: () => void
}

const ClassFilterFields = ({
  classCodeOptions,
  classNameOptions,
  draftFilters,
  onApply,
  onDraftFiltersChange,
  onReset
}: Pick<
  ClassFilterDropdownProps,
  | 'classCodeOptions'
  | 'classNameOptions'
  | 'draftFilters'
  | 'onApply'
  | 'onDraftFiltersChange'
  | 'onReset'
>) => (
  <>
    <Select
      fullWidth
      aria-label="Filter by class name"
      placeholder="Select name"
      value={draftFilters.name}
      onChange={value =>
        onDraftFiltersChange({
          ...draftFilters,
          name: value ? String(value) : null
        })
      }>
      <Label>Name</Label>
      <Select.Trigger className={filterControlClassName}>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {classNameOptions.map(option => (
            <ListBox.Item key={option} id={option} textValue={option}>
              {option}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
    <Select
      fullWidth
      aria-label="Filter by class code"
      placeholder="Select code"
      value={draftFilters.code}
      onChange={value =>
        onDraftFiltersChange({
          ...draftFilters,
          code: value ? String(value) : null
        })
      }>
      <Label>Code</Label>
      <Select.Trigger className={filterControlClassName}>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {classCodeOptions.map(option => (
            <ListBox.Item key={option} id={option} textValue={option}>
              {option}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
    <Select
      fullWidth
      aria-label="Filter by class status"
      placeholder="Select status"
      value={draftFilters.status}
      onChange={value =>
        onDraftFiltersChange({
          ...draftFilters,
          status: value ? (String(value) as ClassStatus) : null
        })
      }>
      <Label>Status</Label>
      <Select.Trigger className={filterControlClassName}>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {classStatusOptions.map(option => (
            <ListBox.Item key={option} id={option} textValue={option}>
              {option}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
    <div className="flex flex-wrap justify-end gap-2 pt-1">
      <Button variant="secondary" onPress={onReset}>
        Reset
      </Button>
      <Button onPress={onApply}>Apply</Button>
    </div>
  </>
)

export const ClassFilterDropdown = ({
  classCodeOptions,
  classNameOptions,
  draftFilters,
  isHeaderAction = false,
  hasFilters = false,
  isOpen,
  onApply,
  onDraftFiltersChange,
  onOpenChange,
  onReset
}: ClassFilterDropdownProps) => (
  <Dropdown isOpen={isOpen} onOpenChange={onOpenChange}>
    {isHeaderAction ? (
      <Tooltip delay={0}>
        <Button
          isIconOnly
          aria-label="Filter"
          aria-pressed={hasFilters}
          className={headerActionClassName}
          size="sm"
          variant={hasFilters ? 'secondary' : 'ghost'}>
          <Filter size={18} aria-hidden="true" />
        </Button>
        <Tooltip.Content>Filter</Tooltip.Content>
      </Tooltip>
    ) : (
      <Dropdown.Trigger>
        <Button size="sm" variant="outline">
          <Filter size={16} aria-hidden="true" />
          Filter
          <AltArrowDown size={16} aria-hidden="true" />
        </Button>
      </Dropdown.Trigger>
    )}
    <Dropdown.Popover className="w-80 max-w-[calc(100vw-2rem)]">
      <Surface className="flex max-h-[min(34rem,calc(100dvh-2rem))] flex-col gap-4 overflow-y-auto rounded-2xl p-4">
        <ClassFilterFields
          classCodeOptions={classCodeOptions}
          classNameOptions={classNameOptions}
          draftFilters={draftFilters}
          onApply={onApply}
          onDraftFiltersChange={onDraftFiltersChange}
          onReset={onReset}
        />
      </Surface>
    </Dropdown.Popover>
  </Dropdown>
)

type ColumnsDropdownProps = {
  visibleColumns: Set<ClassColumnKey>
  isOpen?: boolean
  isHeaderAction?: boolean
  onOpenChange?: (isOpen: boolean) => void
  onVisibleColumnsChange: (columns: Set<ClassColumnKey>) => void
}

export const ColumnsDropdown = ({
  isOpen,
  isHeaderAction = false,
  visibleColumns,
  onOpenChange,
  onVisibleColumnsChange
}: ColumnsDropdownProps) => (
  <Dropdown isOpen={isOpen} onOpenChange={onOpenChange}>
    {isHeaderAction ? (
      <Tooltip delay={0}>
        <Button
          isIconOnly
          aria-label="Columns"
          className={headerActionClassName}
          size="sm"
          variant="ghost">
          <SliderVertical size={18} aria-hidden="true" />
        </Button>
        <Tooltip.Content>Columns</Tooltip.Content>
      </Tooltip>
    ) : (
      <Dropdown.Trigger>
        <Button size="sm" variant="outline">
          <SliderVertical size={16} aria-hidden="true" />
          Columns
          <AltArrowDown size={16} aria-hidden="true" />
        </Button>
      </Dropdown.Trigger>
    )}
    <Dropdown.Popover>
      <Dropdown.Menu
        aria-label="Show or hide class columns"
        selectedKeys={visibleColumns}
        selectionMode="multiple"
        onSelectionChange={keys => {
          const nextColumns =
            keys === 'all'
              ? new Set(classColumnOptions.map(option => option.key))
              : new Set(Array.from(keys) as ClassColumnKey[])

          if (nextColumns.size > 0) onVisibleColumnsChange(nextColumns)
        }}>
        {classColumnOptions.map(option => (
          <Dropdown.Item
            key={option.key}
            id={option.key}
            textValue={option.label}>
            <span className="flex w-full items-center justify-between">
              {option.label}
              <Dropdown.ItemIndicator />
            </span>
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown.Popover>
  </Dropdown>
)

type SortDropdownProps = {
  isOpen?: boolean
  isHeaderAction?: boolean
  sortDescriptor: SortDescriptor
  onOpenChange?: (isOpen: boolean) => void
  onSortChange: (descriptor: SortDescriptor) => void
}

export const SortDropdown = ({
  isOpen,
  isHeaderAction = false,
  sortDescriptor,
  onOpenChange,
  onSortChange
}: SortDropdownProps) => {
  const selectedSort = sortOptions.find(
    option => option.key === sortDescriptor.column
  )
  const selectedKeys = new Set([
    String(sortDescriptor.column),
    String(sortDescriptor.direction)
  ])

  return (
    <Dropdown isOpen={isOpen} onOpenChange={onOpenChange}>
      {isHeaderAction ? (
        <Tooltip delay={0}>
          <Button
            isIconOnly
            aria-label="Sort"
            className={headerActionClassName}
            size="sm"
            variant="ghost">
            <Sort size={18} aria-hidden="true" />
          </Button>
          <Tooltip.Content>
            Sort: {selectedSort?.label ?? 'Recently added'}
          </Tooltip.Content>
        </Tooltip>
      ) : (
        <Dropdown.Trigger>
          <Button size="sm" variant="outline">
            <Sort size={16} aria-hidden="true" />
            {`Sort: ${selectedSort?.label ?? 'Recently added'}`}
            <AltArrowDown size={16} aria-hidden="true" />
          </Button>
        </Dropdown.Trigger>
      )}
      <Dropdown.Popover>
        <Dropdown.Menu
          aria-label="Sort classes"
          selectedKeys={selectedKeys}
          selectionMode="multiple">
          <Dropdown.Section aria-label="Sort field">
            {sortOptions.map(option => (
              <Dropdown.Item
                key={option.key}
                id={option.key}
                textValue={option.label}
                onPress={() =>
                  onSortChange({
                    column: option.key,
                    direction: sortDescriptor.direction
                  })
                }>
                <span className="flex w-full items-center justify-between">
                  {option.label}
                  <Dropdown.ItemIndicator />
                </span>
              </Dropdown.Item>
            ))}
          </Dropdown.Section>
          <Separator />
          <Dropdown.Section aria-label="Sort direction">
            <Dropdown.Item
              id="ascending"
              textValue="Ascending"
              onPress={() =>
                onSortChange({
                  column: String(sortDescriptor.column),
                  direction: 'ascending'
                })
              }>
              <span className="flex w-full items-center justify-between">
                Ascending
                <Dropdown.ItemIndicator />
              </span>
            </Dropdown.Item>
            <Dropdown.Item
              id="descending"
              textValue="Descending"
              onPress={() =>
                onSortChange({
                  column: String(sortDescriptor.column),
                  direction: 'descending'
                })
              }>
              <span className="flex w-full items-center justify-between">
                Descending
                <Dropdown.ItemIndicator />
              </span>
            </Dropdown.Item>
          </Dropdown.Section>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  )
}

export type ClassesToolbarProps = {
  classCodeOptions: readonly string[]
  classNameOptions: readonly string[]
  draftFilters: ClassFilters
  hasFilters: boolean
  isColumnsOpen: boolean
  isFilterOpen: boolean
  isSortOpen: boolean
  sortDescriptor: SortDescriptor
  visibleColumns: Set<ClassColumnKey>
  onApplyFilters: () => void
  onColumnsOpenChange: (isOpen: boolean) => void
  onDraftFiltersChange: (filters: ClassFilters) => void
  onFilterOpenChange: (isOpen: boolean) => void
  onResetFilters: () => void
  onSortOpenChange: (isOpen: boolean) => void
  onSortChange: (descriptor: SortDescriptor) => void
  onVisibleColumnsChange: (columns: Set<ClassColumnKey>) => void
}

const ClassesToolbarControls = ({
  classCodeOptions,
  classNameOptions,
  draftFilters,
  hasFilters,
  isColumnsOpen,
  isFilterOpen,
  isSortOpen,
  sortDescriptor,
  visibleColumns,
  onApplyFilters,
  onColumnsOpenChange,
  onDraftFiltersChange,
  onFilterOpenChange,
  onResetFilters,
  onSortOpenChange,
  onSortChange,
  onVisibleColumnsChange,
  isHeaderAction = false
}: ClassesToolbarProps & {
  isHeaderAction?: boolean
}) => (
  <div
    role="group"
    aria-label="Class table actions"
    className="flex items-center gap-1">
    <ClassFilterDropdown
      classCodeOptions={classCodeOptions}
      classNameOptions={classNameOptions}
      draftFilters={draftFilters}
      hasFilters={hasFilters}
      isHeaderAction={isHeaderAction}
      isOpen={isFilterOpen}
      onApply={onApplyFilters}
      onDraftFiltersChange={onDraftFiltersChange}
      onOpenChange={onFilterOpenChange}
      onReset={onResetFilters}
    />
    <ColumnsDropdown
      isHeaderAction={isHeaderAction}
      isOpen={isColumnsOpen}
      visibleColumns={visibleColumns}
      onOpenChange={onColumnsOpenChange}
      onVisibleColumnsChange={onVisibleColumnsChange}
    />
    <SortDropdown
      isHeaderAction={isHeaderAction}
      isOpen={isSortOpen}
      sortDescriptor={sortDescriptor}
      onOpenChange={onSortOpenChange}
      onSortChange={onSortChange}
    />
  </div>
)

export const ClassesHeaderToolbar = (props: ClassesToolbarProps) => {
  const isCompactToolbar = useMediaQuery('(max-width: 767px)')

  if (isCompactToolbar) return null

  return <ClassesToolbarControls {...props} isHeaderAction />
}

export const ClassesMobileToolbar = ({
  classCodeOptions,
  classNameOptions,
  draftFilters,
  sortDescriptor,
  visibleColumns,
  onApplyFilters,
  onDraftFiltersChange,
  onResetFilters,
  onSortChange,
  onVisibleColumnsChange
}: ClassesToolbarProps) => {
  const { closeSheet, openPage, page } = useMobileToolbarNavigation()
  const selectedSort = sortOptions.find(
    option => option.key === sortDescriptor.column
  )
  const selectSort = (
    column: string,
    direction: 'ascending' | 'descending'
  ) => {
    onSortChange({ column, direction })
    closeSheet()
  }

  if (page?.key === 'classes-filter') {
    return (
      <div className="flex flex-col gap-5 px-3 pt-2">
        <ClassFilterFields
          classCodeOptions={classCodeOptions}
          classNameOptions={classNameOptions}
          draftFilters={draftFilters}
          onApply={() => {
            onApplyFilters()
            closeSheet()
          }}
          onDraftFiltersChange={onDraftFiltersChange}
          onReset={onResetFilters}
        />
      </div>
    )
  }

  if (page?.key === 'classes-columns') {
    return (
      <div className="flex flex-col gap-1 px-3 pt-2">
        <Label className="text-muted px-3 pt-2">Visible columns</Label>
        {classColumnOptions.map(option => {
          const isSelected = visibleColumns.has(option.key)

          return (
            <Button
              key={option.key}
              variant="ghost"
              className={mobileActionClassName}
              aria-pressed={isSelected}
              onPress={() => {
                if (isSelected && visibleColumns.size === 1) return

                const nextColumns = new Set(visibleColumns)
                if (isSelected) nextColumns.delete(option.key)
                else nextColumns.add(option.key)

                onVisibleColumnsChange(nextColumns)
              }}>
              <span className="flex-1">{option.label}</span>
              {isSelected && (
                <CheckCircle size={18} aria-hidden="true" weight="filled" />
              )}
            </Button>
          )
        })}
      </div>
    )
  }

  if (page?.key === 'classes-sort') {
    return (
      <div className="flex flex-col gap-1 px-3 pt-2">
        <Label className="text-muted px-3 pt-2">Sort by</Label>
        {sortOptions.map(option => {
          const isSelected = sortDescriptor.column === option.key

          return (
            <Button
              key={option.key}
              variant="ghost"
              className={mobileActionClassName}
              aria-pressed={isSelected}
              onPress={() => selectSort(option.key, sortDescriptor.direction)}>
              <span className="flex-1">{option.label}</span>
              {isSelected && (
                <CheckCircle size={18} aria-hidden="true" weight="filled" />
              )}
            </Button>
          )
        })}
        <Separator className="my-1" />
        <Label className="text-muted px-3 pt-2">Direction</Label>
        {(['ascending', 'descending'] as const).map(direction => {
          const isSelected = sortDescriptor.direction === direction
          const label = direction === 'ascending' ? 'Ascending' : 'Descending'

          return (
            <Button
              key={direction}
              variant="ghost"
              className={mobileActionClassName}
              aria-pressed={isSelected}
              onPress={() =>
                selectSort(String(sortDescriptor.column), direction)
              }>
              <span className="flex-1">{label}</span>
              {isSelected && (
                <CheckCircle size={18} aria-hidden="true" weight="filled" />
              )}
            </Button>
          )
        })}
      </div>
    )
  }

  return (
    <div
      role="group"
      aria-label="Class table actions"
      className="flex flex-col gap-1">
      <Button
        variant="ghost"
        className={mobileActionClassName}
        onPress={() => openPage({ key: 'classes-filter', title: 'Filter' })}>
        <Filter size={18} aria-hidden="true" />
        <span className="flex-1">Filter</span>
        <AltArrowRight size={18} aria-hidden="true" />
      </Button>
      <Button
        variant="ghost"
        className={mobileActionClassName}
        onPress={() => openPage({ key: 'classes-columns', title: 'Columns' })}>
        <SliderVertical size={18} aria-hidden="true" />
        <span className="flex-1">Columns</span>
        <AltArrowRight size={18} aria-hidden="true" />
      </Button>
      <Button
        variant="ghost"
        className={mobileActionClassName}
        onPress={() => openPage({ key: 'classes-sort', title: 'Sort' })}>
        <Sort size={18} aria-hidden="true" />
        <span className="flex-1">
          Sort: {selectedSort?.label ?? 'Recently added'}
        </span>
        <AltArrowRight size={18} aria-hidden="true" />
      </Button>
    </div>
  )
}
