import { defineStory } from '@vx/start/story'

import { CalloutPreview } from '@components/callout'

export const story = defineStory({
  Component: CalloutPreview,
  displayName: 'Callout',
  args: [
    {
      variant: 'Default',
      initial: {
        title: 'This is a Callout'
      }
    },
    {
      variant: 'Warning',
      fixed: {
        type: 'warning'
      },
      initial: {
        title: 'This is a Callout'
      }
    }
  ]
})
