import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ClassesPagination } from './classes-table'

describe('Classes pagination', () => {
  it('sends numeric page changes for previous, next, and direct selection', () => {
    const onPageChange = vi.fn()
    render(
      <ClassesPagination
        currentPage={2}
        pageSize={10}
        totalItems={30}
        totalPages={3}
        onPageChange={onPageChange}
        onPageSizeChange={vi.fn()}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Prev' }))
    expect(onPageChange).toHaveBeenLastCalledWith(1)
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(onPageChange).toHaveBeenLastCalledWith(3)
    fireEvent.click(screen.getByRole('button', { name: '1' }))
    expect(onPageChange).toHaveBeenLastCalledWith(1)
    expect(onPageChange).toHaveBeenCalledTimes(3)
  })
})
