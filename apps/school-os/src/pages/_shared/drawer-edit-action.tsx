import { Pen as PenIcon } from '@vezham/icons-react'
import { Button, Tooltip } from '@vezham/react-v3'
import { ShortcutTooltipLabel } from '@vezham/react/shortcut-key'

type Props = {
  ariaLabel: string
  onPress: () => void
}

export const DrawerEditAction = ({ ariaLabel, onPress }: Props) => (
  <Tooltip delay={0}>
    <Tooltip.Trigger>
      <Button
        isIconOnly
        aria-label={ariaLabel}
        variant="secondary"
        onPress={onPress}>
        <PenIcon size={16} aria-hidden="true" />
      </Button>
    </Tooltip.Trigger>
    <Tooltip.Content>
      <ShortcutTooltipLabel label="Edit" shortcut="⌘ E" />
    </Tooltip.Content>
  </Tooltip>
)
