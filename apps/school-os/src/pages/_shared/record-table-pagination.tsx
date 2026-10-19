import type { Dispatch, SetStateAction } from 'react'

import { Pagination, Table } from '@vezham/react-v3'

import { PaginationControls } from '@vx/react/pagination'

import { getPaginationSummary } from '@pages/_shared/table-utils'

export type RecordTablePaginationProps = {
  className: string
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
  onPageChange: Dispatch<SetStateAction<number>>
}

export const RecordTablePagination = ({
  className,
  currentPage,
  pageSize,
  totalItems,
  totalPages,
  onPageChange
}: RecordTablePaginationProps) => (
  <Table.Footer className={className}>
    <Pagination>
      <Pagination.Summary>
        {getPaginationSummary(currentPage, pageSize, totalItems)}
      </Pagination.Summary>
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </Pagination>
  </Table.Footer>
)
