import { RouterProvider, createMemoryHistory } from '@tanstack/react-router'
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within
} from '@testing-library/react'

import { toast } from '@vezham/react-v3'
import { createRouter } from '@vezham/start/router/tanstack'

import { routeTree } from '../src/routeTree.gen'

const renderApp = async (path = '/') => {
  const router = createRouter({
    history: createMemoryHistory({ initialEntries: [path] }),
    routeTree
  })
  await router.load()
  render(<RouterProvider router={router} />, { container: document })
  return router
}

describe('Navigation toolbar', () => {
  afterEach(() => {
    cleanup()
    if (!document.documentElement) {
      const html = document.createElement('html')
      html.append(
        document.createElement('head'),
        document.createElement('body')
      )
      document.append(html)
    }
  })

  beforeAll(() => {
    Element.prototype.getAnimations = () => []
  })

  it('opens page search without opening command search', async () => {
    await renderApp('/tabs/overview')
    fireEvent.click(await screen.findByRole('button', { name: 'Search' }))
    const dialog = await screen.findByRole('dialog', { name: 'Search content' })
    const search = within(dialog).getByRole('searchbox')
    fireEvent.change(search, { target: { value: 'overview' } })
    expect((search as HTMLInputElement).value).toBe('overview')
    expect(screen.queryByPlaceholderText(/Search commands/)).toBeNull()
  })

  it('opens the class editor and discards unsaved changes when reopened', async () => {
    await renderApp('/academic/classes/allclasses')
    const create = await screen.findByRole('button', { name: 'Add Class' })
    fireEvent.click(create)
    const editor = await screen.findByRole('dialog', { name: 'Add Class' })
    expect(
      within(editor).getByRole('textbox', { name: /class name/i })
    ).toBeTruthy()
    fireEvent.change(
      within(editor).getByRole('textbox', { name: /class name/i }),
      { target: { value: 'Unsaved class' } }
    )
    fireEvent.click(within(editor).getByRole('button', { name: 'Cancel' }))
    await waitFor(() =>
      expect(screen.queryByRole('dialog', { name: 'Add Class' })).toBeNull()
    )

    fireEvent.click(create)
    const reopenedEditor = await screen.findByRole('dialog', {
      name: 'Add Class'
    })
    expect(
      (
        within(reopenedEditor).getByRole('textbox', {
          name: /class name/i
        }) as HTMLInputElement
      ).value
    ).toBe('')
    fireEvent.click(
      within(reopenedEditor).getByRole('button', { name: 'Cancel' })
    )
    await waitFor(() =>
      expect(screen.queryByRole('dialog', { name: 'Add Class' })).toBeNull()
    )
  })

  it('keeps page-specific view, navigation, and filter actions working', async () => {
    const router = await renderApp('/academic/classes/allclasses')
    await screen.findByRole('button', { name: 'Add Class' })
    const viewOptions = screen.getByRole('group', { name: 'View options' })
    expect(
      within(viewOptions)
        .getByRole('button', { name: 'Grid view' })
        .getAttribute('aria-pressed')
    ).toBe('true')
    fireEvent.click(
      within(viewOptions).getByRole('button', { name: 'List view' })
    )
    expect(
      within(viewOptions)
        .getByRole('button', { name: 'List view' })
        .getAttribute('aria-pressed')
    ).toBe('true')

    await act(async () => {
      await router.navigate({
        to: '/academic/$',
        params: { _splat: 'classes/schedule' }
      })
    })
    await screen.findByRole('button', { name: 'Add Schedule' })
    expect(screen.getByRole('tabpanel').textContent).toContain(
      '/academic/classes/schedule'
    )
    const actions = screen.getByRole('group', { name: 'Toolbar actions' })
    const filter = within(actions).getByRole('button', { name: 'Filter' })
    fireEvent.click(filter)
    fireEvent.click(await screen.findByRole('menuitem', { name: 'Images' }))
    expect(filter.getAttribute('aria-pressed')).toBe('true')
  })

  it('loads class filters from the URL, removes them, and follows subsequent navigation', async () => {
    const router = await renderApp('/academic/classes/allclasses?code=C138038')
    const remove = await screen.findByRole('button', {
      name: 'Remove Code: C138038 filter'
    })
    const table = screen.getByRole('grid')
    expect(within(table).getByText('C138038')).toBeTruthy()
    expect(within(table).queryByText('C138037')).toBeNull()
    fireEvent.click(remove)
    await waitFor(() =>
      expect(router.state.location.search.code).toBeUndefined()
    )
    await within(table).findByText('C138037')
    await act(async () => {
      await router.navigate({
        to: '/academic/$',
        params: { _splat: 'classes/allclasses' },
        search: { status: 'Inactive' }
      })
    })
    await screen.findByRole('button', {
      name: 'Remove Status: Inactive filter'
    })
    expect(within(table).queryByText('C138038')).toBeNull()
  })

  it('shows the Sync placeholder without refreshing and hides Add on result pages', async () => {
    const router = await renderApp('/academic/examinations/exam-results')
    await screen.findByRole('link', { name: 'Exam Results' })
    const actions = screen.getByRole('group', { name: 'Toolbar actions' })
    expect(within(actions).queryByRole('button', { name: /^Add / })).toBeNull()
    const refresh = vi.spyOn(router, 'invalidate')
    const notice = vi.spyOn(toast, 'info').mockReturnValue('sync-notice')
    try {
      fireEvent.click(screen.getByRole('button', { name: 'Sync' }))
      expect(notice).toHaveBeenCalledWith('Server sync is not implemented yet.')
      expect(refresh).not.toHaveBeenCalled()
    } finally {
      notice.mockRestore()
      refresh.mockRestore()
    }
    expect(
      await screen.findByText('/academic/examinations/exam-results')
    ).toBeTruthy()
  })
})
