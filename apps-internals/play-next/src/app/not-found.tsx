'use client'

import { APP_NAME, APP_VER } from '@vezham/env/next'
import { NotFound } from '@vezham/template/components'

export default () => <NotFound app={APP_NAME} version={APP_VER} />
