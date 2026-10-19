import {
  CalendarDate,
  ClipboardList,
  ClockCircle,
  Moon,
  NotebookBookmark,
  Sun
} from '@vezham/icons-react'
import { Surface } from '@vezham/react-v3'

import { useTileEditor } from '../control-center/editor'

type WidgetSize = 'small' | 'medium' | 'large'

export type WidgetTileDefinition = {
  id: string
  label: string
  category: string
  size: WidgetSize
}

const widgetDefinitions = [
  {
    id: 'calendar-month',
    label: 'Calendar',
    category: 'Calendar',
    size: 'small'
  },
  {
    id: 'world-clock',
    label: 'World Clock',
    category: 'Clock',
    size: 'small'
  },
  {
    id: 'weather-forecast',
    label: 'Weather',
    category: 'Weather',
    size: 'medium'
  },
  {
    id: 'reminders-list',
    label: 'Reminders',
    category: 'Reminders',
    size: 'medium'
  },
  {
    id: 'notes-summary',
    label: 'Notes',
    category: 'Notes',
    size: 'medium'
  },
  {
    id: 'focus-status',
    label: 'Focus',
    category: 'Focus',
    size: 'small'
  },
  {
    id: 'daily-summary',
    label: 'Daily Summary',
    category: 'Calendar',
    size: 'large'
  }
] satisfies readonly WidgetTileDefinition[]

const widgetSizeClasses: Record<WidgetSize, string> = {
  small: 'aspect-square',
  medium: 'aspect-[2/1]',
  large: 'aspect-square'
}

const WidgetPreviewContent = ({ id }: Pick<WidgetTileDefinition, 'id'>) => {
  switch (id) {
    case 'calendar-month':
      return (
        <>
          <CalendarDate aria-hidden="true" className="text-accent size-5" />
          <span className="mt-2 text-xs font-semibold">October</span>
          <span className="text-muted text-xl font-semibold tabular-nums">
            18
          </span>
        </>
      )
    case 'world-clock':
      return (
        <>
          <ClockCircle aria-hidden="true" className="text-accent size-5" />
          <span className="mt-auto text-xl font-semibold tabular-nums">
            10:09
          </span>
          <span className="text-muted text-xs">New Delhi</span>
        </>
      )
    case 'weather-forecast':
      return (
        <>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">New Delhi</span>
            <Sun aria-hidden="true" className="text-warning size-5" />
          </div>
          <div className="mt-auto flex items-end justify-between">
            <span className="text-3xl font-semibold tabular-nums">25°</span>
            <span className="text-muted text-xs">Clear</span>
          </div>
        </>
      )
    case 'reminders-list':
      return (
        <>
          <div className="flex items-center gap-2">
            <ClipboardList aria-hidden="true" className="text-accent size-5" />
            <span className="text-sm font-semibold">Reminders</span>
          </div>
          <span className="text-muted mt-auto text-xs">No reminders today</span>
        </>
      )
    case 'notes-summary':
      return (
        <>
          <div className="flex items-center gap-2">
            <NotebookBookmark
              aria-hidden="true"
              className="text-warning size-5"
            />
            <span className="text-sm font-semibold">Notes</span>
          </div>
          <span className="text-muted mt-auto text-xs">No recent notes</span>
        </>
      )
    case 'focus-status':
      return (
        <>
          <Moon aria-hidden="true" className="text-accent size-5" />
          <span className="mt-auto text-sm font-semibold">Focus</span>
          <span className="text-muted text-xs">Off</span>
        </>
      )
    default:
      return (
        <>
          <CalendarDate aria-hidden="true" className="text-accent size-5" />
          <span className="mt-auto text-sm font-semibold">Today</span>
          <span className="text-muted text-xs">No events scheduled</span>
        </>
      )
  }
}

export const WidgetPreview = ({
  tile,
  className = ''
}: {
  tile: WidgetTileDefinition
  className?: string
}) => (
  <Surface
    variant="transparent"
    data-widget-size={tile.size}
    aria-label={tile.label}
    className={`bg-surface-secondary flex min-w-0 flex-col rounded-2xl p-3 shadow-sm ${widgetSizeClasses[tile.size]} ${tile.size === 'large' ? 'col-span-2 row-span-2' : tile.size === 'medium' ? 'col-span-2' : ''} ${className}`}>
    <WidgetPreviewContent id={tile.id} />
  </Surface>
)

export const useWidgetTiles = () =>
  useTileEditor(widgetDefinitions, 'vx:widgets')

export const WidgetTiles = () => {
  const { visibleTiles } = useWidgetTiles()
  return (
    <div className="@container mx-auto w-full max-w-[352px]">
      <div className="grid auto-rows-[calc((100cqw-1rem)/2)] grid-cols-2 gap-4 pb-4">
        {visibleTiles.map(tile => (
          <WidgetPreview key={tile.id} tile={tile} className="h-full" />
        ))}
      </div>
    </div>
  )
}
