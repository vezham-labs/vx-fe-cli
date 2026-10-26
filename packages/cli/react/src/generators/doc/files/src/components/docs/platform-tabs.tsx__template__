import { Link } from '@tanstack/react-router'
import type { ComponentPropsWithoutRef } from 'react'

import { Globe, Smartphone } from '@vezham/icons-react'
import { Tabs } from '@vezham/react-v3'

import { platformIconVariants } from '@components/docs/navigation.variants'

type Platform = 'web' | 'native'

type Props = {
  getPlatformParams: (platform: Platform) => {
    _splat: string
    lang: string | undefined
    platform: Platform
  }
  platform: Platform
}

export const PlatformTabs = ({ getPlatformParams, platform }: Props) => (
  <Tabs selectedKey={platform} keyboardActivation="manual">
    <Tabs.ListContainer>
      <Tabs.List aria-label="Documentation platform">
        <Tabs.Tab
          id="web"
          render={props => {
            const linkProps = {
              ...(props as ComponentPropsWithoutRef<'a'>)
            }
            delete linkProps.href
            return (
              <Link
                {...linkProps}
                to="/{-$lang}/ui-notebook-platform/$platform/$"
                params={getPlatformParams('web')}
              />
            )
          }}>
          <Globe
            size={16}
            className={platformIconVariants({
              platform: 'web',
              selected: platform === 'web'
            })}
          />
          Web
          <Tabs.Indicator />
        </Tabs.Tab>
        <Tabs.Tab
          id="native"
          render={props => {
            const linkProps = {
              ...(props as ComponentPropsWithoutRef<'a'>)
            }
            delete linkProps.href
            return (
              <Link
                {...linkProps}
                to="/{-$lang}/ui-notebook-platform/$platform/$"
                params={getPlatformParams('native')}
              />
            )
          }}>
          <Smartphone
            size={16}
            className={platformIconVariants({
              platform: 'native',
              selected: platform === 'native'
            })}
          />
          Native
          <Tabs.Indicator />
        </Tabs.Tab>
      </Tabs.List>
    </Tabs.ListContainer>
  </Tabs>
)
