import { Callout } from '@vezham/docs-react/components/callout'
import { Card, Cards } from '@vezham/docs-react/components/card'
import { Heading } from '@vezham/docs-react/components/heading'

import { localizedUrl } from '@vx/start/runtime/docs'

import { i18n } from '@app/docs'
import type { Locale } from '@generated/vx'

import { layoutPreviews } from './options'

type Props = { locale: Locale }

export const previewToc = [
  { title: 'Overview', url: '#overview', depth: 2 },
  { title: 'Reading experience', url: '#reading-experience', depth: 2 },
  { title: 'Compare layouts', url: '#compare-layouts', depth: 2 }
]

export const LayoutLinks = ({ locale }: Props) => (
  <Cards>
    {layoutPreviews.map(({ id, title, description }) => (
      <Card
        key={id}
        title={title}
        description={description}
        href={localizedUrl(i18n, locale, `/layouts/${id}`)}
      />
    ))}
  </Cards>
)

export const PreviewContent = ({ locale }: Props) => (
  <>
    <Heading as="h2" id="overview">
      Overview
    </Heading>
    <p>
      The same content appears in every preview, making it easy to compare
      navigation, page width, typography, and spacing.
    </p>
    <Callout title="Try the controls">
      Switch between light and dark themes, open search, and resize the window
      to explore the mobile navigation. Search uses the playground
      documentation.
    </Callout>
    <Heading as="h2" id="reading-experience">
      Reading experience
    </Heading>
    <p>
      A documentation page should keep its content comfortable to read while
      making related pages easy to find. Notice how each layout balances the
      sidebar, reading column, and table of contents.
    </p>
    <ul>
      <li>Follow a heading link to check anchor navigation.</li>
      <li>Use the navigation to move between the five previews.</li>
      <li>Check focus indicators with the keyboard.</li>
      <li>Switch language to keep exploring the same layout.</li>
    </ul>
    <blockquote>
      Compare the layout at a wide desktop size and a narrow mobile size. The
      content stays the same; the navigation adapts.
    </blockquote>
    <Heading as="h2" id="compare-layouts">
      Compare layouts
    </Heading>
    <p>Choose another layout to see this page in a different shell.</p>
    <LayoutLinks locale={locale} />
  </>
)
