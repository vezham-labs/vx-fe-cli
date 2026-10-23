import { useHotkey } from '@tanstack/react-hotkeys'
import type { Dispatch, SetStateAction } from 'react'

import type { Selection } from '@vezham/react-v3'
import { useToolbarAction } from '@vezham/react/toolbar-actions'

import type {
  DrawerMode,
  DrawerState,
  OpenDrawerOptions,
  ToastState
} from '@pages/academic/shared/entity-types'
import { useActiveRowVisibility } from '@pages/academic/shared/use-active-row-visibility'
import { useEntityDrawerUrlSync } from '@pages/academic/shared/use-entity-drawer-url-sync'
import { useToastTimeout } from '@pages/academic/shared/use-toast-timeout'

type EntityRow = { id: string }

type Options<Row extends EntityRow, Form, Errors extends object> = {
  activeRowId: string | null
  pageKey: string
  currentPage: number
  data: Row[]
  drawer: DrawerState
  emptyForm: Form
  getRowIdFromPath: (pathname: string) => string | null
  goToNextRow: () => void
  goToPreviousRow: () => void
  mode: DrawerMode
  openDrawer: (
    mode: DrawerMode,
    row: Row | null,
    options?: OpenDrawerOptions
  ) => void
  pageSize: number
  routeId: string | undefined
  rowToForm: (row: Row) => Form
  setActiveRowId: Dispatch<SetStateAction<string | null>>
  setForm: Dispatch<SetStateAction<Form>>
  setFormErrors: Dispatch<SetStateAction<Errors>>
  setMode: Dispatch<SetStateAction<DrawerMode>>
  setPage: Dispatch<SetStateAction<number>>
  setSelectedRowKeys: Dispatch<SetStateAction<Selection>>
  setToast: Dispatch<SetStateAction<ToastState | null>>
  sortedRows: Row[]
  syncSelectionFromUrl: boolean
  toast: ToastState | null
  toggleDrawer: () => void
}

export const useEntityPageLifecycle = <
  Row extends EntityRow,
  Form,
  Errors extends object
>({
  activeRowId,
  pageKey,
  currentPage,
  data,
  drawer,
  emptyForm,
  getRowIdFromPath,
  goToNextRow,
  goToPreviousRow,
  mode,
  openDrawer,
  pageSize,
  routeId,
  rowToForm,
  setActiveRowId,
  setForm,
  setFormErrors,
  setMode,
  setPage,
  setSelectedRowKeys,
  setToast,
  sortedRows,
  syncSelectionFromUrl,
  toast,
  toggleDrawer
}: Options<Row, Form, Errors>) => {
  useToolbarAction('create', () => openDrawer('create', null), { pageKey })

  useToastTimeout(toast, setToast)

  useEntityDrawerUrlSync({
    data,
    drawer,
    emptyErrors: {} as Errors,
    emptyForm,
    getRowIdFromPath,
    routeId,
    rowToForm,
    setActiveRowId,
    setForm,
    setFormErrors,
    setMode,
    setSelectedRowKeys: syncSelectionFromUrl ? setSelectedRowKeys : undefined
  })

  useActiveRowVisibility({
    activeRowId,
    currentPage,
    pageSize,
    rows: sortedRows,
    setPage
  })

  useHotkey('Meta+/', () => toggleDrawer())
  useHotkey('Meta+ArrowUp', () => goToNextRow(), {
    enabled: drawer.isOpen && mode !== 'create'
  })
  useHotkey('Meta+ArrowDown', () => goToPreviousRow(), {
    enabled: drawer.isOpen && mode !== 'create'
  })
}
