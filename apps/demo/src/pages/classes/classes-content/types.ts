export type ClassStatus = 'Active' | 'Inactive'

export type ClassFilters = {
  name: string | null
  code: string | null
  status: ClassStatus | null
}

export type ClassColumnKey =
  'className' | 'createdAt' | 'id' | 'status' | 'students' | 'subjects'

export type ClassRecord = {
  id: string
  className: string
  section: string
  students: number
  subjects: number
  status: ClassStatus
  createdAt: string
}

export type SortField =
  'className' | 'createdAt' | 'id' | 'status' | 'students' | 'subjects'

export type ClassDetailTab =
  'home' | 'notes' | 'overview' | 'schedule' | 'students' | 'subjects'
