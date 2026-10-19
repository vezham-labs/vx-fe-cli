import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'

import { Pagination } from '@vezham/react-v3'

import { PaginationControls } from './index'

const StatefulPagination = () => {
  const [page, setPage] = useState(1)
  return (
    <Pagination>
      <PaginationControls
        currentPage={page}
        totalPages={3}
        onPageChange={setPage}
      />
    </Pagination>
  )
}

describe('Pagination controls', () => {
  it('selects pages, advances and returns, and disables navigation at each boundary', () => {
    render(<StatefulPagination />)
    const previous = screen.getByRole('button', { name: 'Prev' })
    const next = screen.getByRole('button', { name: 'Next' })
    expect(previous).toBeDisabled()
    fireEvent.click(next)
    expect(screen.getByRole('button', { name: '2' })).toHaveAttribute(
      'aria-current',
      'page'
    )
    fireEvent.click(screen.getByRole('button', { name: '3' }))
    expect(next).toBeDisabled()
    fireEvent.click(previous)
    expect(screen.getByRole('button', { name: '2' })).toHaveAttribute(
      'aria-current',
      'page'
    )
    fireEvent.click(screen.getByRole('button', { name: '1' }))
    expect(previous).toBeDisabled()
  })
})
