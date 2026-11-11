import { ArrowRight, Binary, FlaskConical, Play, RotateCcw, Search, Waypoints } from 'lucide-react'
import { useEffect, useState } from 'react'
import { InteractiveButton, SectionHeading } from '../components/Primitives'
import { portfolio } from '../data/portfolio'
import { useLanguage } from '../i18n/Language'
import { journey } from '../i18n/journey'
import '../styles/journey.css'

function LuaExample() {
  const { locale } = useLanguage()
  const t = journey[locale]
  const [stage, setStage] = useState(0)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!running) return
    const timer = window.setTimeout(() => {
      setStage(stage + 1)
      if (stage === 1) setRunning(false)
    }, 650)
    return () => window.clearTimeout(timer)
  }, [running, stage])

  return (
    <figure className="journey-lua" aria-labelledby="journey-lua-title">
      <figcaption id="journey-lua-title">{t.luaTitle}</figcaption>
      <div className="journey-console">
        <div className="journey-console-bar"><span className="journey-console-lights" aria-hidden="true">● ● ●</span><span translate="no">task.lua</span></div>
        <pre translate="no"><code><span>local</span>{' state = "waiting"\n\n'}<span>local function</span>{' update(event)\n  '}<span>if</span>{' event == "start" '}<span>then</span>{'\n    state = "active"\n  '}<span>elseif</span>{' event == "finish" '}<span>then</span>{'\n    state = "done"\n  '}<span>end</span>{'\n  '}<span>return</span>{' state\n'}<span>end</span></code></pre>
        <div className="journey-console-output" role="status">
          {t.luaStates.slice(0, stage + 1).map(line => <p key={line}><span aria-hidden="true">&gt; </span>{line}</p>)}
        </div>
        <div className="journey-console-actions">
          <InteractiveButton variant="primary" disabled={running} onClick={() => { setStage(0); setRunning(true) }}>
            <Play size={16} aria-hidden="true" />{running ? t.luaRunning : t.luaStart}
          </InteractiveButton>
          <InteractiveButton onClick={() => { setStage(0); setRunning(false) }}>
            <RotateCcw size={16} aria-hidden="true" />{t.luaReset}
          </InteractiveButton>
        </div>
      </div>
      <p className="journey-lua-caption">{t.luaCaption}</p>
    </figure>
  )
}

export function Timeline() {
  const { locale, t } = useLanguage()
  const copy = journey[locale]
  return (
    <section className="container section" id="trajetoria" aria-labelledby="timeline-title" tabIndex={-1}>
      <SectionHeading id="timeline-title" number="05" title={t.sections.trajetoria.title} />
      <div className="journey-panel">
        <div className="journey-intro">
          <p className="journey-display">{copy.journeyTitle[0]}<br /><span>{copy.journeyTitle[1]}</span></p>
          <p>{copy.journeyIntro}</p>
        </div>
        <div className="journey-grid">
          <ol className="journey-list" role="list">
            {copy.milestones.map(({ label, date, title, text, tags }) => (
              <li className="journey-milestone" key={label}>
                {date ? <time dateTime={date}>{label}</time> : <span>{label}</span>}
                <h3>{title}</h3>
                <p>{text}</p>
                {tags && <ul className="journey-tags" role="list">{tags.map(tag => <li key={tag} translate="no">{tag}</li>)}</ul>}
              </li>
            ))}
          </ol>
          <LuaExample />
        </div>
      </div>
    </section>
  )
}

const thinkingIcons = [Search, FlaskConical, Waypoints]

export function About() {
  const { locale, t } = useLanguage()
  const copy = journey[locale]
  return (
    <section className="container section" id="sobre" aria-labelledby="about-title" tabIndex={-1}>
      <SectionHeading id="about-title" number="06" title={t.sections.sobre.title} />
      <div className="about-grid">
        <div className="about-art" aria-hidden="true"><Binary size={57} strokeWidth={1.15} /><span>{portfolio.initials}</span></div>
        <div className="about-copy">
          <p>{copy.about}</p>
          <h3 className="thinking-title">{copy.thinkingTitle}</h3>
          <ol className="thinking-steps" role="list">
            {copy.thinkingSteps.map((step, index) => {
              const Icon = thinkingIcons[index]
              return (
                <li key={step}>
                  <Icon size={19} aria-hidden="true" />
                  {step}
                  {index < copy.thinkingSteps.length - 1 && <ArrowRight className="thinking-arrow" size={16} aria-hidden="true" />}
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
