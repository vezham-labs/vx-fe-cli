import type { Selection } from 'react-aria-components'

import {
  AltArrowDown,
  AltArrowUp,
  Close,
  Hashtag,
  Link,
  Pen,
  SortVertical,
  TrashBinTrash
} from '@vezham/icons-react'
import { ActionBar, EmptyState } from '@vezham/react-pro-v3'
import {
  Button,
  Checkbox,
  Chip,
  ListBox,
  Pagination,
  Select,
  Separator,
  type SortDescriptor,
  Table
} from '@vezham/react-v3'

import { pageSizeOptions } from './data'
import type { ClassColumnKey, ClassRecord } from './types'
import { formatDate } from './utils'

const classColumns: ReadonlyArray<{
  defaultWidth: number
  id: ClassColumnKey
  label: string
  minWidth: number
}> = [
  { defaultWidth: 100, id: 'className', label: 'Class', minWidth: 100 },
  { defaultWidth: 140, id: 'id', label: 'ID', minWidth: 112 },
  { defaultWidth: 140, id: 'students', label: 'Students', minWidth: 120 },
  { defaultWidth: 140, id: 'subjects', label: 'Subjects', minWidth: 120 },
  { defaultWidth: 140, id: 'status', label: 'Status', minWidth: 140 },
  { defaultWidth: 180, id: 'createdAt', label: 'Created', minWidth: 160 }
]

const renderClassCell = (classRecord: ClassRecord, key: ClassColumnKey) => {
  if (key === 'className') {
    return (
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="font-medium">Class {classRecord.className}</span>
        <span className="text-muted text-xs">
          Section {classRecord.section}
        </span>
      </div>
    )
  }

  if (key === 'id') {
    return (
      <span className="text-muted font-mono text-sm">{classRecord.id}</span>
    )
  }

  if (key === 'students' || key === 'subjects') {
    return <span className="tabular-nums">{classRecord[key]}</span>
  }

  if (key === 'status') {
    return (
      <Chip
        color={classRecord.status === 'Active' ? 'success' : 'danger'}
        size="sm"
        variant="soft">
        <Chip.Label>{classRecord.status}</Chip.Label>
      </Chip>
    )
  }

  return (
    <span className="text-muted text-sm whitespace-nowrap">
      {formatDate(classRecord.createdAt)}
    </span>
  )
}

type ClassesTableProps = {
  records: readonly ClassRecord[]
  selectedKeys: Selection
  sortDescriptor: SortDescriptor
  visibleColumns: ReadonlySet<ClassColumnKey>
  onOpenClass: (classRecord: ClassRecord) => void
  onSelectionChange: (keys: Selection) => void
  onSortChange: (descriptor: SortDescriptor) => void
}

