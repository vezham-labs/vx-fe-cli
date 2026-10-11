import { useRouter } from '@tanstack/react-router'

import { useTheme } from '@vezham/docs-react/provider/base'

import { ConfiguredControlCenter as SharedControlCenter } from '@vx/react/control-center'
import { getLanguageDisplayName } from '@vx/start/tanstack-docs'

import { i18n } from '@app/docs'
import { controlCenter } from '@generated/navigation'
import type { Locale } from '@generated/vx'

type Props = { locale: Locale; page: string; platform: 'web' | 'native' }

export const ControlCenter = ({ locale, page, platform }: Props) => {
  const router = useRouter()
  const { resolvedTheme, setTheme } = useTheme()
  const languageLocation = (language: Locale) => ({
    to: '/{-$lang}/ui-notebook-platform/$platform/$' as const,
    params: {
      lang: language === i18n.defaultLanguage ? undefined : language,
      platform,
      _splat: page
    }
  })
  return (
    <SharedControlCenter
      appearance={{
        isDark: resolvedTheme === 'dark',
        setDark: dark => setTheme(dark ? 'dark' : 'light')
      }}
      context={{
        language: {
          value: locale,
          options: i18n.languages.map(language => ({
            value: language,
            label: getLanguageDisplayName(language),
            href: router.buildLocation(languageLocation(language)).href
          })),
          onChange: (value: string) => {
            const language = i18n.languages.find(language => language === value)
            if (language) void router.navigate(languageLocation(language))
          }
        }
      }}
      config={controlCenter}
    />
  )
}
