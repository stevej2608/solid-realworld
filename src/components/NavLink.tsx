import { useRouter } from '../routeContext'

interface NavLinkProps {
  class: string
  active: boolean
  href: string
  route: string
}

export const NavLink = (props: NavLinkProps) => {
  const { getParams } = useRouter()
  return (
    <a
      class={props.class}
      classList={{ active: props.active || getParams()?.routeName === props.route }}
      href={`#/${props.href || props.route}`}
      onClick={() => window.scrollTo(0, 0)}
    >
      {props.children}
    </a>
  )
}
