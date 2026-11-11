import { SectionHeading } from '../components/Primitives'
import { technologyGroups } from '../data/technology'
import { useLanguage } from '../i18n/Language'
import '../styles/stack-contact.css'

export function TechStack() {
  const { locale, t } = useLanguage()
  return (
    <section className="container section stack" id="stack" aria-labelledby="stack-title" tabIndex={-1}>
      <SectionHeading id="stack-title" number="04" title={t.sections.stack.title} />
      <div className="tech-groups">
        {technologyGroups.map(({ title, items }) => (
          <div className="tech-group" key={title.pt}>
            <h3>{title[locale]}</h3>
            <ul>
              {items.map(({ name, logo, darkTile }) => (
                <li key={name} translate="no">
                  <span className="tech-logo" data-dark={darkTile}>
                    <img src={logo} alt="" width={22} height={22} loading="lazy" decoding="async" />
                  </span>
                  <span>{name}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
