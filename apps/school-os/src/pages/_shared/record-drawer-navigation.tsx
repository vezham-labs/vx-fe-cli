import {
  AltArrowDown as AltArrowDownIcon,
  AltArrowUp as AltArrowUpIcon
} from '@vezham/icons-react'
import { Button, Tooltip } from '@vezham/react-v3'
import { ShortcutTooltipLabel } from '@vezham/react/shortcut-key'

export const RecordDrawerNavigation = ({
  canGoNext,
  canGoPrevious,
  variant,
  onGoNext,
  onGoPrevious
}: {
  canGoNext: boolean
  canGoPrevious: boolean
  variant: 'secondary' | 'ghost'
  onGoNext: () => void
  onGoPrevious: () => void
}) => (
  <>
    <Tooltip delay={0}>
      <Tooltip.Trigger>
        <Button
          isIconOnly
          aria-label="Previous row"
          isDisabled={!canGoPrevious}
          variant={variant}
          onPress={onGoPrevious}>
          <AltArrowUpIcon size={18} aria-hidden="true" />
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content>
        <ShortcutTooltipLabel label="Previous" shortcut="⌘ ↑" />
      </Tooltip.Content>
    </Tooltip>
    <Tooltip delay={0}>
      <Tooltip.Trigger>
        <Button
          isIconOnly
          aria-label="Next row"
          isDisabled={!canGoNext}
          variant={variant}
          onPress={onGoNext}>
          <AltArrowDownIcon size={18} aria-hidden="true" />
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content>
        <ShortcutTooltipLabel label="Next" shortcut="⌘ ↓" />
      </Tooltip.Content>
    </Tooltip>
  </>
)
