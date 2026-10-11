import { useState } from 'react'

import { AltArrowDown } from '@vezham/icons-react'
import { Popover, Separator } from '@vezham/react-v3'

import { versionSelectorVariants } from '@components/docs/navigation.variants'
import { vxCore } from '@generated/vx'

const styles = versionSelectorVariants()

export const VersionSelector = ({
  platform
}: {
  platform: 'web' | 'native'
}) => {
  const [open, setOpen] = useState(false)
  const [majorVersion] = vxCore.version.split('.')

  if (platform === 'native') return null

  return (
    <Popover isOpen={open} onOpenChange={setOpen}>
      <Popover.Trigger className={styles.trigger()}>
        <span className={styles.label()}>v{vxCore.version}</span>
        <AltArrowDown size={12} className={styles.chevron({ open })} />
      </Popover.Trigger>
      <Popover.Content className={styles.popover()} placement="bottom start">
        <Popover.Dialog className={styles.content()}>
          <div className={styles.list()}>
            <div className={styles.item({ selected: true })}>
              <span>v{majorVersion}</span>
              <span className={styles.version({ selected: true })}>
                {vxCore.version}
              </span>
            </div>
            <div className={styles.separator()}>
              <Separator />
            </div>
            <a
              className={styles.item()}
              href="https://vezham.com?utm_source=vezham.app"
              rel="noopener noreferrer"
              target="_blank">
              <span>v2</span>
              <span className={styles.version()}>2.8.x</span>
            </a>
          </div>
        </Popover.Dialog>
      </Popover.Content>
    </Popover>
  )
}
