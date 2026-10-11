import { tv } from '@vezham/react-v3'

export const sectionTabVariants = tv({
  base: 'inline-flex h-full items-center border-b-2 text-sm font-medium transition-colors',
  variants: {
    selected: {
      true: 'border-primary text-primary',
      false: 'text-muted hover:text-foreground border-transparent'
    }
  },
  defaultVariants: { selected: false }
})

export const platformIconVariants = tv({
  base: 'me-1 shrink-0',
  variants: {
    platform: { web: '', native: '' },
    selected: { true: '', false: '' }
  },
  compoundVariants: [
    { platform: 'web', selected: true, class: 'text-sky-400' },
    { platform: 'native', selected: true, class: 'text-indigo-500' }
  ]
})

export const versionSelectorVariants = tv({
  slots: {
    trigger:
      'text-muted flex items-center gap-1.5 py-1 text-start text-xs font-medium transition-opacity hover:opacity-80 sm:text-sm',
    label: 'max-w-25 overflow-hidden text-ellipsis whitespace-nowrap',
    chevron: 'transition-transform',
    popover: 'min-w-[180px] p-0',
    content: 'px-1 py-1',
    list: 'flex flex-col gap-0',
    item: 'flex items-center justify-between rounded-3xl px-3 py-2 text-sm',
    version: 'ms-2 text-xs font-semibold',
    separator: 'my-0.5 px-2'
  },
  variants: {
    open: { true: { chevron: 'rotate-180' } },
    selected: {
      true: {
        item: 'bg-primary/10 text-primary hover:bg-primary/20 font-medium',
        version: 'text-muted'
      },
      false: { item: 'text-muted hover:bg-default-hover hover:text-foreground' }
    }
  },
  defaultVariants: { open: false, selected: false }
})
