import { ArrowUpRight } from 'lucide-react'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import type { PublicLink } from '../data/portfolio'

export function TerminalLabel({ children }: { children: ReactNode }) {
  return <span className="terminal-label">{children}</span>
}

export function SectionHeading({ id, number, title }: { id: string; number: string; title: string }) {
  return (
    <header className="section-heading">
      <span className="section-number" aria-hidden="true">{number} / 07</span>
      <h2 id={id}>{title}</h2>
    </header>
  )
}

export function TechBadge({ children }: { children: ReactNode }) {
  return <span className="tech-badge" translate="no">{children}</span>
}

export function StatusIndicator({ children }: { children: ReactNode }) {
  return <span className="status"><span aria-hidden="true" />{children}</span>
}

type ButtonProps =
  | ({ href: string; variant?: 'primary' | 'outline' } & ComponentPropsWithoutRef<'a'>)
  | ({ href?: never; variant?: 'primary' | 'outline' } & ComponentPropsWithoutRef<'button'>)

export function InteractiveButton(props: ButtonProps) {
  const classes = `action action--${props.variant ?? 'outline'}`
  if (props.href !== undefined) {
    const { variant: _variant, ...link } = props
    return <a className={classes} {...link} />
  }
  const { variant: _variant, href: _href, ...button } = props
  return <button className={classes} type="button" {...button} />
}

export function SocialLink({ link }: { link: PublicLink }) {
  return <a className="text-link" href={link.href} rel="me"><span translate="no">{link.label}</span><ArrowUpRight size={16} aria-hidden="true" /></a>
}
