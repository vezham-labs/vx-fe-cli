import { type DragEvent, type ReactNode, useId, useState } from 'react'

import {
  AltArrowLeft,
  Minus,
  MusicNote,
  Settings,
  Sun,
  WiFi
} from '@vezham/icons-react'
import { Button, Input, Surface, TextField, Tooltip } from '@vezham/react-v3'

import type { EditorState } from '../../components/panel/footer/control-center/editor'

type GalleryTile = {
  id: string
  label: string
  category: string
  shape: 'small' | 'medium' | 'large' | 'compact' | 'standard' | 'wide' | 'full'
  preview?: ReactNode
}

type Props = {
  title: string
  kind: 'widgets' | 'controls'
  tiles: readonly GalleryTile[]
  editor: EditorState
  onDone: () => void
}

const GalleryTileIcon = ({ category }: Pick<GalleryTile, 'category'>) => {
  const Icon =
    category === 'Appearance' || category === 'Display & Brightness'
      ? Sun
      : category === 'Sound & Media'
        ? MusicNote
        : category === 'Connectivity'
          ? WiFi
          : Settings
  return <Icon aria-hidden="true" size={24} />
}

const useGallery = ({ kind, tiles, editor }: Props) => {
  const dragInstructionsId = useId()
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [draggedHeight, setDraggedHeight] = useState(0)
  const [dropTarget, setDropTarget] = useState<string | null>(null)
  const [announcement, setAnnouncement] = useState('')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [showPreview, setShowPreview] = useState(false)
  const categories = ['All', ...new Set(tiles.map(tile => tile.category))]
  const available = tiles.filter(
    tile =>
      (category === 'All' || tile.category === category) &&
      `${tile.label} ${tile.category}`
        .toLowerCase()
        .includes(query.toLowerCase().trim())
  )
  const visible = editor.items
    .filter(item => item.visible)
    .flatMap(item => tiles.filter(tile => tile.id === item.id))
  const itemFor = (id: string) => editor.items.find(item => item.id === id)
  const finishDrag = () => {
    setDraggedId(null)
    setDropTarget(null)
    setDraggedHeight(0)
  }
  const startDrag = (event: DragEvent, id: string) => {
    event.dataTransfer.setData('application/x-vx-settings-tile', id)
    event.dataTransfer.effectAllowed = 'move'
    const currentTile = event.currentTarget as HTMLElement
    const content = currentTile.hasAttribute('data-preview-tile')
      ? currentTile
      : currentTile.querySelector<HTMLElement>('[inert]')
    setDraggedHeight(content?.getBoundingClientRect().height ?? 64)
    setDraggedId(id)
  }
  const moveTile = (id: string, offset: number) => {
    const index = visible.findIndex(tile => tile.id === id)
    const target = visible[index + offset]
    if (!target) return
    if (editor.onPlace) editor.onPlace(id, target.id)
    else {
      const from = editor.items.findIndex(item => item.id === id)
      const to = editor.items.findIndex(item => item.id === target.id)
      editor.onMove(id, to - from)
    }
    setAnnouncement(
      `${itemFor(id)?.label} moved to position ${index + offset + 1} of ${visible.length}.`
    )
  }
  const dropTile = (event: DragEvent, target?: string) => {
    event.preventDefault()
    event.stopPropagation()
    const id = event.dataTransfer.getData('application/x-vx-settings-tile')
    const item = itemFor(id)
    finishDrag()
    if (!item?.editable) return
    if (editor.onPlace) {
      editor.onPlace(id, target)
      return
    }
    if (!item.visible) editor.onVisibilityChange(id, true)
    if (target || item.visible) {
      const from = editor.items.findIndex(item => item.id === id)
      const to = target
        ? editor.items.findIndex(item => item.id === target)
        : editor.items.length - 1
      editor.onMove(id, to - from)
    }
  }
  const search = (
    <TextField aria-label={`Search ${kind}`} value={query} onChange={setQuery}>
      <Input type="search" placeholder={`Search ${kind}`} variant="secondary" />
    </TextField>
  )
  const categoryButtons = categories.map(value => (
    <Button
      key={value}
      variant="ghost"
      aria-pressed={category === value}
      onPress={() => setCategory(value)}
      className={`shrink-0 rounded-full px-3 text-sm ${category === value ? 'bg-surface-secondary font-semibold' : 'text-muted'}`}>
      <Settings size={16} />
      {value === 'All' ? `All ${kind}` : value}
    </Button>
  ))
  const tileSpan = (tile: GalleryTile) =>
    kind === 'widgets'
      ? tile.shape === 'large'
        ? 'col-span-2 row-span-2'
        : tile.shape === 'medium'
          ? 'col-span-2'
          : ''
      : tile.shape === 'compact'
        ? ''
        : tile.shape === 'standard'
          ? 'col-span-2'
          : tile.shape === 'wide'
            ? 'col-span-3'
            : 'col-span-4'
  const draggedTile = tiles.find(tile => tile.id === draggedId)
  const blankWidget = (tile: GalleryTile) => (
    <Surface
      variant="transparent"
      aria-hidden="true"
      className={`bg-surface-secondary border-border w-full rounded-2xl border ${tile.shape === 'large' ? 'aspect-square' : tile.shape === 'medium' ? 'aspect-[2/1]' : 'aspect-square'}`}>
      {null}
    </Surface>
  )
  return {
    dragInstructionsId,
    draggedId,
    draggedHeight,
    dropTarget,
    announcement,
    query,
    category,
    showPreview,
    available,
    visible,
    itemFor,
    finishDrag,
    startDrag,
    moveTile,
    dropTile,
    search,
    categoryButtons,
    tileSpan,
    draggedTile,
    blankWidget,
    setDropTarget,
    setShowPreview
  }
}

