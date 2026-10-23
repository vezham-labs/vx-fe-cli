import { DoubleAltArrowRight as DoubleAltArrowRightIcon } from '@vezham/icons-react'
import { Button, Tooltip } from '@vezham/react-v3'
import { ShortcutTooltipLabel } from '@vezham/react/shortcut-key'

type Props = {
  onPress: () => void
}

export const DrawerToggle = ({ onPress }: Props) => (
  <Tooltip delay={0}>
    <Tooltip.Trigger>
      <Button
        isIconOnly
        aria-label="Toggle drawer"
        variant="ghost"
        onPress={onPress}>
        <DoubleAltArrowRightIcon size={20} aria-hidden="true" />
      </Button>
    </Tooltip.Trigger>
    <Tooltip.Content>
      <ShortcutTooltipLabel label="Toggle Drawer" shortcut="⌘ /" />
    </Tooltip.Content>
  </Tooltip>
)
