import { notFound } from '@tanstack/react-router'

import type { AppNavigationItem } from '@vx/react'

import { getNavigationChildren } from '@generated/navigation'

export type MenuKey = 'tabs' | 'workspace' | 'academic'

const findPath = (
  items: AppNavigationItem[],
  pathname: string
): AppNavigationItem[] | undefined => {
  for (const item of items) {
    if (item.href === pathname) return [item]
    const children = findPath(item.children ?? [], pathname)
    if (children) return [item, ...children]
  }
  return undefined
}

export const getNavigationPage = (menuKey: MenuKey, pathname: string) => {
  const items: AppNavigationItem[] = getNavigationChildren(menuKey)
  const path = findPath(items, pathname)
  if (!path) throw notFound()
  const section = path[0]
  const page = path[path.length - 1]
  const tabs = menuKey === 'tabs' ? items : (section.children ?? [])
  return { items, section, page, tabs }
}

export const getDefaultDestination = (item: AppNavigationItem): string => {
  const child = item.children?.[0]
  if (child) return getDefaultDestination(child)
  if (!item.href) throw new Error(`Missing navigation destination: ${item.key}`)
  return item.href
}
