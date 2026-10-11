import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ControlCenter } from '../src/components/docs/control-center'

const app = vi.hoisted(() => ({
  setTheme: vi.fn(),
  navigate: vi.fn(),
  buildLocation: vi.fn(
    (location: {
      params: { lang?: string; platform: string; _splat: string }
    }) => ({
      href: `#${location.params.lang ?? 'en'}-${location.params.platform}-${location.params._splat}`
    })
  )
}))

vi.mock('@tanstack/react-router', async importOriginal => ({
  ...(await importOriginal<typeof import('@tanstack/react-router')>()),
  useRouter: () => app
}))
vi.mock('@vezham/docs-react/provider/base', () => ({
  useTheme: () => ({ resolvedTheme: 'dark', setTheme: app.setTheme })
}))
vi.mock('@app/docs', () => ({
  i18n: { defaultLanguage: 'en', languages: ['en', 'cn'] }
}))
vi.mock('@vx/start/tanstack-docs', () => ({
  getLanguageDisplayName: (locale: string) =>
    locale === 'en' ? 'English' : 'Chinese'
}))

beforeEach(() => vi.clearAllMocks())

describe('docs control center adapter', () => {
  it('connects shared tiles to the docs theme and preserves the current locale route context', async () => {
    const { rerender } = render(
      <ControlCenter locale="cn" page="buttons" platform="native" />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Control center' }))
    fireEvent.click(
      (
        await screen.findAllByRole('button', { name: 'Switch to light mode' })
      )[0]
    )
    expect(app.setTheme).toHaveBeenCalledWith('light')
    fireEvent.click(screen.getByRole('button', { name: 'Language' }))
    const chinese = await screen.findByRole('link', { name: 'Chinese' })
    expect(chinese.getAttribute('aria-current')).toBe('true')
    fireEvent.click(screen.getByRole('link', { name: 'English' }))
    expect(app.navigate).toHaveBeenCalledWith({
      to: '/{-$lang}/ui-notebook-platform/$platform/$',
      params: { lang: undefined, platform: 'native', _splat: 'buttons' }
    })
    rerender(<ControlCenter locale="cn" page="dialogs" platform="web" />)
    expect(chinese.getAttribute('href')).toBe('#cn-web-dialogs')
    fireEvent.click(chinese)
    expect(app.navigate).toHaveBeenLastCalledWith({
      to: '/{-$lang}/ui-notebook-platform/$platform/$',
      params: { lang: 'cn', platform: 'web', _splat: 'dialogs' }
    })
  })
})
