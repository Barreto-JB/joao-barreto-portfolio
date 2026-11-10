import { ArrowUp, ArrowUpRight, Mail } from 'lucide-react'
import { CopyButton } from '../components/CopyButton'
import { InteractiveButton, SectionHeading, SocialLink } from '../components/Primitives'
import { portfolio } from '../data/portfolio'
import { useLanguage } from '../i18n/Language'

export function Contact() {
  const { t } = useLanguage()
  return (
    <section className="container section contact" id="contacto" aria-labelledby="contact-title" tabIndex={-1}>
      <SectionHeading id="contact-title" number="07" title={t.sections.contacto.title} />
      <div className="contact-panel">
        <div>
          <h3>{t.contactTitle}</h3>
          <p>{t.contactIntro}</p>
        </div>
        <div className="contact-actions">
          {portfolio.email && <InteractiveButton href={`mailto:${portfolio.email}`} variant="primary"><Mail size={17} aria-hidden="true" />{t.sendEmail}<ArrowUpRight size={16} aria-hidden="true" /></InteractiveButton>}
          <CopyButton email={portfolio.email ?? undefined} />
          {portfolio.socials.map(link => <SocialLink link={link} key={link.href} />)}
          {!portfolio.email && !portfolio.socials.length && <p className="empty-note">{t.contactPending}</p>}
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  const { t } = useLanguage()
  return (
    <footer className="container footer">
      <span translate="no">{portfolio.name}</span>
      <a className="text-link" href="#inicio">{t.back}<ArrowUp size={16} aria-hidden="true" /></a>
    </footer>
  )
}
