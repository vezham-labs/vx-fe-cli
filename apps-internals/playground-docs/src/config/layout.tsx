import type { BaseLayoutProps } from '@vezham/docs-react/layouts/shared'
import { VezhamLogo } from '@vezham/icons-react'

import { localizedUrl } from '@vx/start/runtime/docs'

import { i18n } from '@app/docs'
import type { Locale } from '@generated/vx'

export const baseOptions = (
  locale: Locale = i18n.defaultLanguage
): BaseLayoutProps => {
  return {
    nav: {
      title: (
        <span className="inline-flex items-center gap-2 font-semibold">
          <VezhamLogo size={22} />
          Developer
        </span>
      )
    },
    links: [
      {
        text: 'UI/platforms',
        url: localizedUrl(
          i18n,
          locale,
          '/ui-notebook-platform/web/getting-started/overview'
        ),
        active: 'nested-url'
      },
      {
        text: 'Layouts',
        url: localizedUrl(i18n, locale, '/layouts'),
        active: 'nested-url'
      },
      {
        text: 'UI/docs',
        url: localizedUrl(i18n, locale, '/ui-docs/overview'),
        active: 'nested-url'
      },
      {
        text: 'UI/flux',
        url: localizedUrl(i18n, locale, '/ui-flux/overview'),
        active: 'nested-url'
      },
      {
        text: 'UI/glass',
        url: localizedUrl(i18n, locale, '/ui-glass/overview'),
        active: 'nested-url'
      },
      {
        text: 'UI/home',
        url: localizedUrl(i18n, locale, '/ui-home/overview'),
        active: 'nested-url'
      },
      {
        text: 'UI/notebook',
        url: localizedUrl(i18n, locale, '/ui-notebook/overview'),
        active: 'nested-url'
      }
    ]
  }
}
