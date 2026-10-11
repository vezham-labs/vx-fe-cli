import type { ComponentProps } from 'react'

import { Callout } from '@vezham/docs-react/components/callout'

export const CalloutPreview = (
  props: Pick<ComponentProps<typeof Callout>, 'title' | 'type' | 'children'>
) => {
  return (
    <div className="bg-fd-background rounded-md border p-3">
      <Callout {...props} />
    </div>
  )
}
