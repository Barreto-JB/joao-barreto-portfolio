import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { Locale } from '../data/portfolio'
import { translations } from './translations'

const preferenceKey = 'joao-portfolio-language'
const LanguageContext = createContext({
  locale: 'pt' as Locale,
  setLocale: (_locale: Locale) => {},
  t: translations.pt,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('pt')
  const t = translations[locale]

  useEffect(() => {
    try {
      if (localStorage.getItem(preferenceKey) === 'en') setLocale('en')
    } catch {
      // The Portuguese default is available when storage is disabled.
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = t.locale
    document.title = t.title
  }, [t])

  function changeLanguage(next: Locale) {
    setLocale(next)
    try {
      localStorage.setItem(preferenceKey, next)
    } catch {
      // Language can still change for the current visit.
    }
  }

  return <LanguageContext.Provider value={{ locale, setLocale: changeLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  return useContext(LanguageContext)
}
