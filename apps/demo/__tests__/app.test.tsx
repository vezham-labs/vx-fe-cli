import { RouterProvider, createMemoryHistory } from '@tanstack/react-router'
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within
} from '@testing-library/react'
import { vi } from 'vitest'

import { createRouter } from '@vezham/start/router/tanstack'

import { vxI18n } from '../src/generated/vx'
import { routeTree } from '../src/routeTree.gen'

const renderApp = async (path = '/') => {
  const router = createRouter({
    history: createMemoryHistory({
      initialEntries: [path]
    }),
    routeTree
  })

  await router.load()
  return { ...render(<RouterProvider router={router} />), router }
}

describe('App', () => {
  afterEach(() => vi.restoreAllMocks())

  beforeAll(() => {
    Element.prototype.getAnimations = () => []
  })

  it('uses the configured default language for the document', async () => {
    await renderApp()

    await waitFor(() =>
      expect(document.documentElement.lang).toBe(vxI18n.defaultLanguage)
    )
  })

  it('should render successfully', async () => {
    const { baseElement } = await renderApp()

    await waitFor(() => expect(baseElement).toBeTruthy())
  })

  it('should mount app shell container', async () => {
    const { baseElement } = await renderApp()

    await waitFor(() =>
      expect(baseElement.querySelector('.vx-app')).toBeTruthy()
    )
  })

  it('keeps the info panel mounted when navigating to an unknown page and back', async () => {
    window.localStorage.setItem(
      'vx-app:info-panel',
      JSON.stringify({ activeInfoPanel: 'bookmarks', isOpen: true })
    )
    const { baseElement, router } = await renderApp(
      '/academic/classes/allclasses'
    )
    await screen.findByRole('tab', { name: 'All Classes' })
    const panel = baseElement.querySelector('[data-vx="info-panel"]')
    expect(panel).toBeTruthy()

    await act(() => router.navigate({ to: '/operations' }))
    expect(router.state.location.pathname).toBe('/operations')
    expect(baseElement.querySelector('[data-vx="info-panel"]')).toBe(panel)

    await act(() => router.navigate({ to: '/academic/classes/allclasses' }))
    await screen.findByRole('tab', { name: 'All Classes' })
    expect(baseElement.querySelector('[data-vx="info-panel"]')).toBe(panel)
    window.localStorage.removeItem('vx-app:info-panel')
  })

  it('loads child menus as tabs and navigates between them', async () => {
    await renderApp('/tabs/overview')

    const activity = await screen.findByRole('tab', { name: 'Activity' })
    fireEvent.click(activity)

    await waitFor(() =>
      expect(activity.getAttribute('aria-selected')).toBe('true')
    )
    expect(screen.getByRole('tabpanel').textContent).toContain('/tabs/activity')
  })

  it('loads sidebar sections with their own route tabs', async () => {
    await renderApp('/workspace/projects/activity')

    const sidebar = await screen.findByRole('navigation', {
      name: 'Workspace sections'
    })
    expect(
      screen
        .getByRole('tab', { name: 'Activity' })
        .getAttribute('aria-selected')
    ).toBe('true')
    fireEvent.click(within(sidebar).getByRole('link', { name: 'Team' }))

    const members = await screen.findByRole('tab', { name: 'Members' })
    expect(members.getAttribute('aria-selected')).toBe('true')
    fireEvent.click(screen.getByRole('tab', { name: 'Roles' }))
    await waitFor(() =>
      expect(screen.getByRole('tabpanel').textContent).toContain(
        '/workspace/team/roles'
      )
    )
  })

  it('keeps navigation collapsed while changing child routes', async () => {
    const matchMedia = window.matchMedia.bind(window)
    vi.spyOn(window, 'matchMedia').mockImplementation(query => ({
      ...matchMedia(query),
      matches: query === '(min-width: 768px)'
    }))
    await renderApp('/workspace/projects/overview')
    await screen.findByRole('navigation', { name: 'Workspace sections' })
    const hideSidebar = screen
      .getAllByRole('button', { name: 'Hide Sidebar' })
      .find(button => button.hasAttribute('aria-controls'))
    if (!hideSidebar) throw new Error('Hide Sidebar control was not found')
    fireEvent.click(hideSidebar)
    expect(
      screen.queryByRole('navigation', { name: 'Workspace sections' })
    ).toBeNull()
    fireEvent.click(screen.getByRole('tab', { name: 'Activity' }))
    await waitFor(() =>
      expect(screen.getByRole('tabpanel').textContent).toContain(
        '/workspace/projects/activity'
      )
    )
    expect(
      screen.queryByRole('navigation', { name: 'Workspace sections' })
    ).toBeNull()
    fireEvent.keyDown(document.body, { key: 's', code: 'KeyS', metaKey: true })
    fireEvent.keyUp(document.body, { key: 's', code: 'KeyS', metaKey: true })
    expect(
      screen.getByRole('navigation', { name: 'Workspace sections' })
    ).toBeTruthy()
  })

  it('opens section navigation in a drawer and closes it after selecting a section', async () => {
    const matchMedia = window.matchMedia.bind(window)
    vi.spyOn(window, 'matchMedia').mockImplementation(query => ({
      ...matchMedia(query),
      matches: query === '(max-width: 767px)'
    }))
    await renderApp('/workspace/projects/overview')
    const bubble = await screen.findByRole('group', {
      name: 'Mobile navigation controls'
    })
    fireEvent.click(
      await within(bubble).findByRole('button', { name: 'Show Sidebar' })
    )
    const drawer = await screen.findByRole('dialog', { name: 'Projects' })
    fireEvent.click(within(drawer).getByRole('link', { name: 'Team' }))
    await screen.findByRole('tab', { name: 'Members' })
    await waitFor(() =>
      expect(screen.queryByRole('dialog', { name: 'Projects' })).toBeNull()
    )
  })

  it.each([
    ['/tabs', '/tabs/overview'],
    ['/workspace', '/workspace/projects/overview']
  ])('opens the default child at %s', async (path, title) => {
    await renderApp(path)
    await waitFor(() =>
      expect(screen.getByRole('tabpanel').textContent).toContain(title)
    )
  })
})
