import { ArrowUpRight, Image, Minus, Plus } from 'lucide-react'
import type { ReactNode } from 'react'
import type { Project } from '../data/projects'
import { publicAsset } from '../data/paths'
import { useLanguage } from '../i18n/Language'
import { StatusIndicator, TechBadge, TerminalLabel } from './Primitives'

type CardProps = { project: Project; open: boolean; onToggle: () => void; children?: ReactNode }

export function ProjectCard({ project, open, onToggle, children, featured = false }: CardProps & { featured?: boolean }) {
  const { locale, t } = useLanguage()
  const detailsId = `detalhes-${project.id}`
  const headingId = `titulo-${project.id}`
  const ToggleIcon = open ? Minus : Plus
  const [image] = project.images

  return (
    <article aria-labelledby={headingId} className={`project-card${featured ? ' project-card--featured' : ''}`}>
      <figure className="project-figure">
        <div className="project-image">
          <img
            src={publicAsset(image.src)}
            width={image.width} height={image.height}
            alt={image.alt[locale]} loading="lazy" decoding="async"
          />
        </div>
        <figcaption><Image size={14} aria-hidden="true" />{image.caption[locale]}</figcaption>
      </figure>
      <div className="project-content">
        <div className="project-category">
          {featured && <TerminalLabel>{t.featured}</TerminalLabel>}
          <span>{project.category[locale]}</span>
        </div>
        <h3 id={headingId}>{project.title}</h3>
        <p>{project.description[locale]}</p>
        <div className="project-status"><StatusIndicator>{project.status[locale]}</StatusIndicator></div>
        {project.links.length > 0 && (
          <ul className="project-links">
            {project.links.map((link, i) => (
              <li key={link.href}>
                <a className={i === 0 ? 'action action--primary' : 'action action--outline'} href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label[locale]}<ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        )}
        {project.notice && <p className="project-notice">{project.notice[locale]}</p>}
        <button type="button" className="project-toggle" aria-expanded={open} aria-controls={detailsId} onClick={onToggle}>
          {t.details}<ToggleIcon size={17} aria-hidden="true" />
        </button>
      </div>
      <div className="project-details" id={detailsId} hidden={!open}>
        <dl>
          <div><dt>{t.problem}</dt><dd>{project.problem[locale]}</dd></div>
          <div><dt>{t.solution}</dt><dd>{project.solution[locale]}</dd></div>
          <div><dt>{t.features}</dt><dd><ul>{project.features.map(feature => <li key={feature.pt}>{feature[locale]}</li>)}</ul></dd></div>
          <div><dt>{t.technologies}</dt><dd>
            <span className="tag-list">{project.technologies.map(tech => <TechBadge key={tech}>{tech}</TechBadge>)}</span>
          </dd></div>
        </dl>
        {children}
      </div>
    </article>
  )
}

export function FeaturedProject(props: CardProps) {
  return <ProjectCard {...props} featured />
}
