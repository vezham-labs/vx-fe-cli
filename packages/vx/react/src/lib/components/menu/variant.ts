import { cn } from '@vezham/react-v3'

export const getNavbarContainerClasses = ({
  bgColorClass = '',
  isDarkMode = false
}: {
  bgColorClass?: string
  isDarkMode?: boolean
}): string => {
  return (
    cn(
      'pointer-events-none fixed bottom-0 z-75 flex w-full md:hidden',
      'pt-4 pr-20 pb-[max(0.75rem,env(safe-area-inset-bottom))] pl-3',
      bgColorClass,
      isDarkMode ? 'dark' : ''
    ) ?? ''
  )
}

export const getNavbarMenuContainerClasses = ({
  isDarkMode = false
}: {
  isDarkMode?: boolean
}): string => {
  return (
    cn(
      'pointer-events-auto flex inline-flex items-center gap-4 rounded-full p-2 px-4 shadow-xl',
      'bg-surface backdrop-blur-md',
      isDarkMode ? 'dark' : ''
    ) ?? ''
  )
}

export const getNavbarButtonClasses = ({
  isSelected = false,
  textColorClass = 'text-muted',
  isDarkMode = false
}: {
  isSelected?: boolean
  textColorClass?: string
  isDarkMode?: boolean
}): string => {
  return (
    cn(
      'flex flex-col items-center gap-2 text-xs font-medium transition-colors duration-200 focus:outline-none',
      isSelected ? 'text-foreground font-medium' : textColorClass,
      'hover:text-foreground',
      isDarkMode ? 'dark' : ''
    ) ?? ''
  )
}

export const getNavbarIconClasses = ({
  isSelected = false,
  isDarkMode = false
}: {
  isSelected?: boolean
  isDarkMode?: boolean
}): string => {
  return (
    cn(
      isSelected ? 'text-foreground' : 'text-muted',
      'group-hover:text-foreground',
      isDarkMode ? 'dark' : ''
    ) ?? ''
  )
}

export const getSearchButtonClasses = ({
  isDarkMode = false,
  hasPrimaryAction = false
}: {
  isDarkMode?: boolean
  hasPrimaryAction?: boolean
}): string => {
  return (
    cn(
      'pointer-events-auto fixed right-3 flex h-11 w-11 items-center justify-center rounded-full shadow-xl',
      hasPrimaryAction
        ? 'bottom-[calc(max(0.75rem,env(safe-area-inset-bottom))+4.25rem)]'
        : 'bottom-[calc(max(0.75rem,env(safe-area-inset-bottom))+0.5rem)]',
      'bg-surface text-muted hover:bg-surface-secondary backdrop-blur-md',
      isDarkMode ? 'dark' : ''
    ) ?? ''
  )
}

export const getDrawerButtonClasses = ({
  isSelected = false,
  isDarkMode = false
}: {
  isSelected?: boolean
  isDarkMode?: boolean
}): string => {
  return (
    cn(
      'h-auto min-h-11 w-full min-w-0 justify-start rounded-lg px-3 py-3 text-start text-sm transition-none',
      isSelected ? 'bg-accent/10 text-accent font-semibold' : 'text-muted',
      isDarkMode ? 'dark' : ''
    ) ?? ''
  )
}

export const getDrawerListClasses = (): string => {
  return cn('flex min-w-0 flex-col gap-1') ?? ''
}

export const getDrawerItemInnerClasses = (buttonTextColor: string): string => {
  return cn('flex w-full min-w-0 items-center gap-3', buttonTextColor) ?? ''
}
