'use client'

import VLink from 'next/link'
import { useRouter } from 'next/navigation'

import { Link } from '@vezham/react-v3'

import { Home } from '@vx/template/pages'

export default () => {
  const router = useRouter()

  return (
    <>
      <VLink href="/pro" className="link">
        Open Pro page
        <Link.Icon />
      </VLink>

      <Link onPress={() => router.push('/pro')}>
        <Link.Icon />
        Navigate with Vezham UI
        <Link.Icon />
      </Link>

      <Home onPress={() => router.push('/pro')} />
    </>
  )
}