export const ClassesTable = ({
  records,
  selectedKeys,
  sortDescriptor,
  visibleColumns,
  onOpenClass,
  onSelectionChange,
  onSortChange
}: ClassesTableProps) => {
  const visibleClassColumns = classColumns.filter(column =>
    visibleColumns.has(column.id)
  )
  const tableMinWidth =
    40 +
    visibleClassColumns.reduce(
      (total, column) => total + column.defaultWidth,
      0
    )

  return (
    <Table className="demo-classes-grid min-h-0 min-w-0">
      <Table.ScrollContainer className="h-full min-h-0 overflow-auto">
        <Table.ResizableContainer>
          <Table.Content
            aria-label="All classes"
            className="min-w-[760px] [&_.table__column]:sticky [&_.table__column]:top-0 [&_.table__column]:z-[3]"
            style={{ minWidth: `${tableMinWidth}px` }}
            selectedKeys={selectedKeys}
            selectionBehavior="toggle"
            selectionMode="multiple"
            sortDescriptor={sortDescriptor}
            onSelectionChange={onSelectionChange}
            onSortChange={onSortChange}>
            <Table.Header>
              <Table.Column
                className="bg-surface-secondary sticky left-0 z-[5]"
                width={40}>
                <Checkbox aria-label="Select all classes" slot="selection">
                  <Checkbox.Control>
                    <Checkbox.Indicator />
                  </Checkbox.Control>
                </Checkbox>
              </Table.Column>
              {visibleClassColumns.map(column => (
                <Table.Column
                  key={column.id}
                  allowsSorting
                  className={
                    column.id === 'className'
                      ? 'bg-surface-secondary sticky left-10 z-[5]'
                      : undefined
                  }
                  defaultWidth={column.defaultWidth}
                  id={column.id}
                  isRowHeader={column.id === 'className'}
                  minWidth={column.minWidth}>
                  {({ sortDirection }) => (
                    <>
                      <span className="flex items-center gap-2">
                        {column.label}
                        {sortDirection === 'ascending' ? (
                          <AltArrowUp size={14} aria-hidden="true" />
                        ) : sortDirection === 'descending' ? (
                          <AltArrowDown size={14} aria-hidden="true" />
                        ) : (
                          <SortVertical size={14} aria-hidden="true" />
                        )}
                      </span>
                      <Table.ColumnResizer
                        aria-label={`Resize ${column.label.toLowerCase()} column`}
                      />
                    </>
                  )}
                </Table.Column>
              ))}
            </Table.Header>
            <Table.Body
              renderEmptyState={() => (
                <div className="py-10">
                  <EmptyState size="sm">
                    <EmptyState.Header>
                      <EmptyState.Title>No classes found</EmptyState.Title>
                      <EmptyState.Description>
                        Adjust the filters to see class records.
                      </EmptyState.Description>
                    </EmptyState.Header>
                  </EmptyState>
                </div>
              )}>
              {records.map(classRecord => (
                <Table.Row key={classRecord.id} id={classRecord.id}>
                  <Table.Cell className="bg-surface-secondary sticky left-0 z-[2]">
                    <Checkbox
                      aria-label={`Select class ${classRecord.id}`}
                      slot="selection"
                      onClick={event => event.stopPropagation()}>
                      <Checkbox.Control>
                        <Checkbox.Indicator />
                      </Checkbox.Control>
                    </Checkbox>
                  </Table.Cell>
                  {visibleClassColumns.map(column => (
                    <Table.Cell
                      key={column.id}
                      className={
                        column.id === 'className'
                          ? 'bg-surface-secondary sticky left-10 z-[2]'
                          : undefined
                      }
                      onClick={() => onOpenClass(classRecord)}>
                      {renderClassCell(classRecord, column.id)}
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ResizableContainer>
      </Table.ScrollContainer>
    </Table>
  )
}

export const getSelectedClassIds = (
  selectedKeys: Selection,
  records: readonly ClassRecord[]
) =>
  selectedKeys === 'all'
    ? new Set(records.map(classRecord => classRecord.id))
    : new Set(Array.from(selectedKeys, String))

type ClassesActionBarProps = {
  selectedCount: number
  onClear: () => void
  onCopyIds: () => void
  onCopyLinks: () => void
  onDelete: () => void
  onEdit: () => void
}

export const ClassesActionBar = ({
  selectedCount,
  onClear,
  onCopyIds,
  onCopyLinks,
  onDelete,
  onEdit
}: ClassesActionBarProps) => (
  <ActionBar aria-label="Selected class actions" isOpen={selectedCount > 0}>
    <ActionBar.Prefix>
      <Chip className="shrink-0 tabular-nums" size="sm">
        {selectedCount}
      </Chip>
    </ActionBar.Prefix>
    <Separator />
    <ActionBar.Content>
      <Button
        aria-label="Edit selected class"
        isDisabled={selectedCount !== 1}
        size="sm"
        variant="ghost"
        onPress={onEdit}>
        <Pen size={16} aria-hidden="true" />
        <span className="action-bar__label">Edit</span>
      </Button>
      <Button
        aria-label="Copy selected class IDs"
        size="sm"
        variant="ghost"
        onPress={onCopyIds}>
        <Hashtag size={16} aria-hidden="true" />
        <span className="action-bar__label">Copy IDs</span>
      </Button>
      <Button
        aria-label="Copy selected class links"
        size="sm"
        variant="ghost"
        onPress={onCopyLinks}>
        <Link size={16} aria-hidden="true" />
        <span className="action-bar__label">Copy Links</span>
      </Button>
      <Button
        aria-label="Delete selected classes"
        className="bg-danger/10 text-danger"
        size="sm"
        variant="ghost"
        onPress={onDelete}>
        <TrashBinTrash size={16} aria-hidden="true" />
        <span className="action-bar__label">Delete</span>
      </Button>
    </ActionBar.Content>
    <Separator />
    <ActionBar.Suffix>
      <Button
        isIconOnly
        aria-label="Clear selection"
        size="sm"
        variant="ghost"
        onPress={onClear}>
        <Close size={16} aria-hidden="true" />
      </Button>
    </ActionBar.Suffix>
  </ActionBar>
)

type ClassesPaginationProps = {
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export const ClassesPagination = ({
  currentPage,
  pageSize,
  totalItems,
  totalPages,
  onPageChange,
  onPageSizeChange
}: ClassesPaginationProps) => {
  const firstItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const lastItem = Math.min(currentPage * pageSize, totalItems)

  return (
    <Pagination className="flex w-full flex-col items-center gap-3 px-1 sm:flex-row sm:justify-between">
      <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
        <Pagination.Summary className="flex items-center self-stretch">
          {firstItem}-{lastItem} of {totalItems}
        </Pagination.Summary>
        <Select
          aria-label="Classes per page"
          value={String(pageSize)}
          onChange={value => onPageSizeChange(Number(value))}>
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {pageSizeOptions.map(option => (
                <ListBox.Item
                  key={option}
                  id={String(option)}
                  textValue={String(option)}>
                  {option}
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>
        <span className="text-muted flex items-center self-stretch text-sm">
          per page
        </span>
      </div>
      <Pagination.Content className="self-center sm:self-auto">
        <Pagination.Item>
          <Pagination.Previous
            isDisabled={currentPage <= 1}
            onPress={() => onPageChange(currentPage - 1)}>
            <Pagination.PreviousIcon />
            <span>Prev</span>
          </Pagination.Previous>
        </Pagination.Item>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          page => (
            <Pagination.Item key={page}>
              <Pagination.Link
                isActive={page === currentPage}
                onPress={() => onPageChange(page)}>
                {page}
              </Pagination.Link>
            </Pagination.Item>
          )
        )}
        <Pagination.Item>
          <Pagination.Next
            isDisabled={currentPage >= totalPages}
            onPress={() => onPageChange(currentPage + 1)}>
            <span>Next</span>
            <Pagination.NextIcon />
          </Pagination.Next>
        </Pagination.Item>
      </Pagination.Content>
    </Pagination>
  )
}
