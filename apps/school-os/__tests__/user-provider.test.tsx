import { Outlet } from '@tanstack/react-router'
import { fireEvent, render, screen } from '@testing-library/react'
import type { ComponentType, ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { UserProvider, useUser } from '@vezham/react/user'

import { Route } from '../src/routes/__root'

vi.mock('@vezham/start/tanstack', () => ({
  createRootComponent:
    ({ children }: { children?: ReactNode }) =>
    () =>
      children
}))

vi.mock('@generated/vx', () => ({
  tanstackHead: {},
  vxI18n: { defaultLanguage: 'en' }
}))

vi.mock('@vezham/react/layouts/app', () => ({
  AppLayout: ({ children }: { children?: ReactNode }) => (
    <UserProvider initialUser={{ firstName: 'Mia' }}>
      <UserProbe />
      {children === undefined ? <Outlet /> : children}
    </UserProvider>
  )
}))

const UserProbe = () => {
  const { user } = useUser()

  return <nav aria-label="User menu">{user?.firstName ?? 'Signed out'}</nav>
}

vi.mock('@tanstack/react-router', async importOriginal => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>()
  return {
    ...actual,
    Outlet: () => {
      const { user, updateUser, clearUser } = useUser()
      return (
        <>
          <span>{user?.firstName ?? 'Signed out'}</span>
          <button onClick={() => updateUser({ firstName: 'Updated' })}>
            Update profile
          </button>
          <button onClick={clearUser}>Sign out</button>
        </>
      )
    }
  }
})

describe('root user provider', () => {
  it('shares user state between the layout and routed children', () => {
    const RootComponent = Route.options.component as ComponentType
    render(<RootComponent />)

    expect(screen.getAllByText('Mia')).toHaveLength(2)
    fireEvent.click(screen.getByRole('button', { name: 'Update profile' }))
    expect(screen.getAllByText('Updated')).toHaveLength(2)
    fireEvent.click(screen.getByRole('button', { name: 'Sign out' }))
    expect(screen.getAllByText('Signed out')).toHaveLength(2)
  })
})
