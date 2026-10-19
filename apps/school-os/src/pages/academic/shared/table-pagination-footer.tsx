import { ListBox, Pagination, Select, Table } from '@vezham/react-v3'

import { PaginationControls } from '@vx/react/pagination'

type Props = {
  currentPage: number
  rowsControlsClassName: string
  rowsPerPage: string
  summary: string
  totalPages: number
  rowCountOptions: readonly string[]
  onPageChange: (value: number | ((current: number) => number)) => void
  onRowsPerPageChange: (value: string | number | null) => void
}

export const TablePaginationFooter = ({
  currentPage,
  rowsControlsClassName,
  rowsPerPage,
  summary,
  totalPages,
  rowCountOptions,
  onPageChange,
  onRowsPerPageChange
}: Props) => (
  <Table.Footer>
    <Pagination className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className={rowsControlsClassName}>
        <Pagination.Summary>{summary}</Pagination.Summary>
        <span aria-hidden="true" className="text-muted">
          |
        </span>
        <Select
          aria-label="Rows per page"
          value={rowsPerPage}
          onChange={onRowsPerPageChange}>
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {rowCountOptions.map(option => (
                <ListBox.Item key={option} id={option} textValue={option}>
                  {option}
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>
        <span aria-hidden="true" className="text-muted text-sm">
          per page
        </span>
      </div>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </Pagination>
  </Table.Footer>
)
