import { Outlet } from '@tanstack/react-router'
import { Fragment, ReactNode } from 'react'

import {
  Button,
  Drawer,
  Dropdown,
  InputGroup,
  Label,
  ListBox,
  Separator,
  Surface,
  Tabs,
  TextField,
  Tooltip
} from '@vezham/react-v3'
import { AppIcon } from '@vezham/react/app-icon'
import { ShortcutKey } from '@vezham/react/shortcut-key'

import type { useAcademicLayoutProps } from '@pages/academic/layout/types'

const SectionLayout = ({
  controls
}: {
  controls: ReturnType<typeof useAcademicLayoutProps>
}) => {
  const {
    Component,
    activeTabs,
    isNavigationCollapsed,
    layoutTitle,
    headerProps,
    sidebarProps,
    drawerProps
  } = controls

  const sidebarAccessors = {
    getSidebarProps: controls.getSidebarProps,
    getSidebarListProps: controls.getSidebarListProps,
    getSidebarItemWrapProps: controls.getSidebarItemWrapProps,
    getSidebarChildGroupProps: controls.getSidebarChildGroupProps,
    getSidebarItemProps: controls.getSidebarItemProps,
    getCollapsedSidebarListProps: controls.getCollapsedSidebarListProps,
    getCollapsedSidebarItemProps: controls.getCollapsedSidebarItemProps,
    getSidebarFlyoutProps: controls.getSidebarFlyoutProps,
    getSidebarFlyoutLabelProps: controls.getSidebarFlyoutLabelProps,
    getSidebarFlyoutListProps: controls.getSidebarFlyoutListProps,
    getSidebarFlyoutItemProps: controls.getSidebarFlyoutItemProps,
    getSidebarIconProps: controls.getSidebarIconProps,
    getSidebarLabelProps: controls.getSidebarLabelProps,
    getSidebarDisclosureIconProps: controls.getSidebarDisclosureIconProps
  }

  return (
    <Component {...controls.getBaseProps()}>
      <Surface
        key={isNavigationCollapsed ? 'navigation-collapsed' : 'navigation-open'}
        {...controls.getHeaderProps()}>
        <Surface {...controls.getHeaderInnerProps()}>
          <Surface {...controls.getHeaderLeftProps()}>
            {!isNavigationCollapsed && (
              <>
                <HeaderIconTooltip
                  label={headerProps.sidebarToggle.label}
                  shortcut="⌘ S">
                  <Button
                    {...controls.getIconButtonProps(headerProps.sidebarToggle)}>
                    <AppIcon
                      {...controls.getButtonIconProps(
                        headerProps.sidebarToggle.icon
                      )}
                      size="1em"
                      aria-hidden="true"
                    />
                  </Button>
                </HeaderIconTooltip>

                {headerProps.leftActions.map(action => (
                  <HeaderIconTooltip
                    key={action.key}
                    label={action.label}
                    shortcut={getActionShortcut(action.key)}>
                    <Button {...controls.getIconButtonProps(action)}>
                      <AppIcon
                        {...controls.getButtonIconProps(action.icon)}
                        size="1em"
                        aria-hidden="true"
                      />
                    </Button>
                  </HeaderIconTooltip>
                ))}
              </>
            )}

            {activeTabs.length ? (
              <Surface {...controls.getHeaderTabsDesktopProps()}>
                <HeaderTabs
                  tabs={activeTabs}
                  selectedKey={headerProps.selectedTabKey}
                  onSelectionChange={headerProps.onTabSelectionChange}
                  getTabsScrollerProps={controls.getTabsScrollerProps}
                  getTabsListProps={controls.getTabsListProps}
                  getTabsTabProps={controls.getTabsTabProps}
                />
              </Surface>
            ) : null}
          </Surface>

          <Surface {...controls.getHeaderRightProps()}>
            {headerProps.searchAction ? (
              <>
                <TextField
                  {...controls.getSearchFieldProps(headerProps.searchAction)}>
                  <InputGroup>
                    <InputGroup.Prefix>
                      <AppIcon
                        {...controls.getSearchIconProps(
                          headerProps.searchAction.icon
                        )}
                        size="1em"
                        aria-hidden="true"
                      />
                    </InputGroup.Prefix>
                    <InputGroup.Input
                      placeholder={
                        headerProps.searchAction.placeholder ??
                        headerProps.searchAction.label
                      }
                    />
                  </InputGroup>
                </TextField>
                <HeaderIconTooltip
                  label={headerProps.searchAction.label}
                  shortcut="⌘ K">
                  <Button
                    {...controls.getIconButtonProps(headerProps.searchAction)}>
                    <AppIcon
                      {...controls.getButtonIconProps(
                        headerProps.searchAction.icon
                      )}
                      size="1em"
                      aria-hidden="true"
                    />
                  </Button>
                </HeaderIconTooltip>
              </>
            ) : null}

            {headerProps.syncAction ? (
              <HeaderIconTooltip
                label={headerProps.syncAction.label}
                shortcut={getActionShortcut(headerProps.syncAction.key)}>
                <Button
                  {...controls.getIconButtonProps(headerProps.syncAction)}>
                  <AppIcon
                    {...controls.getButtonIconProps(
                      headerProps.syncAction.icon
                    )}
                    size="1em"
                    aria-hidden="true"
                  />
                </Button>
              </HeaderIconTooltip>
            ) : null}

            {headerProps.menuActions.length ? (
              <MoreActions
                actions={headerProps.menuActions}
                getIconButtonProps={controls.getIconButtonProps}
                getButtonIconProps={controls.getButtonIconProps}
                getDropdownLabelProps={controls.getDropdownLabelProps}
              />
            ) : null}

            {headerProps.primaryAction ? (
              <Button
                {...controls.getIconButtonProps(
                  headerProps.primaryAction,
                  true
                )}>
                <AppIcon
                  {...controls.getButtonIconProps(
                    headerProps.primaryAction.icon
                  )}
                  size="1em"
                  aria-hidden="true"
                />
                <Label {...controls.getPrimaryLabelProps()}>
                  {headerProps.primaryAction.label}
                </Label>
              </Button>
            ) : null}
          </Surface>
        </Surface>
      </Surface>

      <Surface {...controls.getShellProps()}>
        <Surface {...controls.getSidebarRailProps()}>
          <SectionSidebar sidebarProps={sidebarProps} {...sidebarAccessors} />
        </Surface>

        <Surface {...controls.getContentProps()}>
          <Surface {...controls.getContentSurfaceProps()}>
            <Outlet />
          </Surface>
        </Surface>
      </Surface>

      {activeTabs.length ? (
        <Surface {...controls.getHeaderTabsMobileProps()}>
          <HeaderTabs
            tabs={activeTabs}
            selectedKey={headerProps.selectedTabKey}
            onSelectionChange={headerProps.onTabSelectionChange}
            getTabsScrollerProps={controls.getTabsScrollerProps}
            getTabsListProps={controls.getTabsListProps}
            getTabsTabProps={controls.getTabsTabProps}
          />
        </Surface>
      ) : null}

      <Drawer {...drawerProps.root}>
        <Drawer.Content placement="left">
          <Drawer.Dialog {...drawerProps.dialog}>
            <Surface {...controls.getDrawerHeaderProps()}>
              <Drawer.Header {...controls.getDrawerTitleProps()}>
                {layoutTitle}
              </Drawer.Header>

              <Button {...controls.getIconButtonProps(drawerProps.closeAction)}>
                <AppIcon
                  {...controls.getButtonIconProps(drawerProps.closeAction.icon)}
                  size="1em"
                  aria-hidden="true"
                />
              </Button>
            </Surface>
            <Separator {...controls.getSeparatorProps()} />
            <Drawer.Body {...controls.getDrawerBodyProps()}>
              <SectionSidebar
                sidebarProps={drawerProps.sidebar}
                {...sidebarAccessors}
              />
            </Drawer.Body>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer>
    </Component>
  )
}

