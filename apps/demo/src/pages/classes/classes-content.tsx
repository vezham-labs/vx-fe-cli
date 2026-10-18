import { useNavigate, useSearch } from '@tanstack/react-router'
import { useCallback, useLayoutEffect, useMemo, useState } from 'react'
import type { Selection } from 'react-aria-components'

import {
  Chip,
  CloseButton,
  type SortDescriptor,
  toast,
  useMediaQuery
} from '@vezham/react-v3'

import { useSectionToolbarContent } from '@vx/react/layouts/section'
import { useMobileControls } from '@vx/react/mobile-controls'
import { useToolbarAction } from '@vx/react/toolbar-actions'

import {
  ClassesActionBar,
  ClassesPagination,
  ClassesTable,
  getSelectedClassIds
} from './classes-content/classes-table'
import {
  classColumnOptions,
  initialClasses,
  pageSizeOptions
} from './classes-content/data'
import { ClassDetailsSheet } from './classes-content/details-sheet'
import { ClassFormSheet } from './classes-content/form-sheet'
import {
  ClassesHeaderToolbar,
  ClassesMobileToolbar,
  type ClassesToolbarProps
} from './classes-content/toolbar'
import type {
  ClassColumnKey,
  ClassFilters,
  ClassRecord
} from './classes-content/types'
import {
  compareClassNames,
  createEmptyClassFilters,
  createNextClassId,
  getClassFilterSearch,
  getClassFiltersFromSearch,
  getClassLabel,
  isSortField,
  matchesClassSearch
} from './classes-content/utils'
import { useClassesSearch } from './search-context'

type ClassFilterKey = keyof ClassFilters

const filterLabels: Record<ClassFilterKey, string> = {
  code: 'Code',
  name: 'Name',
  status: 'Status'
}

