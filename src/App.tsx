import { LanguageSwitch } from './components/LanguageSwitch'
import { FloatingDock } from './components/FloatingDock'
import { RadioPlayer } from './components/RadioPlayer'
import { portfolio } from './data/portfolio'
import { LanguageProvider, useLanguage } from './i18n/Language'
import { Hero } from './sections/Hero'
import { AdditionalProjects, Projects } from './sections/Projects'
import { About, Timeline } from './sections/ProfileSections'
import { TechStack } from './sections/TechStack'
import { Contact, Footer } from './sections/Contact'

function PortfolioPage() {
  const { t } = useLanguage()
  return (
    <>
      <a href="#conteudo" className="skip-link">{t.skip}</a>
      <div className="site-top">
        <header className="masthead">
          <div className="container masthead-inner">
            <a className="brand" href="#inicio" aria-label={`${portfolio.initials} · ${portfolio.name}`} translate="no"><span aria-hidden="true">{portfolio.initials}<b>.</b></span></a>
            <FloatingDock />
            <LanguageSwitch />
          </div>
        </header>
        <RadioPlayer />
      </div>
      <main id="conteudo" tabIndex={-1}>
        <Hero />
        <Projects />
        <AdditionalProjects />
        <TechStack />
        <Timeline />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export function App() {
  return <LanguageProvider><PortfolioPage /></LanguageProvider>
}
