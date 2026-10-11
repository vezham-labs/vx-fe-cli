'use client'

import { APP_NAME, APP_VER } from '@vx/env/next'
import { NotFound } from '@vx/template/components'

export default () => <NotFound app={APP_NAME} version={APP_VER} />
