import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter
} from '@tanstack/react-router'
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within
} from '@testing-library/react'
import { StrictMode } from 'react'
import { vi } from 'vitest'

import { AppLayout } from '@vx/react/layouts/app'

import { controlCenter, navigationItems } from '../src/generated/navigation'
import { vxI18n } from '../src/generated/vx'

const renderDemoLayout = async () => {
  // vx-bot/NOTE: Mount the shell without nesting RootDocument's HTML inside a div.
  const root = createRootRoute({
    component: () => (
      <StrictMode>
        <AppLayout
          navigationItems={navigationItems}
          controlCenter={controlCenter}
          i18n={vxI18n}>
          Demo
        </AppLayout>
      </StrictMode>
    )
  })
  const home = createRoute({ getParentRoute: () => root, path: '/' })
  const router = createRouter({
    routeTree: root.addChildren([home]),
    history: createMemoryHistory({ initialEntries: ['/'] })
  })
  await router.load()
  return render(<RouterProvider router={router} />)
}

describe('Demo Control Center', () => {
  let originalDirection: string | null
  let originalLanguage: string | null
  beforeEach(() => {
    originalDirection = document.documentElement.getAttribute('dir')
    originalLanguage = document.documentElement.getAttribute('lang')
  })
  beforeAll(() => {
    Element.prototype.getAnimations = () => []
  })
  afterEach(() => {
    vi.restoreAllMocks()
    document.documentElement.classList.remove('dark')
    document.documentElement.removeAttribute('data-theme-mode')
    document.documentElement.removeAttribute('data-vx-theme-color')
    for (const [attribute, value] of [
      ['dir', originalDirection],
      ['lang', originalLanguage]
    ] as const) {
      if (value === null) document.documentElement.removeAttribute(attribute)
      else document.documentElement.setAttribute(attribute, value)
    }
  })

  it.each([false, true])(
    'opens from the footer with working appearance controls (mobile: %s)',
    async mobile => {
      const matchMedia = window.matchMedia.bind(window)
      vi.spyOn(window, 'matchMedia').mockImplementation(query => ({
        ...matchMedia(query),
        matches:
          mobile && ['(max-width: 767px)', '(width < 768px)'].includes(query)
      }))
      await renderDemoLayout()
      const trigger = await screen.findByRole('button', {
        name: mobile ? 'Open footer actions' : 'Control center'
      })
      if (mobile)
        expect(
          screen.queryByRole('button', { name: 'Control center' })
        ).toBeNull()
      act(() => trigger.focus())
      fireEvent.click(trigger)
      if (mobile)
        fireEvent.click(
          await screen.findByRole('menuitem', { name: 'Control center' })
        )
      const dialog = await screen.findByRole('dialog', {
        name: 'Control Center'
      })
      expect(Boolean(dialog.closest('[data-slot="sheet-backdrop"]'))).toBe(
        mobile
      )
      fireEvent.click(
        within(dialog).getAllByRole('button', {
          name: 'Switch to dark mode'
        })[0]
      )
      await within(dialog).findAllByRole('button', {
        name: 'Switch to light mode'
      })
      expect(document.documentElement.classList.contains('dark')).toBe(true)
      fireEvent.click(
        within(dialog).getByRole('button', { name: 'Switch to light mode' })
      )
      await within(dialog).findByRole('button', { name: 'Switch to dark mode' })
      expect(document.documentElement.classList.contains('dark')).toBe(false)

      fireEvent.click(within(dialog).getByRole('button', { name: 'Direction' }))
      const rtl = await within(dialog).findByRole('button', { name: 'RTL' })
      fireEvent.click(rtl)
      await waitFor(() => expect(document.documentElement.dir).toBe('rtl'))
      expect(rtl.getAttribute('aria-pressed')).toBe('true')
      fireEvent.click(within(dialog).getByRole('button', { name: 'LTR' }))
      await waitFor(() => expect(document.documentElement.dir).toBe('ltr'))
      fireEvent.click(
        within(dialog).getByRole('button', { name: 'Back to Control Center' })
      )

      fireEvent.click(
        await within(dialog).findByRole('button', { name: 'Language' })
      )
      const languageNames = new Intl.DisplayNames([vxI18n.defaultLanguage], {
        type: 'language'
      })
      for (const language of vxI18n.languages) {
        const option = await within(dialog).findByRole('button', {
          name: languageNames.of(language) ?? language
        })
        document.documentElement.lang = 'und'
        fireEvent.click(option)
        await waitFor(() =>
          expect(document.documentElement.lang).toBe(language)
        )
        expect(option.getAttribute('aria-pressed')).toBe('true')
      }
      fireEvent.click(
        within(dialog).getByRole('button', { name: 'Back to Control Center' })
      )

      fireEvent.click(
        await within(dialog).findByRole('button', { name: 'Theme' })
      )
      const purple = await within(dialog).findByRole('option', {
        name: 'Purple'
      })
      fireEvent.click(purple)
      await waitFor(() =>
        expect(purple.getAttribute('aria-selected')).toBe('true')
      )
      expect(document.documentElement.getAttribute('data-vx-theme-color')).toBe(
        'purple'
      )
      expect(document.documentElement.style.getPropertyValue('--accent')).toBe(
        '#7d3fc8'
      )
      expect(document.documentElement.classList.contains('dark')).toBe(false)
      fireEvent.click(within(dialog).getByRole('button', { name: 'Default' }))
      await waitFor(() =>
        expect(
          document.documentElement.style.getPropertyValue('--accent')
        ).toBe('')
      )
      fireEvent.keyDown(dialog, { key: 'Escape' })
      await waitFor(() =>
        expect(
          screen.queryByRole('dialog', { name: 'Control Center' })
        ).toBeNull()
      )
      await waitFor(() => expect(document.activeElement).toBe(trigger))
    },
    15000
  )
})
