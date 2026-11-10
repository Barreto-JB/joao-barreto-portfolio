import { useLanguage } from '../i18n/Language'

export function LanguageSwitch() {
  const { locale, setLocale, t } = useLanguage()
  return (
    <div className="language-switch" role="group" aria-label={t.language}>
      <button type="button" lang="pt-PT" aria-label="PT · Português" aria-pressed={locale === 'pt'} onClick={() => setLocale('pt')}>PT</button>
      <button type="button" lang="en" aria-label="EN · English" aria-pressed={locale === 'en'} onClick={() => setLocale('en')}>EN</button>
    </div>
  )
}
