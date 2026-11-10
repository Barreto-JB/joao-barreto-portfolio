import { LanguageSwitch } from './components/LanguageSwitch'
import { FloatingDock } from './components/FloatingDock'
import { portfolio } from './data/portfolio'
import { LanguageProvider, useLanguage } from './i18n/Language'
import { Hero } from './sections/Hero'
import { AdditionalProjects, Projects } from './sections/Projects'
import { About, TechStack, Timeline } from './sections/ProfileSections'
import { Contact, Footer } from './sections/Contact'

function PortfolioPage() {
  const { t } = useLanguage()
  return (
    <>
      <a href="#conteudo" className="skip-link">{t.skip}</a>
      <header className="masthead">
        <div className="container masthead-inner">
          <a className="brand" href="#inicio" aria-label={`${portfolio.initials} · ${portfolio.name}`} translate="no"><span aria-hidden="true">{portfolio.initials}<b>.</b></span></a>
          <LanguageSwitch />
        </div>
      </header>
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
      <FloatingDock />
    </>
  )
}

export function App() {
  return <LanguageProvider><PortfolioPage /></LanguageProvider>
}
