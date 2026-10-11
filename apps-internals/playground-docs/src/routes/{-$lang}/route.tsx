import { Outlet, createFileRoute } from '@tanstack/react-router'

import { assertRouteLocale, parseRouteLocale } from '@vx/start/tanstack-docs'

import { i18n } from '@app/docs'

export const Route = createFileRoute('/{-$lang}')({
  beforeLoad: ({ location, params }) => {
    assertRouteLocale(i18n, params, location)
  },
  component: Outlet,
  params: {
    parse: params => parseRouteLocale(i18n, params)
  }
})
