import { useEffect, useId, useRef, useState } from 'react'
import { ArrowDown, ArrowRight, CalendarDays, ChevronRight, FileSearch, FileText, Mail, Pause, Play, RotateCcw, Sun, UserRoundSearch } from 'lucide-react'
import { calendarDate, firstDay, getDay, lastDay, sampleDay, samplePayload } from '../data/escalaDemo'
import { publicAsset } from '../data/paths'
import { useLanguage } from '../i18n/Language'
import { escalaDemoCopy } from '../i18n/escalaDemo'
import '../styles/escala-demo.css'

const stepIcons = [Mail, FileSearch, FileText, UserRoundSearch, CalendarDays, Sun]
const days = Array.from({ length: lastDay }, (_, index) => index + firstDay)
const stepDuration = 2400

export function EscalaDemo() {
  const { locale, t } = useLanguage()
  const copy = escalaDemoCopy[locale]
  const heading = useId()
  const monthHeading = useId()
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [day, setDay] = useState(sampleDay)
  const daysRef = useRef<(HTMLButtonElement | null)[]>([])
  const lastStep = copy.steps.length - 1
  const current = copy.steps[step]
  const month = new Intl.DateTimeFormat(t.locale, { month: 'long', year: 'numeric', timeZone: 'UTC' })
  const weekday = new Intl.DateTimeFormat(t.locale, { weekday: 'short', timeZone: 'UTC' })
  const longDate = new Intl.DateTimeFormat(t.locale, { dateStyle: 'full', timeZone: 'UTC' })
  const shortDate = new Intl.DateTimeFormat(t.locale, { day: 'numeric', month: 'short', timeZone: 'UTC' })
  const selected = getDay(day)

  useEffect(() => {
    if (!playing) return
    const timer = window.setTimeout(() => {
      setStep(step + 1)
      if (step + 1 === lastStep) setPlaying(false)
    }, stepDuration)
    return () => window.clearTimeout(timer)
  }, [lastStep, playing, step])

  function seek(target: number) {
    setPlaying(false)
    setStep(target)
  }

  function togglePlayback() {
    if (!playing && step === lastStep) {
      setStep(0)
      setDay(sampleDay)
    }
    setPlaying(value => !value)
  }

  function keyboardDay(key: string) {
    switch (key) {
      case 'ArrowLeft': return day - 1
      case 'ArrowRight': return day + 1
      case 'ArrowUp': return day - 7
      case 'ArrowDown': return day + 7
      case 'Home': return firstDay
      case 'End': return lastDay
      default: return null
    }
  }

  return (
    <section className="rota-demo" aria-labelledby={heading}>
      <header className="rota-heading">
        <p>{copy.simulated}</p>
        <h4 id={heading}>{copy.heading}</h4>
        <p>{copy.summary}</p>
      </header>
      <div className="rota-controls">
        <button type="button" className="rota-run" onClick={togglePlayback}>
          {playing ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
          {playing ? copy.pause : step > 0 && step < lastStep ? copy.resume : copy.play}
        </button>
        <button type="button" onClick={() => seek(step + 1)} disabled={step === lastStep}>
          <ChevronRight size={16} aria-hidden="true" />{copy.next}
        </button>
        <button type="button" onClick={() => { seek(0); setDay(sampleDay) }}>
          <RotateCcw size={16} aria-hidden="true" />{copy.reset}
        </button>
      </div>
      <ol className="rota-steps">
        {copy.steps.map(([label], index) => {
          const Icon = stepIcons[index]
          const next = index < lastStep
          return (
            <li key={label}>
              <button type="button" aria-current={index === step ? 'step' : undefined} data-done={index < step} onClick={() => seek(index)}>
                <span><Icon size={18} aria-hidden="true" /><small>{String(index + 1).padStart(2, '0')}</small></span>
                <strong>{label}</strong>
              </button>
              {next && <span className="rota-connector" data-moving={playing && index === step} aria-hidden="true">
                <ArrowRight size={17} className="rota-connector-right" /><ArrowDown size={17} className="rota-connector-down" />
              </span>}
            </li>
          )
        })}
      </ol>
      <div className="rota-inspector">
        <div>
          <h5>{current[0]}</h5>
          <p role="status">{current[1]}</p>
        </div>
        <div className="rota-payload">
          <p>{copy.payload}</p>
          <pre><code>{samplePayload(step, day)}</code></pre>
        </div>
      </div>
      {step >= 4 && (
        <div className="rota-result">
          <div className="rota-calendar" role="group" aria-labelledby={monthHeading}>
            <h5 id={monthHeading}>{month.format(calendarDate(firstDay))}</h5>
            <div className="rota-week" aria-hidden="true">
              {days.slice(0, 7).map(date => <span key={date}>{weekday.format(calendarDate(date)).slice(0, 3)}</span>)}
            </div>
            <div className="rota-days">
              {days.map(date => {
                const working = Boolean(getDay(date).shift)
                return <button type="button" key={date} data-working={working} aria-pressed={day === date} tabIndex={day === date ? 0 : -1}
                  aria-label={longDate.format(calendarDate(date)) + ' · ' + (working ? copy.work : copy.rest)}
                  ref={element => { daysRef.current[date - firstDay] = element }}
                  onClick={() => setDay(date)}
                  onKeyDown={event => {
                    const target = keyboardDay(event.key)
                    if (target === null) return
                    event.preventDefault()
                    const next = Math.min(lastDay, Math.max(firstDay, target))
                    setDay(next)
                    daysRef.current[next - firstDay]?.focus()
                  }}>{date}</button>
              })}
            </div>
            <p className="rota-calendar-key"><span>{copy.work}</span><span>{copy.rest}</span></p>
          </div>
          <div className="rota-day" data-working={Boolean(selected.shift)}>
            <div className="rota-avatar">
              <img src={publicAsset('jb-avatar.png')} width={72} height={72} alt="" loading="lazy" decoding="async" />
              {selected.shift ? <CalendarDays size={17} aria-hidden="true" /> : <Sun size={17} aria-hidden="true" />}
            </div>
            <div role="status">
              <h5>{longDate.format(calendarDate(day))}</h5>
              <p>{selected.shift
                ? copy.work + ' · ' + copy.locations[selected.shift.place] + ' · ' + selected.shift.starts + '–' + selected.shift.ends
                : copy.rest}</p>
              <dl>
                <dt>{copy.nextShift}</dt>
                <dd>{selected.next
                  ? shortDate.format(new Date(selected.next.date)) + ' · ' + selected.next.starts + ' · ' + copy.locations[selected.next.place]
                  : copy.noShift}</dd>
              </dl>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
