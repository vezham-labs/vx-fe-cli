import { classDetailTabs } from './data'
import type {
  ClassDetailTab,
  ClassFilters,
  ClassRecord,
  SortField
} from './types'

const dateFormatter = new Intl.DateTimeFormat('en', {
  day: 'numeric',
  month: 'short',
  year: 'numeric'
})

const classNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI']

export const createEmptyClassRecord = (): ClassRecord => ({
  className: '',
  createdAt: '',
  id: '',
  section: '',
  status: 'Active',
  students: 0,
  subjects: 0
})

export const createNextClassId = (records: readonly ClassRecord[]) => {
  const largestId = Math.max(
    0,
    ...records.map(classRecord => Number(classRecord.id.slice(1)))
  )

  return `C${String(largestId + 1).padStart(6, '0')}`
}

export const createEmptyClassFilters = (): ClassFilters => ({
  code: null,
  name: null,
  status: null
})

export const getClassFiltersFromSearch = (
  search: Record<string, unknown>
): ClassFilters => ({
  code: typeof search.code === 'string' ? search.code : null,
  name: typeof search.name === 'string' ? search.name : null,
  status:
    search.status === 'Active' || search.status === 'Inactive'
      ? search.status
      : null
})

export const getClassFilterSearch = (filters: ClassFilters) => ({
  code: filters.code ?? undefined,
  name: filters.name ?? undefined,
  status: filters.status ?? undefined
})

export const getClassLabel = ({ className, section }: ClassRecord) =>
  `Class ${className} — Section ${section}`

export const matchesClassSearch = (
  { className, id, section, status }: ClassRecord,
  searchQuery: string
) => {
  const query = searchQuery.trim().toLowerCase()

  return (
    !query ||
    [id, className, section, status].some(value =>
      value.toLowerCase().includes(query)
    )
  )
}

export const formatDate = (date: string) => dateFormatter.format(new Date(date))

export const compareClassNames = (first: string, second: string) =>
  classNumerals.indexOf(first) - classNumerals.indexOf(second)

export const isClassDetailTab = (value: string): value is ClassDetailTab =>
  value === 'home' || classDetailTabs.some(tab => tab.id === value)

export const isSortField = (value: unknown): value is SortField =>
  value === 'className' ||
  value === 'createdAt' ||
  value === 'id' ||
  value === 'status' ||
  value === 'students' ||
  value === 'subjects'
