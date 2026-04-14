import { forwardRef, type MouseEvent, type ReactNode } from 'react'
import {
  Link,
  NavLink,
  type LinkProps,
  type NavLinkProps,
} from 'react-router-dom'

function shouldHandleScrollReset(event: MouseEvent<HTMLAnchorElement>) {
  return !(
    event.defaultPrevented
    || event.button !== 0
    || event.metaKey
    || event.altKey
    || event.ctrlKey
    || event.shiftKey
  )
}

function resetScrollPosition() {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
}

type ScrollLinkProps = LinkProps & {
  children: ReactNode
}

export const ScrollLink = forwardRef<HTMLAnchorElement, ScrollLinkProps>(function ScrollLink(
  { onClick, children, ...props },
  ref,
) {
  return (
    <Link
      {...props}
      ref={ref}
      onClick={(event) => {
        onClick?.(event)

        if (shouldHandleScrollReset(event)) {
          resetScrollPosition()
        }
      }}
    >
      {children}
    </Link>
  )
})

type ScrollNavLinkProps = NavLinkProps & {
  children: ReactNode
}

export const ScrollNavLink = forwardRef<HTMLAnchorElement, ScrollNavLinkProps>(function ScrollNavLink(
  { onClick, children, ...props },
  ref,
) {
  return (
    <NavLink
      {...props}
      ref={ref}
      onClick={(event) => {
        onClick?.(event)

        if (shouldHandleScrollReset(event)) {
          resetScrollPosition()
        }
      }}
    >
      {children}
    </NavLink>
  )
})