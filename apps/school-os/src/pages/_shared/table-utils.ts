import type { SortDescriptor } from '@vezham/react-v3'
import { getLocalDateKey } from '@vezham/react/date'

import { reportDateFormatter } from '@src/utils/intl'

type DatePresetKey =
  | 'today'
  | 'yesterday'
  | 'last7'
  | 'last30'
  | 'thisYear'
  | 'nextYear'
  | 'custom'

type DateRangeFilter = { start: string; end: string }

export const isPersonValue = (
  value: unknown
): value is { name: string; subtitle?: string } =>
  value !== null && typeof value === 'object' && 'name' in value

const getTextValue = (value: unknown) => {
  if (isPersonValue(value)) return value.name
  if (value === null || value === undefined) return ''

  return String(value).trim().split('\n')[0]
}

type RecordRow = { id: string; [key: string]: unknown }
type RecordColumn = { key: string; label: string; type?: string }

export const getRecordDrawerTitle = (row: RecordRow) => {
  const idValue = [
    row.displayId,
    row.refId,
    row.studentId,
    row.admissionNo,
    row.admissionNumber,
    row.serialNo,
    row.sNo,
    row.id
  ]
    .map(getTextValue)
    .find(Boolean)
  const nameValue = [row.name, row.studentName, row.staffName, row.teacherName]
    .map(getTextValue)
    .find(Boolean)

  if (idValue) return idValue.startsWith('#') ? idValue : `#${idValue}`
  return nameValue || '-'
}

export const getRecordInputPlaceholder = (column: RecordColumn) => {
  const label = (column.label || column.key).toLowerCase()
  if (column.type === 'status' || column.type === 'badge') {
    return `Select ${label}`
  }
  if (label.includes('date')) return `Choose ${label}`
  return `Enter ${label}`
}

export const getRecordSortValue = (value: unknown, parsePercent = false) => {
  if (isPersonValue(value)) return value.name
  if (parsePercent && typeof value === 'string' && value.endsWith('%')) {
    return Number(value.slice(0, -1))
  }
  return value as string | number
}

export const sortRecordRows = <Row extends Record<string, unknown>>(
  rows: Row[],
  descriptor: SortDescriptor,
  getValue: (value: unknown) => unknown,
  nullAsEmpty = false
) =>
  [...rows].sort((firstRow, secondRow) => {
    const first = getValue(firstRow[descriptor.column as string])
    const second = getValue(secondRow[descriptor.column as string])
    const comparison =
      typeof first === 'number' && typeof second === 'number'
        ? first - second
        : String(nullAsEmpty ? (first ?? '') : first).localeCompare(
            String(nullAsEmpty ? (second ?? '') : second),
            undefined,
            { numeric: true }
          )

    return descriptor.direction === 'descending' ? comparison * -1 : comparison
  })

export const getRecordSearchText = (
  value: unknown,
  includeSubtitle = false
) => {
  if (isPersonValue(value)) {
    return includeSubtitle
      ? `${value.name} ${value.subtitle ?? ''}`
      : value.name
  }
  return String(value ?? '')
}

export const recordRowToForm = <Row extends RecordRow>(
  row: Row,
  columns: readonly RecordColumn[],
  parsePercent = false
) =>
  columns.reduce<Record<string, string | null>>((draft, column) => {
    draft[column.key] = String(
      getRecordSortValue(row[column.key], parsePercent) ?? ''
    )
    return draft
  }, {})

const isRecordDateInRange = (value: string, start?: string, end?: string) =>
  !start || !end || (value >= start && value <= end)

export const filterRecordRows = <
  Row extends { createdAt: string; [key: string]: unknown }
>(
  rows: Row[],
  columns: readonly { key: string }[],
  filterOptions: readonly { key: string }[],
  filters: Record<string, string | null>,
  dateRange: DateRangeFilter | null,
  searchQuery: string,
  getSearchText: (value: unknown) => string,
  getSortValue: (value: unknown) => unknown,
  searchAllValuesForFilter?: string
) => {
  const query = searchQuery.trim().toLowerCase()

  return rows.filter(row => {
    const matchesQuery =
      !query ||
      columns.some(column =>
        getSearchText(row[column.key]).toLowerCase().includes(query)
      )
    const matchesDate = isRecordDateInRange(
      row.createdAt,
      dateRange?.start,
      dateRange?.end
    )
    const matchesFilters = filterOptions.every(filter => {
      const activeValue = filters[filter.key]
      if (!activeValue) return true
      if (filter.key === searchAllValuesForFilter) {
        return Object.values(row).some(value => String(value) === activeValue)
      }
      return String(getSortValue(row[filter.key])) === activeValue
    })

    return matchesQuery && matchesDate && matchesFilters
  })
}

export const toISODate = getLocalDateKey

export const getPresetDateRange = (key: DatePresetKey): DateRangeFilter => {
  const today = new Date()
  const currentYear = today.getFullYear()

  if (key === 'today') {
    const value = toISODate(today)

    return { start: value, end: value }
  }

  if (key === 'yesterday') {
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)
    const value = toISODate(yesterday)

    return { start: value, end: value }
  }

  if (key === 'last7') {
    const start = new Date(today)
    start.setDate(today.getDate() - 6)

    return { start: toISODate(start), end: toISODate(today) }
  }

  if (key === 'thisYear') {
    return {
      start: `${currentYear}-01-01`,
      end: `${currentYear}-12-31`
    }
  }

  if (key === 'nextYear') {
    const nextYear = currentYear + 1

    return {
      start: `${nextYear}-01-01`,
      end: `${nextYear}-12-31`
    }
  }

  const start = new Date(today)
  start.setDate(today.getDate() - 29)

  return { start: toISODate(start), end: toISODate(today) }
}

const formatISODate = (value: string) =>
  reportDateFormatter.format(new Date(`${value}T00:00:00`))

export const formatDateRangeLabel = (range: DateRangeFilter) =>
  `${formatISODate(range.start)} - ${formatISODate(range.end)}`

export const getPaginationSummary = (
  page: number,
  pageSize: number,
  totalItems: number
) => {
  if (!totalItems) {
    return 'Showing 0 entries'
  }

  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalItems)

  return `Showing ${start}-${end} of ${totalItems} entries`
}
