import { RouterProvider, createMemoryHistory } from '@tanstack/react-router'
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within
} from '@testing-library/react'

import { createRouter } from '@vezham/start/router/tanstack'

import { routeTree } from '../src/routeTree.gen'

const renderApp = async (path = '/') => {
  const router = createRouter({
    history: createMemoryHistory({
      initialEntries: [path]
    }),
    routeTree
  })

  await router.load()
  return render(<RouterProvider router={router} />)
}

describe('Academic navigation', () => {
  beforeAll(() => {
    Element.prototype.getAnimations = () => []
  })

  it('opens Academic and switches between grouped and standalone pages', async () => {
    await renderApp('/academic')
    const sidebar = await screen.findByRole('navigation', {
      name: 'Academic sections'
    })
    await screen.findByRole('tab', { name: 'All Classes' })
    const toolbar = screen.getByRole('group', { name: 'Toolbar actions' })
    fireEvent.click(screen.getByRole('tab', { name: 'Schedule' }))
    await waitFor(() =>
      expect(screen.getByRole('tabpanel').textContent).toContain(
        '/academic/classes/schedule'
      )
    )

    fireEvent.click(
      within(sidebar).getByRole('button', { name: 'Examinations' })
    )
    expect(screen.getByRole('link', { name: 'Exam Results' })).toBeTruthy()
    fireEvent.click(within(sidebar).getByRole('link', { name: 'Class Room' }))
    await screen.findByText('/academic/classroom')
    expect(screen.getByRole('group', { name: 'Toolbar actions' })).toBe(toolbar)
    expect(screen.queryByRole('tablist')).toBeNull()
    expect(
      screen.getByRole('searchbox', { name: 'Search content' })
    ).toBeTruthy()

    await screen.findByRole('link', { name: 'Exam' })
    fireEvent.click(screen.getByRole('link', { name: 'Exam Results' }))
    await waitFor(() =>
      expect(
        screen.getByText('/academic/examinations/exam-results')
      ).toBeTruthy()
    )
    expect(
      screen
        .getByRole('link', { name: 'Exam Results' })
        .getAttribute('aria-current')
    ).toBe('page')
    expect(screen.queryByRole('tablist')).toBeNull()

    fireEvent.click(
      within(
        screen.getByRole('navigation', { name: 'Academic sections' })
      ).getByRole('link', { name: 'Classes' })
    )
    const allClasses = await screen.findByRole('tab', { name: 'All Classes' })
    expect(allClasses.getAttribute('aria-selected')).toBe('true')
    expect(screen.getByRole('group', { name: 'Toolbar actions' })).toBe(toolbar)
    expect(screen.queryByRole('tab', { name: 'Exam Results' })).toBeNull()
  })

  it('loads an expanded sidebar child directly', async () => {
    await renderApp('/academic/examinations/grades')
    const grades = await screen.findByRole('link', { name: 'Grades' })
    expect(grades.getAttribute('aria-current')).toBe('page')
    expect(
      await screen.findByText('/academic/examinations/grades')
    ).toBeTruthy()
    expect(screen.queryByRole('tablist')).toBeNull()
  })

  it('shows and hides the mobile sidebar with its shortcut', async () => {
    await renderApp('/academic/classes/allclasses')
    await screen.findByRole('tab', { name: 'All Classes' })
    const toggle = () => {
      fireEvent.keyDown(document, { key: 's', code: 'KeyS', metaKey: true })
      fireEvent.keyUp(document, { key: 's', code: 'KeyS', metaKey: true })
    }

    toggle()
    const drawer = await screen.findByRole('dialog', { name: 'Classes' })
    expect(
      within(drawer).getByRole('button', { name: 'Hide Sidebar' })
    ).toBeTruthy()
    toggle()
    await waitFor(() =>
      expect(screen.queryByRole('dialog', { name: 'Classes' })).toBeNull()
    )
  })
})