function MoreActions({
  actions,
  getIconButtonProps,
  getButtonIconProps,
  getDropdownLabelProps
}: Pick<
  ReturnType<typeof useAcademicLayoutProps>,
  'getIconButtonProps' | 'getButtonIconProps' | 'getDropdownLabelProps'
> & {
  actions: ReturnType<
    typeof useAcademicLayoutProps
  >['headerProps']['menuActions']
}) {
  const renderItems = (items: typeof actions): ReactNode =>
    items.map(action =>
      action.children?.length ? (
        <Dropdown.SubmenuTrigger key={action.key}>
          <Dropdown.Item id={action.key} textValue={action.label}>
            <Label {...getDropdownLabelProps()}>
              <AppIcon
                {...getButtonIconProps(action.icon, true)}
                size="1em"
                aria-hidden="true"
              />
              {action.label}
            </Label>
            <Dropdown.SubmenuIndicator />
          </Dropdown.Item>
          <Dropdown.Popover>
            <Dropdown.Menu>{renderItems(action.children)}</Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown.SubmenuTrigger>
      ) : (
        <Dropdown.Item
          key={action.key}
          id={action.key}
          textValue={action.label}
          onPress={action.onAction}>
          <Label {...getDropdownLabelProps()}>
            <AppIcon
              {...getButtonIconProps(action.icon, true)}
              size="1em"
              aria-hidden="true"
            />
            {action.label}
          </Label>
        </Dropdown.Item>
      )
    )
  return (
    <Dropdown>
      <HeaderIconTooltip label="More">
        <Button
          {...getIconButtonProps({
            key: 'more',
            label: 'More',
            icon: 'vx:menu-vertical'
          })}>
          <AppIcon
            {...getButtonIconProps('vx:menu-vertical')}
            size="1em"
            aria-hidden="true"
          />
        </Button>
      </HeaderIconTooltip>

      <Dropdown.Popover>
        <Dropdown.Menu>{renderItems(actions)}</Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  )
}

