import { Checkbox, Table } from '@vezham/react-v3'
import { AppIcon } from '@vezham/react/app-icon'

type Column = {
  defaultWidth: number
  key: string
  label: string
  maxWidth?: number
  minWidth?: number
}

type Props = {
  columns: readonly Column[]
  rowHeaderKey?: string
  selectionColumnClassName: string
  sortableHeaderClassName: string
  visibleColumns: ReadonlySet<string>
}

export const AcademicTableHeader = ({
  columns,
  rowHeaderKey,
  selectionColumnClassName,
  sortableHeaderClassName,
  visibleColumns
}: Props) => (
  <Table.Header>
    <Table.Column className={selectionColumnClassName} width={48}>
      <Checkbox aria-label="Select all rows" slot="selection">
        <Checkbox.Control>
          <Checkbox.Indicator />
        </Checkbox.Control>
      </Checkbox>
    </Table.Column>
    {columns
      .filter(column => visibleColumns.has(column.key))
      .map(column => (
        <Table.Column
          key={column.key}
          allowsSorting
          defaultWidth={column.defaultWidth}
          id={column.key}
          isRowHeader={rowHeaderKey ? column.key === rowHeaderKey : undefined}
          maxWidth={column.maxWidth}
          minWidth={column.minWidth}>
          {({ sortDirection }) => (
            <>
              <span className={sortableHeaderClassName}>
                {column.label}
                <AppIcon
                  icon={
                    sortDirection === 'ascending'
                      ? 'vx:chevron-up'
                      : sortDirection === 'descending'
                        ? 'vx:chevron-down'
                        : 'vx:chevrons-up-down'
                  }
                  size={14}
                  aria-hidden="true"
                />
              </span>
              <Table.ColumnResizer
                aria-label={`Resize ${column.label.toLowerCase()} column`}
              />
            </>
          )}
        </Table.Column>
      ))}
  </Table.Header>
)
