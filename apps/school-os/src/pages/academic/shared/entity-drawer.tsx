import type { ComponentProps, ReactNode } from 'react'

import {
  AltArrowDown as AltArrowDownIcon,
  AltArrowUp as AltArrowUpIcon,
  ArrowRightUp as ArrowRightUpIcon,
  Copy as CopyIcon,
  Link as LinkIcon,
  Pen as PenIcon
} from '@vezham/icons-react'
import { Button, Drawer, Tooltip } from '@vezham/react-v3'
import { ShortcutTooltipLabel } from '@vezham/react/shortcut-key'

import { DrawerEditAction } from '@pages/_shared/drawer-edit-action'
import { DrawerToggle } from '@pages/_shared/drawer-toggle'

type DrawerClasses = {
  drawerDialog: string
  drawerHeader: string
  drawerHeaderRow: string
  drawerTitleGroup: string
  drawerTitle: string
  drawerActions: string
  drawerBody: string
  drawerFooter: string
  drawerFormFooterActions: string
  drawerViewFooterActions: string
  flexOne: string
}

type Props = {
  canGoNext: boolean
  canGoPrevious: boolean
  classes: DrawerClasses
  createLabel: string
  detailsContent: ReactNode
  drawerState: ComponentProps<typeof Drawer>['state']
  formContent: ReactNode
  mode: 'view' | 'edit' | 'create'
  rowId?: string
  title: string
  onCancel: () => void
  onClose: () => void
  onCopyId: () => void
  onCopyLink: () => void
  onEdit: () => void
  onGoNext: () => void
  onGoPrevious: () => void
  onOpenPage: () => void
  onSave: () => void
}

export const EntityDrawer = ({
  canGoNext,
  canGoPrevious,
  classes,
  createLabel,
  detailsContent,
  drawerState,
  formContent,
  mode,
  rowId,
  title,
  onCancel,
  onClose,
  onCopyId,
  onCopyLink,
  onEdit,
  onGoNext,
  onGoPrevious,
  onOpenPage,
  onSave
}: Props) => {
  const isFormMode = mode === 'create' || mode === 'edit'
  const showNavigation = mode !== 'create'

  return (
    <Drawer state={drawerState}>
      <Drawer.Backdrop variant="transparent">
        <Drawer.Content placement="right">
          <Drawer.Dialog className={classes.drawerDialog}>
            <Drawer.Header className={classes.drawerHeader}>
              <div className={classes.drawerHeaderRow}>
                <div className={classes.drawerTitleGroup}>
                  <DrawerToggle onPress={onClose} />
                  <span className={classes.drawerTitle}>{title}</span>
                  {rowId && (
                    <Tooltip delay={0}>
                      <Tooltip.Trigger>
                        <Button
                          isIconOnly
                          aria-label={`Copy ID ${rowId}`}
                          variant="ghost"
                          onPress={onCopyId}>
                          <CopyIcon size={16} aria-hidden="true" />
                        </Button>
                      </Tooltip.Trigger>
                      <Tooltip.Content>
                        <ShortcutTooltipLabel label="Copy" shortcut="⌘ C" />
                      </Tooltip.Content>
                    </Tooltip>
                  )}
                </div>

                <div className={classes.drawerActions}>
                  {rowId && (
                    <>
                      <Tooltip delay={0}>
                        <Tooltip.Trigger>
                          <Button
                            isIconOnly
                            aria-label={`Copy URL for ${rowId}`}
                            variant="secondary"
                            onPress={onCopyLink}>
                            <LinkIcon size={16} aria-hidden="true" />
                          </Button>
                        </Tooltip.Trigger>
                        <Tooltip.Content>
                          <ShortcutTooltipLabel label="Copy" shortcut="⌘ C" />
                        </Tooltip.Content>
                      </Tooltip>
                      <DrawerEditAction
                        ariaLabel={`Edit ${rowId}`}
                        onPress={onEdit}
                      />
                      <Tooltip delay={0}>
                        <Tooltip.Trigger>
                          <Button
                            isIconOnly
                            aria-label={`Open ${rowId}`}
                            variant="secondary"
                            onPress={onOpenPage}>
                            <ArrowRightUpIcon size={16} aria-hidden="true" />
                          </Button>
                        </Tooltip.Trigger>
                        <Tooltip.Content>Open ↗</Tooltip.Content>
                      </Tooltip>
                    </>
                  )}

                  {showNavigation && (
                    <>
                      <Button
                        isIconOnly
                        aria-label="Next schedule"
                        isDisabled={!canGoNext}
                        variant="secondary"
                        onPress={onGoNext}>
                        <AltArrowUpIcon size={18} aria-hidden="true" />
                      </Button>
                      <Button
                        isIconOnly
                        aria-label="Previous schedule"
                        isDisabled={!canGoPrevious}
                        variant="secondary"
                        onPress={onGoPrevious}>
                        <AltArrowDownIcon size={18} aria-hidden="true" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Drawer.Header>

            <Drawer.Body className={classes.drawerBody}>
              {isFormMode ? formContent : detailsContent}
            </Drawer.Body>

            <Drawer.Footer className={classes.drawerFooter}>
              {isFormMode ? (
                <div className={classes.drawerFormFooterActions}>
                  <Button variant="secondary" onPress={onCancel}>
                    Cancel
                  </Button>
                  <Button onPress={onSave}>
                    {mode === 'create' ? createLabel : 'Save'}
                  </Button>
                </div>
              ) : (
                <div className={classes.drawerViewFooterActions}>
                  <Button
                    className={classes.flexOne}
                    variant="secondary"
                    onPress={onEdit}>
                    <PenIcon size={16} aria-hidden="true" />
                    Edit
                  </Button>
                  <Button className={classes.flexOne} onPress={onClose}>
                    Close
                  </Button>
                </div>
              )}
            </Drawer.Footer>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  )
}
