import { Link } from '@tanstack/react-router'
import type { ComponentProps } from 'react'

import { VezhamLogo } from '@vezham/icons-react'
import { ListBox, Select } from '@vezham/react-v3'

import { i18n } from '@app/docs'
import { ControlCenter } from '@components/docs/control-center'
import {
  type PlatformSection,
  platformSections
} from '@components/docs/platform-sections'
import { PlatformTabs } from '@components/docs/platform-tabs'
import type { Locale } from '@generated/vx'

type Platform = 'web' | 'native'

type PlatformNavigationProps = {
  getPlatformParams: (platform: Platform) => {
    _splat: string
    lang: string | undefined
    platform: Platform
  }
  platform: Platform
}

type SectionSelectProps = {
  onSectionChange: (section: PlatformSection) => void
  selectedSection: PlatformSection
}

const PlatformSectionSelect = ({
  onSectionChange,
  selectedSection
}: SectionSelectProps) => (
  <Select
    aria-label="Documentation section"
    className="w-full"
    selectedKey={selectedSection}
    onSelectionChange={key => onSectionChange(key as PlatformSection)}>
    <Select.Trigger>
      <Select.Value />
      <Select.Indicator />
    </Select.Trigger>
    <Select.Popover>
      <ListBox>
        {platformSections.map(section => (
          <ListBox.Item
            key={section.id}
            id={section.id}
            textValue={section.title}>
            {section.title}
            <ListBox.ItemIndicator />
          </ListBox.Item>
        ))}
      </ListBox>
    </Select.Popover>
  </Select>
)

type HeaderProps = ComponentProps<'div'> &
  PlatformNavigationProps & {
    locale: Locale
  } & SectionSelectProps

export const PlatformDrawerHeader = ({
  children,
  className,
  getPlatformParams,
  locale,
  onSectionChange,
  platform,
  selectedSection,
  ...props
}: HeaderProps) => {
  return (
    <>
      <div
        {...props}
        className={`flex flex-col gap-4 border-b px-4 pt-4 pb-3 md:hidden ${className ?? ''}`}>
        <div className="flex items-center justify-between gap-4 ps-1">
          <Link
            to="/{-$lang}"
            params={{
              lang: locale === i18n.defaultLanguage ? undefined : locale
            }}
            className="inline-flex items-center gap-2 font-semibold">
            <VezhamLogo size={22} />
            Developer
          </Link>
        </div>
        <PlatformSectionSelect
          selectedSection={selectedSection}
          onSectionChange={onSectionChange}
        />
      </div>
      <div
        className={`hidden flex-col gap-3 border-b p-4 md:flex lg:hidden ${className ?? ''}`}>
        <PlatformTabs
          getPlatformParams={getPlatformParams}
          platform={platform}
        />
        <PlatformSectionSelect
          selectedSection={selectedSection}
          onSectionChange={onSectionChange}
        />
      </div>
      <div className={`hidden lg:block ${className ?? ''}`}>{children}</div>
    </>
  )
}

export const PlatformDrawerFooter = ({
  className,
  getPlatformParams,
  locale,
  page,
  platform,
  ...props
}: ComponentProps<'div'> &
  PlatformNavigationProps & { locale: Locale; page: string }) => {
  return (
    <div
      {...props}
      className={`!hidden !w-full items-center !justify-between gap-2 !border-0 px-4 pt-2 pb-4 max-md:!flex ${className ?? ''}`}>
      <PlatformTabs getPlatformParams={getPlatformParams} platform={platform} />
      <ControlCenter locale={locale} page={page} platform={platform} />
    </div>
  )
}
