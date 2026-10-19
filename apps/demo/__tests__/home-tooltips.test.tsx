import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Home } from '@vx/template/pages'

vi.mock('../../../packages/vx/template/src/lib/pages/home/posts', () => ({
  Posts: () => null
}))

describe('Home tooltips', () => {
  it.each([
    ['User avatar', 'jane@example.com'],
    ['Status chip', 'Jane is currently online'],
    ['Info icon', 'Help Information']
  ])('opens %s on hover and keyboard focus', async (label, content) => {
    render(<Home onPress={vi.fn()} />)
    const trigger = screen.getByRole('button', { name: label })
    fireEvent.pointerMove(trigger, { pointerType: 'mouse' })
    fireEvent.mouseMove(trigger)
    fireEvent.pointerEnter(trigger, { pointerType: 'mouse' })
    fireEvent.mouseEnter(trigger)
    expect((await screen.findByRole('tooltip')).textContent).toContain(content)
    fireEvent.pointerLeave(trigger, { pointerType: 'mouse' })
    fireEvent.mouseLeave(trigger)
    await waitFor(() => expect(screen.queryByRole('tooltip')).toBeNull())
    fireEvent.keyDown(document.body, { key: 'Tab' })
    act(() => trigger.focus())
    expect((await screen.findByRole('tooltip')).textContent).toContain(content)
  })
})
