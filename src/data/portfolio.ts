import scalesArt from '../assets/projects/scales.svg'
import accessArt from '../assets/projects/access.svg'
import automationArt from '../assets/projects/automation.svg'

export type Locale = 'pt' | 'en'
export type Localized = Record<Locale, string>
export type PublicLink = { label: string; href: string }
export type Project = {
  id: string
  title: Localized
  category: Localized
  description: Localized
  problem: Localized
  solution: Localized
  features: Localized[]
  technologies: string[]
  status?: Localized
  image: { illustration: string; screenshot?: string; alt: Localized }
  links: PublicLink[]
}
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
type Technology = { name: string; icon: 'web' | 'code' | 'build' | 'style' | 'mobile' }
type Experience = { title: Localized; description: Localized; date?: string }

const l = (pt: string, en: string): Localized => ({ pt, en })

export const portfolio = {
  name: 'João Barreto',
  initials: 'JB',
  location: 'Portugal',
  timezone: 'Europe/Lisbon',
  coordinates: '39° N / 8° W',
  avatar: { src: 'jb-avatar.png', alt: l('Ilustração JB com chapéu turquesa e caneca de café', 'JB illustration with a turquoise hat and coffee mug') } as null | { src: string; alt: Localized },
  email: null as string | null,
  cv: null as string | null,
  socials: [] as PublicLink[],
  headline: l('Transformo problemas reais em ferramentas digitais.', 'I turn real problems into digital tools.'),
  subtitle: l('Desenvolvimento de software, automação e soluções tecnológicas.', 'Software development, automation and technology solutions.'),
  about: [
    l('Gosto de perceber como as coisas funcionam e de encontrar formas de as tornar mais simples. Interesso-me por desenvolvimento de software, automação e código aberto.', 'I like understanding how things work and finding ways to make them simpler. I’m interested in software development, automation and open source.'),
    l('Parto de tarefas do dia a dia, como consultar uma escala, registar um acesso ou repetir um procedimento manual. A partir daí, procuro construir ferramentas que façam sentido para quem as usa.', 'I start with everyday work, such as checking a schedule, logging access or repeating a manual task. From there, I try to build tools that make sense to the people using them.'),
  ],
  projects: [
    {
      id: 'escalas',
      title: l('Visualizador de Escalas', 'Shift Schedule Viewer'),
      category: l('Aplicação web', 'Web application'),
      description: l('Aplicação web para consultar escalas, turnos, postos de trabalho, folgas e disponibilidade de equipas.', 'A web application for viewing schedules, shifts, workstations, days off and team availability.'),
      problem: l('Consultar quem está disponível implica cruzar informação sobre turnos, postos e folgas.', 'Checking who is available requires cross-referencing shifts, workstations and days off.'),
      solution: l('Reunir a consulta de escalas e da disponibilidade da equipa numa aplicação web.', 'Bring schedule and team availability information together in one web application.'),
      features: [
        l('Consulta de escalas e turnos', 'View schedules and shifts'),
        l('Consulta de postos de trabalho', 'View workstations'),
        l('Consulta de folgas e disponibilidade', 'Check days off and availability'),
      ],
      technologies: [],
      image: { illustration: scalesArt, alt: l('Diagrama ilustrativo de uma escala com turnos organizados numa grelha.', 'Illustrative diagram of a shift schedule arranged in a grid.') },
      links: [],
    },
    {
      id: 'acessos',
      title: l('Registo de Acessos', 'Access Log'),
      category: l('Aplicação Android', 'Android application'),
      description: l('Aplicação Android para registar entradas e saídas, consultar o histórico e exportar documentos.', 'An Android application for logging entries and exits, reviewing history and exporting documents.'),
      problem: l('O registo operacional de entradas e saídas precisa de poder ser consultado e exportado.', 'Operational entry and exit records need to be easy to review and export.'),
      solution: l('Reunir o registo, a consulta do histórico e a exportação de documentos numa aplicação Android.', 'Combine logging, history and document exports in one Android application.'),
      features: [
        l('Registo de entradas e saídas', 'Log entries and exits'),
        l('Consulta do histórico', 'Review access history'),
        l('Exportação de documentos', 'Export documents'),
      ],
      technologies: ['Android'],
      image: { illustration: accessArt, alt: l('Diagrama ilustrativo de um telemóvel com um registo de entradas e saídas.', 'Illustrative diagram of a phone showing an entry and exit log.') },
      links: [],
    },
    {
      id: 'automacao',
      title: l('Workflow Automation', 'Workflow Automation'),
      category: l('Ferramentas e extensões', 'Tools and extensions'),
      description: l('Ferramentas e extensões para automatizar tarefas repetitivas e reduzir operações manuais.', 'Tools and extensions that automate repetitive tasks and reduce manual work.'),
      problem: l('Há tarefas que exigem repetir os mesmos passos em cada execução.', 'Some tasks require the same steps to be repeated every time.'),
      solution: l('Criar ferramentas e extensões que automatizem passos repetitivos dos fluxos de trabalho.', 'Build tools and extensions that automate repetitive steps in workflows.'),
      features: [l('Automatização de tarefas repetitivas', 'Automate repetitive tasks')],
      technologies: [],
      image: { illustration: automationArt, alt: l('Diagrama ilustrativo com três etapas ligadas de um fluxo de trabalho.', 'Illustrative diagram of three connected workflow steps.') },
      links: [],
    },
  ] satisfies Project[],
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
  technologies: [
    { group: l('Neste portefólio', 'In this portfolio'), items: [
      { name: 'React', icon: 'web' },
      { name: 'TypeScript', icon: 'code' },
      { name: 'Vite', icon: 'build' },
      { name: 'Tailwind CSS', icon: 'style' },
    ] as Technology[] },
    { group: l('Plataforma dos projetos', 'Project platform'), items: [
      { name: 'Android', icon: 'mobile' },
    ] as Technology[] },
  ],
  experience: [
    {
      title: l('Desenvolvimento de ferramentas', 'Building digital tools'),
      description: l('Trabalho em aplicações de consulta de escalas e registo de acessos, além de ferramentas de automação.', 'Work on shift scheduling and access logging applications, along with automation tools.'),
    },
  ] as Experience[],
}