type GalleryContext = ReturnType<typeof useGallery> & Props
const GalleryPreview = ({
  kind,
  editor,
  showPreview,
  visible,
  draggedId,
  draggedHeight,
  dropTarget,
  itemFor,
  startDrag,
  finishDrag,
  moveTile,
  dropTile,
  tileSpan,
  blankWidget,
  dragInstructionsId,
  draggedTile,
  setDropTarget
}: GalleryContext) => (
  <aside
    aria-label={`Current ${kind}`}
    className={`${showPreview ? 'flex' : 'hidden xl:flex'} bg-surface-secondary/40 border-border min-h-0 min-w-0 flex-1 flex-col rounded-3xl border p-5 xl:w-[22rem] xl:flex-none`}
    onDragOver={event => {
      if (!event.dataTransfer.types.includes('application/x-vx-settings-tile'))
        return
      event.preventDefault()
      event.dataTransfer.dropEffect = 'move'
      setDropTarget('empty')
    }}
    onDragLeave={event => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null))
        setDropTarget(null)
    }}
    onDrop={event => dropTile(event)}>
    <div className="mb-5 flex items-start justify-between gap-3">
      <div>
        <h2 className="text-base font-semibold">
          {kind === 'widgets' ? 'Notification Center' : 'Control Center'}
        </h2>
        <p className="text-muted mt-1 text-xs">
          Drag controls to arrange your preview.
        </p>
      </div>
      <span className="bg-surface text-muted rounded-full px-2 py-1 text-xs">
        {visible.length} added
      </span>
    </div>
    <div className="@container mx-auto min-h-0 w-full max-w-[352px] flex-1 overflow-y-auto px-2 py-3">
      {visible.length === 0 && (
        <p className="text-muted py-8 text-center text-sm">
          No {kind} added. Choose a tile from the gallery.
        </p>
      )}
      <div
        className={`grid gap-4 ${kind === 'widgets' ? 'auto-rows-[calc((100cqw-1rem)/2)] grid-cols-2' : 'grid-cols-4 items-start'}`}>
        {visible.map(tile => {
          const editable = itemFor(tile.id)?.editable
          return (
            <div
              key={tile.id}
              data-preview-tile={tile.id}
              draggable={editable}
              role="group"
              aria-label={tile.label}
              onDragStart={event => startDrag(event, tile.id)}
              onDragEnd={finishDrag}
              onDragOver={event => {
                if (
                  !event.dataTransfer.types.includes(
                    'application/x-vx-settings-tile'
                  )
                )
                  return
                event.preventDefault()
                event.stopPropagation()
                event.dataTransfer.dropEffect = 'move'
                setDropTarget(tile.id === draggedId ? null : tile.id)
              }}
              onDragLeave={event => {
                if (
                  !event.currentTarget.contains(
                    event.relatedTarget as Node | null
                  )
                ) {
                  setDropTarget(current =>
                    current === tile.id ? null : current
                  )
                }
              }}
              onDrop={event => dropTile(event, tile.id)}
              data-dragging={draggedId === tile.id || undefined}
              data-drop-target={dropTarget === tile.id || undefined}
              className={`group focus-visible:outline-focus data-[drop-target]:bg-accent-soft data-[drop-target]:outline-accent/40 relative min-w-0 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 data-[dragging]:opacity-40 data-[drop-target]:outline data-[drop-target]:outline-offset-2 ${editable ? 'cursor-grab active:cursor-grabbing' : ''} ${tileSpan(tile)}`}>
              <div
                inert
                className={
                  kind === 'widgets'
                    ? 'pointer-events-none h-full [&>div]:aspect-auto [&>div]:h-full'
                    : 'pointer-events-none [&>button]:w-full'
                }>
                {kind === 'widgets' ? blankWidget(tile) : tile.preview}
              </div>
              {editable && (
                <Button
                  isIconOnly
                  size="sm"
                  variant="ghost"
                  aria-label={`Reorder ${tile.label}`}
                  aria-roledescription="reorderable tile"
                  aria-describedby={dragInstructionsId}
                  className="focus-visible:outline-focus absolute inset-0 h-auto w-auto min-w-0 cursor-grab rounded-[inherit] p-0 focus-visible:outline-2 focus-visible:outline-offset-2 active:cursor-grabbing"
                  onKeyDown={event => {
                    if (
                      [
                        'ArrowUp',
                        'ArrowLeft',
                        'ArrowDown',
                        'ArrowRight'
                      ].includes(event.key)
                    ) {
                      event.preventDefault()
                      moveTile(
                        tile.id,
                        event.key === 'ArrowUp' || event.key === 'ArrowLeft'
                          ? -1
                          : 1
                      )
                    }
                  }}>
                  <span className="sr-only">Reorder {tile.label}</span>
                </Button>
              )}
              {editable && (
                <Tooltip>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="secondary"
                    className="text-muted absolute -top-2 -left-2 z-10 size-6 min-w-0 rounded-full p-0"
                    aria-label={`Remove ${tile.label}`}
                    onPress={() => editor.onVisibilityChange(tile.id, false)}>
                    <Minus aria-hidden="true" className="size-3.5" />
                  </Button>
                  <Tooltip.Content>Remove {tile.label}</Tooltip.Content>
                </Tooltip>
              )}
            </div>
          )
        })}
        {draggedTile && (
          <div
            data-preview-empty-drop
            aria-label={`Drop ${draggedTile.label} here`}
            data-drop-target={dropTarget === 'empty' || undefined}
            className={`border-border text-muted data-[drop-target]:border-accent/40 data-[drop-target]:bg-accent-soft flex items-center justify-center rounded-2xl border border-dashed text-xs ${tileSpan(draggedTile)}`}
            style={kind === 'controls' ? { height: draggedHeight } : undefined}>
            Drop here
          </div>
        )}
      </div>
    </div>
    <Button
      size="sm"
      variant="ghost"
      className="mt-3 self-end"
      onPress={editor.onReset}>
      Reset {kind}
    </Button>
  </aside>
)

