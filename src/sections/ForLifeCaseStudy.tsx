import { ArrowLeft, ArrowDown } from 'lucide-react'
import { ForLifeSimulator, ForLifeIllustration } from '../components/ForLifeSimulator'
import { TechBadge } from '../components/Primitives'
import { useLanguage } from '../i18n/Language'
import { forlife } from '../i18n/forlife'
import { portfolio } from '../data/portfolio'

const Down = () => <ArrowDown className="fl-down" size={20} aria-hidden="true" />

export function ForLifeCaseStudy() {
  const { locale } = useLanguage()
  const t = forlife[locale]
  const project = portfolio.additionalProjects.find(project => project.id === 'forlife-cloud-wallet')!
  return <article id="forlife-cloud-wallet" className="fl-case" aria-labelledby="fl-case-title" tabIndex={-1}>
    <a className="text-link" href="#projetos"><ArrowLeft size={16} aria-hidden="true" />{t.back}</a>
    <header className="fl-hero">
      <div><span className="fl-kicker">ForLife Cloud Wallet</span><h2 id="fl-case-title">{t.hero}</h2><p>{t.intro}</p></div>
      <ForLifeIllustration />
    </header>
    <div className="fl-context">
      <section><h3>{t.problem}</h3><p>{t.problemText}</p></section>
      <section><h3>{t.solution}</h3><p>{t.solutionText}</p></section>
    </div>
    <ForLifeSimulator />
    <section className="fl-chapter">
      <h3>{t.architecture}</h3>
      <div className="fl-system">
        <div className="fl-system-node">{t.config}</div><Down />
        <div className="fl-system-node">{t.trigger}</div>
        <svg className="fl-fork" viewBox="0 0 400 34" preserveAspectRatio="none" aria-hidden="true"><path d="M200 0V13H100V34M200 13H300V34" /></svg>
        <div className="fl-system-branches">{t.architectureBranches.map((branch, index) => <ol key={index}>
          {branch.map((node, i) => <li key={node}>{i > 0 && <Down />}<div className="fl-system-node">{node}</div></li>)}
        </ol>)}</div>
      </div>
      <p>{t.independent}</p>
    </section>
    <section className="fl-chapter"><h3>{t.decisions}</h3><div className="fl-context">
      {t.decisionList.map(([title, description]) => <section key={title}><h4>{title}</h4><p>{description}</p></section>)}
    </div></section>
    <section className="fl-chapter"><h3>{t.stack}</h3><div className="tag-list">{project.stack.map(tech => <TechBadge key={tech}>{tech}</TechBadge>)}</div></section>
    <section className="fl-chapter fl-outcome"><h3>{t.outcome}</h3><p>{t.outcomeText}</p></section>
    <a className="text-link" href="#projetos"><ArrowLeft size={16} aria-hidden="true" />{t.back}</a>
  </article>
}
