'use client'

import { ErrorPage } from '@vx/template/components'

type Props = {
  error: Error & { digest?: string }
  reset: () => void
}

export default ({ error }: Props) => <ErrorPage error={error} />
