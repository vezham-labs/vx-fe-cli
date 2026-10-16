import type {
  ClassColumnKey,
  ClassDetailTab,
  ClassRecord,
  ClassStatus,
  SortField
} from './types'

export const initialClasses: readonly ClassRecord[] = [
  {
    id: 'C138038',
    className: 'I',
    section: 'A',
    students: 30,
    subjects: 3,
    status: 'Active',
    createdAt: '2026-05-01'
  },
  {
    id: 'C138037',
    className: 'I',
    section: 'B',
    students: 25,
    subjects: 3,
    status: 'Active',
    createdAt: '2026-04-30'
  },
  {
    id: 'C138036',
    className: 'II',
    section: 'A',
    students: 40,
    subjects: 3,
    status: 'Active',
    createdAt: '2026-04-29'
  },
  {
    id: 'C138035',
    className: 'II',
    section: 'B',
    students: 35,
    subjects: 3,
    status: 'Active',
    createdAt: '2026-04-26'
  },
  {
    id: 'C138034',
    className: 'II',
    section: 'C',
    students: 25,
    subjects: 3,
    status: 'Inactive',
    createdAt: '2026-04-21'
  },
  {
    id: 'C138033',
    className: 'III',
    section: 'A',
    students: 30,
    subjects: 3,
    status: 'Active',
    createdAt: '2026-04-20'
  },
  {
    id: 'C138032',
    className: 'III',
    section: 'B',
    students: 25,
    subjects: 5,
    status: 'Active',
    createdAt: '2026-04-15'
  },
  {
    id: 'C138031',
    className: 'IV',
    section: 'A',
    students: 20,
    subjects: 5,
    status: 'Active',
    createdAt: '2026-03-31'
  },
  {
    id: 'C138030',
    className: 'IV',
    section: 'B',
    students: 30,
    subjects: 5,
    status: 'Inactive',
    createdAt: '2026-01-12'
  },
  {
    id: 'C138029',
    className: 'V',
    section: 'A',
    students: 35,
    subjects: 5,
    status: 'Active',
    createdAt: '2025-12-20'
  },
  {
    id: 'C138028',
    className: 'V',
    section: 'B',
    students: 32,
    subjects: 5,
    status: 'Active',
    createdAt: '2026-04-02'
  },
  {
    id: 'C138027',
    className: 'VI',
    section: 'A',
    students: 38,
    subjects: 6,
    status: 'Inactive',
    createdAt: '2027-02-14'
  }
]

export const classStatusOptions: readonly ClassStatus[] = ['Active', 'Inactive']

export const classColumnOptions: readonly {
  key: ClassColumnKey
  label: string
}[] = [
  { key: 'className', label: 'Class' },
  { key: 'id', label: 'ID' },
  { key: 'students', label: 'Students' },
  { key: 'subjects', label: 'Subjects' },
  { key: 'status', label: 'Status' },
  { key: 'createdAt', label: 'Created' }
]

export const pageSizeOptions = [5, 10, 12] as const

export const classDetailTabs: readonly {
  id: ClassDetailTab
  label: string
}[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'students', label: 'Students' },
  { id: 'subjects', label: 'Subjects' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'notes', label: 'Notes' }
]

export const sortOptions: readonly { key: SortField; label: string }[] = [
  { key: 'createdAt', label: 'Recently added' },
  { key: 'className', label: 'Class name' },
  { key: 'id', label: 'ID' },
  { key: 'students', label: 'Students' },
  { key: 'subjects', label: 'Subjects' },
  { key: 'status', label: 'Status' }
]
