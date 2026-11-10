import { ArrowUpRight, Image, Minus, Plus } from 'lucide-react'
import type { Project } from '../data/portfolio'
import { publicAsset } from '../data/paths'
import { useLanguage } from '../i18n/Language'
import { StatusIndicator, TechBadge, TerminalLabel } from './Primitives'

type CardProps = { project: Project; open: boolean; onToggle: () => void }

export function ProjectCard({ project, open, onToggle, featured = false }: CardProps & { featured?: boolean }) {
  const { locale, t } = useLanguage()
  const detailsId = `detalhes-${project.id}`
  const headingId = `titulo-${project.id}`
  const ToggleIcon = open ? Minus : Plus

  return (
    <article aria-labelledby={headingId} className={`project-card${featured ? ' project-card--featured' : ''}`}>
      <figure className="project-figure">
        <div className="project-image">
          <img
            src={project.image.screenshot ? publicAsset(project.image.screenshot) : project.image.illustration}
            width={featured ? 720 : 600} height={featured ? 400 : 320}
            alt={project.image.alt[locale]} loading="lazy" decoding="async"
          />
        </div>
        <figcaption><Image size={14} aria-hidden="true" />{project.image.screenshot ? t.screenshot : t.illustration}</figcaption>
      </figure>
      <div className="project-content">
        <div className="project-category">
          {featured && <TerminalLabel>{t.featured}</TerminalLabel>}
          <span>{project.category[locale]}</span>
        </div>
        <h3 id={headingId}>{project.title[locale]}</h3>
        <p>{project.description[locale]}</p>
        <div className="project-status"><StatusIndicator>{project.status?.[locale] ?? t.status}</StatusIndicator></div>
        <button type="button" className="project-toggle" aria-expanded={open} aria-controls={detailsId} onClick={onToggle}>
          {t.details}<ToggleIcon size={17} aria-hidden="true" />
        </button>
      </div>
      <div className="project-details" id={detailsId} hidden={!open}>
        <dl>
          <div><dt>{t.problem}</dt><dd>{project.problem[locale]}</dd></div>
          <div><dt>{t.solution}</dt><dd>{project.solution[locale]}</dd></div>
          <div><dt>{t.features}</dt><dd><ul>{project.features.map(feature => <li key={feature.pt}>{feature[locale]}</li>)}</ul></dd></div>
          <div><dt>{t.technologies}</dt><dd>{project.technologies.length ? (
            <span className="tag-list">{project.technologies.map(tech => <TechBadge key={tech}>{tech}</TechBadge>)}</span>
          ) : t.stackPending}</dd></div>
        </dl>
        {project.links.length > 0 ? (
          <ul className="project-links">
            {project.links.map(link => <li key={link.href}><a className="text-link" href={link.href}>{link.label}<ArrowUpRight size={16} aria-hidden="true" /></a></li>)}
          </ul>
        ) : <p className="empty-note">{t.linksPending}</p>}
      </div>
    </article>
  )
}

export function FeaturedProject(props: CardProps) {
  return <ProjectCard {...props} featured />
}
