import { projects } from './projects'

export type Locale = 'pt' | 'en'
export type Localized = Record<Locale, string>
export type PublicLink = { label: string; href: string }
type AdditionalProject = {
  id?: string
  status?: Localized
  caseStudy?: { href: string; label: Localized }
  title: Localized
  category: Localized
  description: Localized
  stack: string[]
  link?: PublicLink
}
const l = (pt: string, en: string): Localized => ({ pt, en })

export const portfolio = {
  name: 'João Barreto',
  initials: 'JB',
  location: 'Portugal',
  timezone: 'Europe/Lisbon',
  coordinates: '39° N / 8° W',
  avatar: { src: 'jb-avatar.png', alt: l('Ilustração JB com chapéu turquesa e caneca de café', 'JB illustration with a turquoise hat and coffee mug') } as null | { src: string; alt: Localized },
  socials: [] as PublicLink[],
  projects,
  additionalProjects: [{
    id: 'forlife-cloud-wallet',
    title: l('ForLife Cloud Wallet', 'ForLife Cloud Wallet'),
    category: l('Automação Cloud · Integração de APIs', 'Cloud Automation · API Integration'),
    description: l(
      'Sistema de automação que gere reservas de ginásio, valida confirmações e mantém um passe digital na Google Wallet atualizado com o código de acesso.',
      'A cloud-based automation system that handles gym reservations, verifies booking confirmations and keeps a Google Wallet pass updated with the current access code.',
    ),
    status: l('Código privado · Caso de estudo público', 'Private Source · Public Case Study'),
    stack: ['Google Apps Script', 'Google Sheets', 'ForLife API', 'Google Wallet'],
    caseStudy: { href: '#forlife-cloud-wallet', label: l('Explorar projeto', 'Explore case study') },
  }] as AdditionalProject[],
}
