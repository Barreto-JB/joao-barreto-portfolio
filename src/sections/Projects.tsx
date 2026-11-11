import { ArrowUpRight, Folder } from 'lucide-react'
import { FeaturedProject, ProjectCard } from '../components/ProjectCard'
import { ProjectGallery } from '../components/ProjectGallery'
import { EscalaDemo } from '../components/EscalaDemo'
import { SectionHeading, TechBadge } from '../components/Primitives'
import { ForLifeCaseStudy } from './ForLifeCaseStudy'
import { ForLifeIllustration } from '../components/ForLifeSimulator'
import { portfolio } from '../data/portfolio'
import { useProjectDetails } from '../hooks/useProjectDetails'
import { useLanguage } from '../i18n/Language'

export function Projects() {
  const { t } = useLanguage()
  const { openId, toggle } = useProjectDetails()
  const [featured, ...projects] = portfolio.projects
  return (
    <section className="container section projects" id="construo" aria-labelledby="projects-title" tabIndex={-1}>
      <SectionHeading id="projects-title" number="02" title={t.sections.construo.title} />
      <div className="project-grid">
        <FeaturedProject project={featured} open={openId === featured.id} onToggle={() => toggle(featured.id)}>
          {openId === featured.id && <EscalaDemo />}
        </FeaturedProject>
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} open={openId === project.id} onToggle={() => toggle(project.id)}>
            {project.images.length > 1 && openId === project.id && <ProjectGallery images={project.images} title={project.title} />}
          </ProjectCard>
        ))}
      </div>
    </section>
  )
}

export function AdditionalProjects() {
  const { locale, t } = useLanguage()
  return (
    <section className="container section" id="projetos" aria-labelledby="additional-title" tabIndex={-1}>
      <SectionHeading id="additional-title" number="03" title={t.sections.projetos.title} />
      {portfolio.additionalProjects.length ? (
        <ul className="archive">
          {portfolio.additionalProjects.map(project => project.caseStudy ? (
            <li className="fl-project" key={project.id}>
              <div>
                <span className="fl-kicker">{project.category[locale]}</span>
                <h3>{project.title[locale]}</h3>
                <span className="fl-private">{project.status?.[locale]}</span>
                <p>{project.description[locale]}</p>
                <div className="tag-list">{project.stack.map(tech => <TechBadge key={tech}>{tech}</TechBadge>)}</div>
                <a className="action action--primary" href={project.caseStudy.href}>{project.caseStudy.label[locale]}<ArrowUpRight size={16} aria-hidden="true" /></a>
              </div>
              <ForLifeIllustration />
            </li>
          ) : (
            <li className="archive-row" key={project.title.pt}>
              <div><h3>{project.title[locale]}</h3><p>{project.description[locale]}</p></div>
              <span>{project.category[locale]}</span>
              <div className="tag-list">{project.stack.map(tech => <TechBadge key={tech}>{tech}</TechBadge>)}</div>
              {project.link && <a className="text-link" href={project.link.href}>{project.link.label}<ArrowUpRight size={16} aria-hidden="true" /></a>}
            </li>
          ))}
        </ul>
      ) : <p className="archive-empty"><Folder size={21} aria-hidden="true" />{t.moreEmpty}</p>}
      {portfolio.additionalProjects.some(project => project.id === 'forlife-cloud-wallet') && <ForLifeCaseStudy />}
    </section>
  )
}