function HeaderIconTooltip({
  children,
  label,
  shortcut
}: {
  children: ReactNode
  label: string
  shortcut?: string
}) {
  return (
    <Tooltip delay={0}>
      <Tooltip.Trigger>{children}</Tooltip.Trigger>
      <Tooltip.Content>
        <span className="flex items-center gap-2 whitespace-nowrap">
          <span>{label}</span>
          {shortcut ? <ShortcutKey shortcut={shortcut} /> : null}
        </span>
      </Tooltip.Content>
    </Tooltip>
  )
}

function getActionShortcut(key: string) {
  if (key === 'back') return '⌘ ←'
  if (key === 'forward') return '⌘ →'
  if (key === 'sync') return '⌘ R'

  return undefined
}

function SectionSidebar({
  sidebarProps,
  getSidebarProps,
  getSidebarListProps,
  getSidebarItemWrapProps,
  getSidebarChildGroupProps,
  getSidebarItemProps,
  getCollapsedSidebarListProps,
  getCollapsedSidebarItemProps,
  getSidebarFlyoutProps,
  getSidebarFlyoutLabelProps,
  getSidebarFlyoutListProps,
  getSidebarFlyoutItemProps,
  getSidebarIconProps,
  getSidebarLabelProps,
  getSidebarDisclosureIconProps
}: Pick<
  ReturnType<typeof useAcademicLayoutProps>,
  | 'sidebarProps'
  | 'getSidebarProps'
  | 'getSidebarListProps'
  | 'getSidebarItemWrapProps'
  | 'getSidebarChildGroupProps'
  | 'getSidebarItemProps'
  | 'getCollapsedSidebarListProps'
  | 'getCollapsedSidebarItemProps'
  | 'getSidebarFlyoutProps'
  | 'getSidebarFlyoutLabelProps'
  | 'getSidebarFlyoutListProps'
  | 'getSidebarFlyoutItemProps'
  | 'getSidebarIconProps'
  | 'getSidebarLabelProps'
  | 'getSidebarDisclosureIconProps'
>) {
  return (
    <Surface {...getSidebarProps(sidebarProps)}>
      {!sidebarProps.hideToggle ? (
        <Button {...sidebarProps.toggleButtonProps}>
          <AppIcon
            {...getSidebarIconProps(sidebarProps.toggleIcon, false)}
            size="1em"
            aria-hidden="true"
          />
        </Button>
      ) : null}

      {sidebarProps.collapsed && sidebarProps.collapsedMode === 'icons' ? (
        <Surface {...getCollapsedSidebarListProps()}>
          {sidebarProps.items.map(item => (
            <Surface key={item.key} {...getSidebarItemWrapProps()}>
              <Button {...getCollapsedSidebarItemProps(item)}>
                <AppIcon
                  {...getSidebarIconProps(item.icon, item.isActive)}
                  size="1em"
                  aria-hidden="true"
                />
              </Button>

              <Surface {...getSidebarFlyoutProps()}>
                <Label {...getSidebarFlyoutLabelProps()}>
                  <AppIcon
                    {...getSidebarIconProps(item.icon, item.isActive)}
                    size="1em"
                    aria-hidden="true"
                  />
                  {item.title}
                </Label>

                {item.children?.length ? (
                  <Surface {...getSidebarFlyoutListProps()}>
                    {item.children.map(child => (
                      <Button
                        key={child.key}
                        {...getSidebarFlyoutItemProps(child)}>
                        <AppIcon
                          {...getSidebarIconProps(child.icon, child.isActive)}
                          size="1em"
                          aria-hidden="true"
                        />
                        <Label {...getSidebarLabelProps(child.isActive)}>
                          {child.title}
                        </Label>
                      </Button>
                    ))}
                  </Surface>
                ) : null}
              </Surface>
            </Surface>
          ))}
        </Surface>
      ) : null}

      {sidebarProps.collapsed ? null : (
        <ListBox {...getSidebarListProps(sidebarProps)}>
          {sidebarProps.items.map(item => (
            <Fragment key={item.key}>
              <ListBox.Item {...getSidebarItemProps(item, sidebarProps)}>
                <AppIcon
                  {...getSidebarIconProps(item.icon, item.isActive)}
                  size="1em"
                  aria-hidden="true"
                />
                <Label {...getSidebarLabelProps(item.isActive)}>
                  {item.title}
                </Label>
                {sidebarProps.renderChildrenInSidebar &&
                item.children?.length ? (
                  <AppIcon
                    {...getSidebarDisclosureIconProps(item.isExpanded)}
                    size="1em"
                    aria-hidden="true"
                  />
                ) : null}
              </ListBox.Item>

              {sidebarProps.renderChildrenInSidebar &&
              item.isExpanded &&
              item.children?.length ? (
                <ListBox.Section
                  {...getSidebarChildGroupProps()}
                  aria-label={item.title}>
                  {item.children.map(child => (
                    <ListBox.Item
                      key={child.key}
                      {...getSidebarItemProps(child, sidebarProps, true)}>
                      <AppIcon
                        {...getSidebarIconProps(child.icon, child.isActive)}
                        size="1em"
                        aria-hidden="true"
                      />
                      <Label {...getSidebarLabelProps(child.isActive)}>
                        {child.title}
                      </Label>
                    </ListBox.Item>
                  ))}
                </ListBox.Section>
              ) : null}
            </Fragment>
          ))}
        </ListBox>
      )}
    </Surface>
  )
}

function HeaderTabs({
  tabs,
  selectedKey,
  onSelectionChange,
  getTabsScrollerProps,
  getTabsListProps,
  getTabsTabProps
}: Pick<
  ReturnType<typeof useAcademicLayoutProps>,
  'getTabsScrollerProps' | 'getTabsListProps' | 'getTabsTabProps'
> & {
  tabs: ReturnType<typeof useAcademicLayoutProps>['activeTabs']
  selectedKey?: string
  onSelectionChange: ReturnType<
    typeof useAcademicLayoutProps
  >['headerProps']['onTabSelectionChange']
}) {
  return (
    <Surface {...getTabsScrollerProps()}>
      <Tabs selectedKey={selectedKey} onSelectionChange={onSelectionChange}>
        <Tabs.ListContainer>
          <Tabs.List {...getTabsListProps()}>
            {tabs.map((tab, index) => (
              <Tabs.Tab key={tab.key} {...getTabsTabProps(tab)}>
                {index > 0 ? <Tabs.Separator /> : null}
                {tab.title}
                <Tabs.Indicator />
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs.ListContainer>
      </Tabs>
    </Surface>
  )
}

export { SectionLayout }
