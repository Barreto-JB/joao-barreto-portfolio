import { ArrowUp, ArrowUpRight, Download, Mail } from 'lucide-react'
import whatsappLogo from '../assets/technology/whatsapp.svg'
import { CopyButton } from '../components/CopyButton'
import { SectionHeading, SocialLink } from '../components/Primitives'
import { contact } from '../data/contact'
import { publicAsset } from '../data/paths'
import { portfolio } from '../data/portfolio'
import { useLanguage } from '../i18n/Language'

const copy = {
  pt: {
    title: 'Vamos conversar?',
    intro: 'Tens uma ideia para um projeto ou uma tarefa que gostarias de simplificar? Escreve-me.',
    whatsapp: 'Enviar mensagem no WhatsApp',
    email: 'Enviar e-mail',
    cv: 'Descarregar CV',
  },
  en: {
    title: 'Get in touch',
    intro: 'Have a project in mind or a task you’d like to make easier? Send me a message.',
    whatsapp: 'Message on WhatsApp',
    email: 'Send an email',
    cv: 'Download CV',
  },
} as const

export function Contact() {
  const { locale, t } = useLanguage()
  const text = copy[locale]
  return (
    <section className="container section contact" id="contacto" aria-labelledby="contact-title" tabIndex={-1}>
      <SectionHeading id="contact-title" number="07" title={t.sections.contacto.title} />
      <div className="contact-panel">
        <div className="contact-intro">
          <h3>{text.title}</h3>
          <p>{text.intro}</p>
        </div>
        <div className="contact-actions">
          <a href={contact.whatsapp.href} className="action action--primary contact-link" target="_blank" rel="noopener noreferrer">
            <img src={whatsappLogo} alt="" width={20} height={20} />
            <span><strong>{text.whatsapp}</strong><small translate="no">{contact.whatsapp.number}</small></span>
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
          <a href={`mailto:${contact.email}`} className="action action--outline contact-link">
            <Mail size={20} aria-hidden="true" />
            <span><strong>{text.email}</strong><small translate="no">{contact.email}</small></span>
          </a>
          <a href={publicAsset(contact.cv)} className="action action--outline contact-link" download>
            <Download size={20} aria-hidden="true" />
            <span><strong>{text.cv}</strong><small translate="no">PDF</small></span>
          </a>
        </div>
        <div className="contact-secondary">
          <CopyButton />
          {portfolio.socials.map(link => <SocialLink link={link} key={link.href} />)}
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
