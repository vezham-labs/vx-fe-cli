import { Link as VLink, useNavigate } from '@tanstack/react-router'

import { HomeLayout } from '@vezham/docs-react/layouts/home'
import { Link, buttonVariants } from '@vezham/react-v3'

import { localizedRouteParam } from '@vx/start/runtime/docs'
import { Home } from '@vx/template/pages'

import { i18n } from '@app/docs'
import { baseOptions } from '@config/layout'
import type { Locale } from '@generated/vx'

type Props = {
  locale?: Locale
}

export default ({ locale }: Props) => {
  const navigate = useNavigate()
  const lang = localizedRouteParam(i18n, locale)

  return (
    <HomeLayout {...baseOptions(locale)}>
      <VLink
        to="/{-$lang}/docs"
        params={{
          lang
        }}
        className={buttonVariants({ variant: 'primary' })}>
        <Link.Icon />
        Open Docs
        <Link.Icon />
      </VLink>

      <VLink to="/{-$lang}/pro" params={{ lang }} className="link">
        Open Pro page
        <Link.Icon />
      </VLink>

      <Link onPress={() => navigate({ to: '/{-$lang}/pro', params: { lang } })}>
        <Link.Icon />
        Navigate with Vezham UI
        <Link.Icon />
      </Link>

      <Home
        onPress={() => navigate({ to: '/{-$lang}/pro', params: { lang } })}
      />
    </HomeLayout>
  )
}