const ClassesContent = () => {
  const navigate = useNavigate()
  const search = useSearch({ strict: false })
  const { query: searchQuery } = useClassesSearch()
  const filtersFromSearch = useMemo(
    () => getClassFiltersFromSearch(search),
    [search]
  )
  const [classRecords, setClassRecords] = useState<ClassRecord[]>(() => [
    ...initialClasses
  ])
  const [filters, setFilters] = useState<ClassFilters>(filtersFromSearch)
  const [draftFilters, setDraftFilters] =
    useState<ClassFilters>(filtersFromSearch)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isColumnsOpen, setIsColumnsOpen] = useState(false)
  const [isSortOpen, setIsSortOpen] = useState(false)
  const [visibleColumns, setVisibleColumns] = useState<Set<ClassColumnKey>>(
    () => new Set(classColumnOptions.map(option => option.key))
  )
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set())
  const [hiddenClassIds, setHiddenClassIds] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState<(typeof pageSizeOptions)[number]>(
    pageSizeOptions[0]
  )
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'createdAt',
    direction: 'descending'
  })
  const [detailClass, setDetailClass] = useState<ClassRecord | null>(null)
  const [editingClass, setEditingClass] = useState<ClassRecord | null>(null)
  const [isCreateClassOpen, setIsCreateClassOpen] = useState(false)
  const { setIsFooterHidden } = useMobileControls()
  const isCompactToolbar = useMediaQuery('(max-width: 767px)')
  const activeFilters = useMemo(
    () =>
      (Object.keys(filters) as ClassFilterKey[]).flatMap(key => {
        const value = filters[key]

        return value ? [{ key, value }] : []
      }),
    [filters]
  )

  useLayoutEffect(() => {
    setIsFilterOpen(false)
    setIsColumnsOpen(false)
    setIsSortOpen(false)
  }, [isCompactToolbar])

  useLayoutEffect(() => {
    setFilters(filtersFromSearch)
    setDraftFilters(filtersFromSearch)
  }, [filtersFromSearch])

  useToolbarAction('create', () => setIsCreateClassOpen(true), {
    pageKey: 'allclasses',
    pathname: '/academic/classes/allclasses'
  })

  const classNameOptions = useMemo(
    () => classRecords.map(getClassLabel),
    [classRecords]
  )
  const classCodeOptions = useMemo(
    () => classRecords.map(classRecord => classRecord.id),
    [classRecords]
  )

  const filteredClasses = useMemo(() => {
    return classRecords.filter(classRecord => {
      if (hiddenClassIds.has(classRecord.id)) return false

      const matchesSearch = matchesClassSearch(classRecord, searchQuery)

      const matchesName =
        !filters.name || getClassLabel(classRecord) === filters.name
      const matchesCode = !filters.code || classRecord.id === filters.code
      const matchesStatus =
        !filters.status || classRecord.status === filters.status

      return matchesSearch && matchesName && matchesCode && matchesStatus
    })
  }, [classRecords, filters, hiddenClassIds, searchQuery])

  const sortedClasses = useMemo(() => {
    const field = isSortField(sortDescriptor.column)
      ? sortDescriptor.column
      : 'createdAt'
    const direction = sortDescriptor.direction === 'descending' ? -1 : 1

    return [...filteredClasses].sort((first, second) => {
      const firstValue = first[field]
      const secondValue = second[field]
      const comparison =
        field === 'className'
          ? compareClassNames(first.className, second.className)
          : typeof firstValue === 'number' && typeof secondValue === 'number'
            ? firstValue - secondValue
            : String(firstValue).localeCompare(String(secondValue))

      return comparison * direction
    })
  }, [filteredClasses, sortDescriptor])

  const totalPages = Math.max(1, Math.ceil(sortedClasses.length / pageSize))
  const activePage = searchQuery ? 1 : Math.min(currentPage, totalPages)
  const pageClasses = sortedClasses.slice(
    (activePage - 1) * pageSize,
    activePage * pageSize
  )
  const selectedClassIds = getSelectedClassIds(selectedKeys, pageClasses)
  const selectedClasses = pageClasses.filter(classRecord =>
    selectedClassIds.has(classRecord.id)
  )
  const clearSelection = useCallback(() => setSelectedKeys(new Set()), [])

  useLayoutEffect(() => {
    setIsFooterHidden(
      isCompactToolbar &&
        Boolean(
          detailClass ||
          editingClass ||
          isCreateClassOpen ||
          selectedClasses.length
        )
    )

    return () => setIsFooterHidden(false)
  }, [
    detailClass,
    editingClass,
    isCompactToolbar,
    isCreateClassOpen,
    selectedClasses.length,
    setIsFooterHidden
  ])

  const hasFilters = Boolean(filters.name || filters.code || filters.status)
  const resetPage = useCallback(() => {
    setCurrentPage(1)
    clearSelection()
  }, [clearSelection])
  const applyFilters = useCallback(() => {
    setFilters(draftFilters)
    setIsFilterOpen(false)
    resetPage()
    void navigate({
      to: '/academic/classes/allclasses',
      search: current => ({
        ...current,
        ...getClassFilterSearch(draftFilters)
      }),
      replace: true
    })
  }, [draftFilters, navigate, resetPage])
  const handleFilterOpenChange = useCallback(
    (isOpen: boolean) => {
      setIsFilterOpen(isOpen)
      if (isOpen) {
        setDraftFilters(filters)
        setIsColumnsOpen(false)
        setIsSortOpen(false)
      }
    },
    [filters]
  )
  const handleColumnsOpenChange = useCallback((isOpen: boolean) => {
    setIsColumnsOpen(isOpen)
    if (isOpen) {
      setIsFilterOpen(false)
      setIsSortOpen(false)
    }
  }, [])
  const handleSortOpenChange = useCallback((isOpen: boolean) => {
    setIsSortOpen(isOpen)
    if (isOpen) {
      setIsFilterOpen(false)
      setIsColumnsOpen(false)
    }
  }, [])
  const resetFilters = useCallback(() => {
    const emptyFilters = createEmptyClassFilters()

    setDraftFilters(emptyFilters)
    setFilters(emptyFilters)
    resetPage()
    void navigate({
      to: '/academic/classes/allclasses',
      search: current => ({
        ...current,
        ...getClassFilterSearch(emptyFilters)
      }),
      replace: true
    })
  }, [navigate, resetPage])
  const removeFilter = useCallback(
    (filter: ClassFilterKey) => {
      const nextFilters = { ...filters, [filter]: null }

      setFilters(nextFilters)
      setDraftFilters(nextFilters)
      resetPage()
      void navigate({
        to: '/academic/classes/allclasses',
        search: current => ({
          ...current,
          ...getClassFilterSearch(nextFilters)
        }),
        replace: true
      })
    },
    [filters, navigate, resetPage]
  )
  const handleSortChange = useCallback(
    (descriptor: SortDescriptor) => {
      setSortDescriptor(descriptor)
      resetPage()
    },
    [resetPage]
  )
  const copyToClipboard = (value: string, successMessage: string) => {
    if (!navigator.clipboard) {
      toast.danger('Copy is not available in this browser.')
      return
    }

    void navigator.clipboard
      .writeText(value)
      .then(() => toast.success(successMessage))
      .catch(() => toast.danger('Unable to copy class details.'))
  }
  const deleteSelectedClasses = () => {
    if (selectedClasses.length === 0) return

    setHiddenClassIds(
      current =>
        new Set([
          ...current,
          ...selectedClasses.map(classRecord => classRecord.id)
        ])
    )
    clearSelection()
    toast.success(
      `${selectedClasses.length} ${
        selectedClasses.length === 1 ? 'class' : 'classes'
      } deleted.`
    )
  }
  const saveClass = (updatedClass: ClassRecord) => {
    setClassRecords(current =>
      current.map(classRecord =>
        classRecord.id === updatedClass.id ? updatedClass : classRecord
      )
    )
    setEditingClass(null)
    toast.success(`Class ${updatedClass.className} updated.`)
  }
  const createClass = (classRecord: ClassRecord) => {
    const nextClass = {
      ...classRecord,
      createdAt: new Date().toISOString().slice(0, 10),
      id: createNextClassId(classRecords)
    }

    setClassRecords(current => [nextClass, ...current])
    setIsCreateClassOpen(false)
    setCurrentPage(1)
    clearSelection()
    toast.success(`Class ${nextClass.className} added.`)
  }
  const toolbarProps = useMemo<ClassesToolbarProps>(
    () => ({
      classCodeOptions,
      classNameOptions,
      draftFilters,
      hasFilters,
      isColumnsOpen,
      isFilterOpen,
      isSortOpen,
      sortDescriptor,
      visibleColumns,
      onApplyFilters: applyFilters,
      onColumnsOpenChange: handleColumnsOpenChange,
      onDraftFiltersChange: setDraftFilters,
      onFilterOpenChange: handleFilterOpenChange,
      onResetFilters: resetFilters,
      onSortOpenChange: handleSortOpenChange,
      onSortChange: handleSortChange,
      onVisibleColumnsChange: setVisibleColumns
    }),
    [
      classCodeOptions,
      classNameOptions,
      draftFilters,
      hasFilters,
      applyFilters,
      handleColumnsOpenChange,
      handleFilterOpenChange,
      handleSortChange,
      handleSortOpenChange,
      isColumnsOpen,
      isFilterOpen,
      isSortOpen,
      resetFilters,
      sortDescriptor,
      visibleColumns
    ]
  )
  const toolbarContent = useMemo(
    () => ({
      desktop: <ClassesHeaderToolbar {...toolbarProps} />,
      mobile: <ClassesMobileToolbar {...toolbarProps} />
    }),
    [toolbarProps]
  )

  useSectionToolbarContent(toolbarContent)

  return (
    <section className="demo-classes-content relative flex h-full min-h-0 flex-1 flex-col gap-4">
      {activeFilters.length > 0 && (
        <div
          role="group"
          aria-label="Active class filters"
          className="flex flex-wrap items-center gap-2">
          {activeFilters.map(filter => {
            const label = `${filterLabels[filter.key]}: ${filter.value}`

            return (
              <Chip
                key={filter.key}
                color="default"
                variant="soft"
                className="gap-1.5">
                <Chip.Label>{label}</Chip.Label>
                <CloseButton
                  aria-label={`Remove ${label} filter`}
                  className="h-5 min-h-5 w-5 min-w-5 rounded-full p-0"
                  onPress={() => removeFilter(filter.key)}
                />
              </Chip>
            )
          })}
        </div>
      )}

      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2 overflow-hidden">
        <ClassesTable
          records={pageClasses}
          selectedKeys={selectedKeys}
          sortDescriptor={sortDescriptor}
          visibleColumns={visibleColumns}
          onOpenClass={setDetailClass}
          onSelectionChange={setSelectedKeys}
          onSortChange={handleSortChange}
        />
        <ClassesPagination
          currentPage={activePage}
          pageSize={pageSize}
          totalItems={sortedClasses.length}
          totalPages={totalPages}
          onPageChange={page => {
            setCurrentPage(page)
            clearSelection()
          }}
          onPageSizeChange={nextPageSize => {
            setPageSize(nextPageSize as (typeof pageSizeOptions)[number])
            resetPage()
          }}
        />
      </div>

      <ClassDetailsSheet
        classRecord={detailClass}
        onOpenChange={isOpen => {
          if (!isOpen) setDetailClass(null)
        }}
        onEdit={classRecord => {
          setDetailClass(null)
          setEditingClass(classRecord)
        }}
      />
      <ClassFormSheet
        classRecord={editingClass}
        isCreateMode={false}
        isOpen={Boolean(editingClass)}
        onOpenChange={isOpen => {
          if (!isOpen) setEditingClass(null)
        }}
        onSave={saveClass}
      />
      <ClassFormSheet
        classRecord={null}
        isCreateMode
        isOpen={isCreateClassOpen}
        onOpenChange={setIsCreateClassOpen}
        onSave={createClass}
      />
      <ClassesActionBar
        selectedCount={selectedClasses.length}
        onClear={clearSelection}
        onCopyIds={() =>
          copyToClipboard(
            selectedClasses.map(classRecord => classRecord.id).join('\n'),
            `${selectedClasses.length} class ${
              selectedClasses.length === 1 ? 'ID' : 'IDs'
            } copied.`
          )
        }
        onCopyLinks={() =>
          copyToClipboard(
            selectedClasses
              .map(
                classRecord =>
                  `${window.location.origin}/academic/classes/allclasses/${classRecord.id}`
              )
              .join('\n'),
            `${selectedClasses.length} class ${
              selectedClasses.length === 1 ? 'link' : 'links'
            } copied.`
          )
        }
        onDelete={deleteSelectedClasses}
        onEdit={() => setEditingClass(selectedClasses[0] ?? null)}
      />
    </section>
  )
}

export default ClassesContent
