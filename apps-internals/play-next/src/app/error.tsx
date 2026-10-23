'use client'

import { ErrorPage } from '@vezham/template/components'

type Props = {
  error: Error & { digest?: string }
  reset: () => void
}

export default ({ error }: Props) => <ErrorPage error={error} />