const GalleryAvailable = ({
  kind,
  editor,
  showPreview,
  category,
  available,
  itemFor,
  startDrag,
  finishDrag
}: GalleryContext) => (
  <section
    aria-label={`Available ${kind}`}
    className={`${showPreview ? 'hidden xl:flex' : 'flex'} min-h-0 min-w-0 flex-1 flex-col`}>
    <h2 className="mb-1 text-base font-semibold">
      {category === 'All' ? 'Suggestions' : category}
    </h2>
    <p className="text-muted mb-6 text-sm">
      Add or drag a tile into your preview. Changes save automatically.
    </p>
    <div className="min-h-0 flex-1 overflow-y-auto pr-1">
      {available.length === 0 && (
        <p role="status" className="text-muted py-8 text-sm">
          No {kind} found.
        </p>
      )}
      <div className="grid items-start gap-4 sm:grid-cols-2 2xl:grid-cols-3">
        {available.map(tile => {
          const item = itemFor(tile.id)
          return (
            <div
              key={tile.id}
              data-gallery-tile={tile.id}
              draggable={item?.editable}
              onDragStart={event => startDrag(event, tile.id)}
              onDragEnd={finishDrag}
              className="bg-surface-secondary hover:bg-surface-secondary/80 min-w-0 rounded-3xl p-3 transition-colors">
              <div className="flex min-w-0 items-center gap-3">
                <div
                  aria-hidden="true"
                  className="bg-surface text-muted flex size-14 shrink-0 items-center justify-center rounded-2xl shadow-sm">
                  <GalleryTileIcon category={tile.category} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{tile.label}</p>
                  <p className="text-muted mt-0.5 truncate text-xs">
                    {tile.category}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant={item?.visible ? 'ghost' : 'secondary'}
                  isDisabled={item?.visible || !item?.editable}
                  aria-label={
                    item?.visible ? `${tile.label} added` : `Add ${tile.label}`
                  }
                  onPress={() => editor.onVisibilityChange(tile.id, true)}>
                  {item?.visible ? 'Added' : 'Add'}
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  </section>
)

export const TileGallery = (props: Props) => {
  const context = { ...props, ...useGallery(props) }
  const {
    title,
    onDone,
    kind,
    dragInstructionsId,
    announcement,
    showPreview,
    setShowPreview,
    search,
    categoryButtons
  } = context
  return (
    <div className="bg-background flex h-full min-h-0 flex-col">
      <span id={dragInstructionsId} className="sr-only">
        Drag the tile to reorder, or focus it and use the arrow keys.
      </span>
      <span role="status" className="sr-only">
        {announcement}
      </span>
      <header className="border-border flex shrink-0 items-center justify-between gap-3 border-b px-5 py-4 md:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Button
            isIconOnly
            size="sm"
            variant="ghost"
            aria-label="Back to Settings"
            onPress={onDone}>
            <AltArrowLeft size={18} />
          </Button>
          <h1 className="truncate text-xl font-semibold">{title}</h1>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            className="xl:hidden"
            aria-pressed={showPreview}
            onPress={() => setShowPreview(value => !value)}>
            {showPreview ? 'Gallery' : 'Preview'}
          </Button>
          <Button size="sm" onPress={onDone}>
            Done
          </Button>
        </div>
      </header>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="border-border shrink-0 border-b px-5 py-5 md:px-8">
          <div className="mx-auto w-full max-w-6xl space-y-4">
            {search}
            <nav
              aria-label={`${kind} categories`}
              className="flex gap-2 overflow-x-auto pb-1">
              {categoryButtons}
            </nav>
          </div>
        </div>
        <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 gap-6 overflow-hidden p-5 md:p-8">
          <GalleryAvailable {...context} />
          <GalleryPreview {...context} />
        </div>
      </div>
    </div>
  )
}
