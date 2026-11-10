import { Binary, Code2, Layers3, Monitor, Smartphone, Zap } from 'lucide-react'
import { SectionHeading, TerminalLabel } from '../components/Primitives'
import { portfolio } from '../data/portfolio'
import { useLanguage } from '../i18n/Language'

const icons = { web: Monitor, code: Code2, build: Zap, style: Layers3, mobile: Smartphone }

export function TechStack() {
  const { locale, t } = useLanguage()
  return (
    <section className="container section" id="stack" aria-labelledby="stack-title" tabIndex={-1}>
      <SectionHeading id="stack-title" number="04" title={t.sections.stack.title} />
      <div className="tech-groups">
        {portfolio.technologies.map(({ group, items }) => (
          <div className="tech-group" key={group.pt}>
            <h3>{group[locale]}</h3>
            <ul>
              {items.map(({ name, icon }) => {
                const Icon = icons[icon]
                return <li key={name} translate="no"><Icon size={20} aria-hidden="true" />{name}</li>
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

export function TimelineItem({ title, description, date }: { title: string; description: string; date?: string }) {
  const { t } = useLanguage()
  const yearOnly = date?.length === 4
  const yearMonth = date?.length === 7
  const parsed = date ? new Date(yearOnly ? date + '-01-01' : yearMonth ? date + '-01' : date) : null
  const validDate = parsed && Number.isFinite(parsed.valueOf())
  const formatted = validDate ? new Intl.DateTimeFormat(t.locale, {
    year: 'numeric', month: yearOnly ? undefined : 'long', day: yearOnly || yearMonth ? undefined : 'numeric', timeZone: 'UTC',
  }).format(parsed) : null

  return (
    <li className="timeline-item">
      <TerminalLabel>{formatted ? <time dateTime={date}>{formatted}</time> : t.datePending}</TerminalLabel>
      <div><h3>{title}</h3><p>{description}</p></div>
    </li>
  )
}

export function Timeline() {
  const { locale, t } = useLanguage()
  const entries = [...portfolio.experience].sort((a, b) => (a.date ?? '9999').localeCompare(b.date ?? '9999'))
  return (
    <section className="container section" id="trajetoria" aria-labelledby="timeline-title" tabIndex={-1}>
      <SectionHeading id="timeline-title" number="05" title={t.sections.trajetoria.title} />
      <ol className="timeline">
        {entries.map(entry => <TimelineItem key={entry.title.pt} title={entry.title[locale]} description={entry.description[locale]} date={entry.date} />)}
      </ol>
    </section>
  )
}

export function About() {
  const { locale, t } = useLanguage()
  return (
    <section className="container section" id="sobre" aria-labelledby="about-title" tabIndex={-1}>
      <SectionHeading id="about-title" number="06" title={t.sections.sobre.title} />
      <div className="about-grid">
        <div className="about-art" aria-hidden="true"><Binary size={57} strokeWidth={1.15} /><span>{portfolio.initials}</span></div>
        <div className="about-copy">{portfolio.about.map(paragraph => <p key={paragraph.pt}>{paragraph[locale]}</p>)}</div>
      </div>
    </section>
  )
}
