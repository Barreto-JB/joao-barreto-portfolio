import { ArrowDown, Download, MapPin, Pause, Play, Terminal } from 'lucide-react'
import { useEffect, useState } from 'react'
import monogram from '../assets/monogram.svg?raw'
import { portfolio } from '../data/portfolio'
import { publicAsset } from '../data/paths'
import { useLanguage } from '../i18n/Language'
import { CopyButton } from '../components/CopyButton'
import { NetworkBackground } from '../components/NetworkBackground'
import { PortugalClock } from '../components/PortugalClock'
import { InteractiveButton, SocialLink, TerminalLabel } from '../components/Primitives'

export function Hero() {
  const { locale, t } = useLanguage()
  const [paused, setPaused] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(preference.matches)
    sync()
    preference.addEventListener('change', sync)
    return () => preference.removeEventListener('change', sync)
  }, [])

  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title" data-motion-paused={paused} tabIndex={-1}>
      <NetworkBackground paused={paused} />
      <div className="container hero-grid">
        <div className="hero-content">
          <TerminalLabel><Terminal size={16} aria-hidden="true" />{t.portfolio}<span className="terminal-cursor" aria-hidden="true" /></TerminalLabel>
          <h1 id="hero-title" translate="no">{portfolio.name}</h1>
          <p className="hero-headline">{portfolio.headline[locale]}</p>
          <p className="hero-description">{portfolio.subtitle[locale]}</p>
          <div className="hero-actions">
            <InteractiveButton href="#construo" variant="primary">{t.viewProjects}<ArrowDown size={17} aria-hidden="true" /></InteractiveButton>
            {portfolio.email && <CopyButton email={portfolio.email} />}
            {portfolio.cv && <InteractiveButton href={publicAsset(portfolio.cv)} download><Download size={17} aria-hidden="true" />{t.cv}</InteractiveButton>}
            {portfolio.socials.map(link => <SocialLink link={link} key={link.href} />)}
          </div>
        </div>
        <div className="profile">
          <div className="profile-art">
            <div className="profile-monogram" role="img" aria-label={t.profile} dangerouslySetInnerHTML={{ __html: monogram }} />
            {portfolio.avatar && <img className="avatar jb-avatar" src={publicAsset(portfolio.avatar.src)} width={512} height={512} alt={portfolio.avatar.alt[locale]} fetchPriority="high" />}
          </div>
          <div className="profile-meta">
            <span><MapPin size={15} aria-hidden="true" />{portfolio.location}</span>
            <PortugalClock />
            {!reduced && <button className="motion-control" type="button" aria-label={paused ? t.resume : t.pause}
              title={paused ? t.resume : t.pause} onClick={() => setPaused(value => !value)}>
              {paused ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}
            </button>}
          </div>
          <span className="profile-coordinates" aria-hidden="true">{portfolio.coordinates}</span>
        </div>
      </div>
    </section>
  )
}
