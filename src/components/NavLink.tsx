import { useRouter } from '../routeContext'

interface NavLinkProps {
  class: string
  active: boolean
  href: string
  route: string
}

export const NavLink = (props: NavLinkProps) => {
  const { route } = useRouter()
  // console.log('NavLink href =%s', `/${props.href || props.route}`)
  return (
    <a
      class={props.class}
      classList={{ active: props.active || route === props.route }}
      href={`/${props.href || props.route}`}
      onClick={() => window.scrollTo(0, 0)}
    >
      {props.children}
    </a>
  )
}
