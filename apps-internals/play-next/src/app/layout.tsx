import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import { defineConfig } from '@vx/start/next'

import { nextMetadata, nextViewport, vxI18n } from '@generated/vx'

import './global.css'

type Props = {
  children: ReactNode
}

export default ({ children }: Props) =>
  defineConfig({ children, lang: vxI18n?.defaultLanguage })

export const metadata: Metadata = {
  ...nextMetadata,
  metadataBase: new URL(nextMetadata.metadataBase)
}

export const viewport: Viewport = nextViewport
