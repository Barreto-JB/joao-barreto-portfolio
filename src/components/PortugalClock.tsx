import { useEffect, useMemo, useState } from 'react'
import { Clock3 } from 'lucide-react'
import { portfolio } from '../data/portfolio'
import { useLanguage } from '../i18n/Language'

export function PortugalClock() {
  const { t } = useLanguage()
  const [now, setNow] = useState<Date | null>(null)
  const format = useMemo(() => new Intl.DateTimeFormat(t.locale, {
    timeZone: portfolio.timezone,
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
  }), [t.locale])

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined
    function sync() {
      clearInterval(interval)
      if (document.hidden) return
      setNow(new Date())
      interval = setInterval(() => setNow(new Date()), 1000)
    }
    sync()
    document.addEventListener('visibilitychange', sync)
    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', sync)
    }
  }, [])

  return <span className="local-clock"><Clock3 size={15} aria-hidden="true" /><span className="sr-only">{t.localTime}</span>
    <time dateTime={now?.toISOString()} title={t.localTime}>{now ? format.format(now) : t.clockPending}</time>
  </span>
}
