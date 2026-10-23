import { Avatar } from '@vezham/react-v3'
import { getInitials } from '@vezham/utils/name'

import { homeworkColumnOptions } from '@pages/academic/homework/data'
import type { ClassRow } from '@pages/academic/homework/types'
import { getPaginationSummary } from '@pages/academic/homework/utils/homework'
import {
  classNames,
  getTableRowClassName
} from '@pages/academic/homework/variants'
import { createAcademicEntityTable } from '@pages/academic/shared/entity-table'
import { rowCountOptions } from '@store/useAcademic/options'

export const HomeworkTable = createAcademicEntityTable<ClassRow, string>({
  ariaLabel: 'Schedules',
  bulkAriaLabel: 'Homework bulk actions',
  classNames,
  columns: homeworkColumnOptions,
  getPaginationSummary,
  getRowClassName: getTableRowClassName,
  renderCell: renderCellContent,
  rowCountOptions,
  rowHeaderKey: 'classes'
})

function renderCellContent(row: ClassRow, key: string) {
  switch (key) {
    case 'id':
      return row.id
    case 'classes':
      return row.classes
    case 'section':
      return row.section
    case 'subject':
      return row.subject
    case 'homeworkdate':
      return row.homeworkdate
    case 'submissiondate':
      return row.submissiondate
    case 'createdBy':
      return <CreatedByCell row={row} />
    default:
      return null
  }
}

function CreatedByCell({ row }: { row: ClassRow }) {
  const { createdBy } = row

  return (
    <div className="flex items-center gap-3">
      <Avatar size="sm">
        {createdBy.avatar && (
          <Avatar.Image src={createdBy.avatar} alt={createdBy.name} />
        )}
        <Avatar.Fallback>{getInitials(createdBy.name)}</Avatar.Fallback>
      </Avatar>
      <div className="min-w-0">
        <div className="truncate font-medium text-[#111827]">
          {createdBy.name}
        </div>
        {createdBy.secondaryText && (
          <div className="text-muted truncate text-sm">
            {createdBy.secondaryText}
          </div>
        )}
      </div>
    </div>
  )
}
