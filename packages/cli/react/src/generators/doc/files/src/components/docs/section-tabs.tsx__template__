import { Link } from '@tanstack/react-router'

import { useNotebookLayout } from '@vezham/docs-react/layouts/notebook'
import { Sidebar } from '@vezham/icons-react'

import { i18n } from '@app/docs'
import { sectionTabVariants } from '@components/docs/navigation.variants'
import {
  type PlatformSection,
  platformSections
} from '@components/docs/platform-sections'
import type { Locale } from '@generated/vx'

type Props = {
  locale: Locale
  platform: 'web' | 'native'
  selectedSection: PlatformSection
}

export const SectionTabs = ({ locale, platform, selectedSection }: Props) => {
  const { props: layoutProps, slots } = useNotebookLayout()
  const SidebarCollapseTrigger = slots.sidebar.collapseTrigger

  return (
    <div
      data-header-tabs=""
      className="flex h-10 items-center border-b px-4 max-lg:hidden md:px-6">
      <SidebarCollapseTrigger className="text-muted hover:bg-default-hover hover:text-foreground -ms-1 inline-flex size-8 shrink-0 items-center justify-center rounded-md">
        <Sidebar size={16} />
      </SidebarCollapseTrigger>
      <nav
        aria-label="Documentation sections"
        className="ms-3 flex h-full items-end gap-6">
        {platformSections.map(item => (
          <Link
            key={item.id}
            to="/{-$lang}/ui-notebook-platform/$platform/$"
            params={{
              lang: locale === i18n.defaultLanguage ? undefined : locale,
              platform,
              _splat: item.page
            }}
            className={sectionTabVariants({
              selected: item.id === selectedSection
            })}>
            {item.title}
          </Link>
        ))}
      </nav>
      <div className="ms-auto shrink-0">{layoutProps.nav?.children}</div>
    </div>
  )
}
