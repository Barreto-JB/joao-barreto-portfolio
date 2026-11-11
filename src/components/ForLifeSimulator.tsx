import { type Ref, useEffect, useReducer, useRef, useState } from 'react'
import { ArrowRight, CalendarCheck, Check, Clipboard, Clock, Code2, RefreshCw, Wallet } from 'lucide-react'
import { useLanguage } from '../i18n/Language'
import { forlife } from '../i18n/forlife'
import { demoResult, operations } from '../data/forlifeDemo'

const transferMs = 1150
const processingMs = 950
const resultMs = 1650
const parents = [0, 0, 1, 2, 3, 4, 5, 1, 7, 8]
const positions = [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[2,1],[3,1],[4,1]]
type Mode = 'idle' | 'running' | 'paused' | 'failed' | 'completed'
type State = { mode: Mode; step: number; phase: 'active' | 'result' | 'transit'; scenario: number }
type Action = { type: 'run' | 'pause' | 'resume' | 'reset' | 'tick' | 'next' } | { type: 'scenario'; scenario: number }
const initial: State = { mode: 'idle', step: 0, phase: 'active', scenario: 0 }

function advance(state: State, mode: Mode): State {
  if (demoResult(state.step, state.scenario).status === 'failed') return { ...state, mode: 'failed' }
  if (state.step === 9) return { ...state, mode: 'completed' }
  return { ...state, step: state.step + 1, phase: mode === 'running' ? 'transit' : 'active', mode }
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'scenario': return { ...initial, scenario: action.scenario }
    case 'reset': return { ...initial, scenario: state.scenario }
    case 'run': return { ...initial, scenario: state.scenario, mode: 'running' }
    case 'pause': return { ...state, mode: 'paused' }
    case 'resume': return { ...state, mode: 'running' }
    case 'tick':
      if (state.mode !== 'running') return state
      if (state.phase === 'transit') return { ...state, phase: 'active' }
      if (state.phase === 'active') return { ...state, phase: 'result' }
      return advance(state, 'running')
    case 'next': return state.mode === 'idle' ? { ...state, mode: 'paused' } : state.phase === 'transit' ? { ...state, phase: 'active', mode: 'paused' } : advance(state, 'paused')
  }
}

function connector(index: number, mobile: boolean, centers: number[]) {
  const [x, y] = positions[index]
  const [px, py] = positions[parents[index]]
  if (mobile) {
    const from = centers[parents[index]] ?? parents[index] * 84 + 34
    const to = centers[index] ?? index * 84 + 34
    return parents[index] === index - 1 ? `M24 ${from}V${to}` : `M24 ${from}H5V${to}H24`
  }
  const from = px * 100 + 50
  const to = x * 100 + 50
  const start = py * 90 + 36
  const end = y * 90 + 36
  return start === end ? `M${from} ${start}H${to}` : `M${from} ${start}H${from + 50}V${end}H${to}`
}

function Connectors({ state, mobile, centers, height }: { state: State; mobile: boolean; centers: number[]; height: number }) {
  const svg = useRef<SVGSVGElement>(null)
  const motion = useRef<SVGAnimateMotionElement>(null)
  useEffect(() => {
    motion.current?.beginElement()
  }, [state.step, state.phase])
  useEffect(() => {
    if (state.mode === 'paused') svg.current?.pauseAnimations()
    else svg.current?.unpauseAnimations()
  }, [state.mode])
  return <svg ref={svg} className={mobile ? 'fl-wire fl-wire--mobile' : 'fl-wire fl-wire--desktop'}
    viewBox={mobile ? '0 0 32 ' + height : '0 0 700 180'} preserveAspectRatio="none" aria-hidden="true">
    {parents.slice(1).map((_, i) => <path key={i} d={connector(i + 1, mobile, centers)} />)}
    {state.phase === 'transit' && state.step > 0 && <circle key={state.step} r={mobile ? 3 : 2.5} className="fl-particle">
      <animateMotion ref={motion} begin="indefinite" dur={transferMs + "ms"} fill="freeze" path={connector(state.step, mobile, centers)} />
    </circle>}
  </svg>
}

function Highlight({ text }: { text: string }) {
  return <pre tabIndex={0}><code>{text.split(/("(?:[^"\\]|\\.)*"|\b(?:const|function|if|return|true|false|null)\b|\b\d+\b)/g).map((part, i) =>
    <span key={i} className={i % 2 ? 'fl-token' : undefined}>{part}</span>)}</code></pre>
}

function DemoPass({ ready, syncing, code, expired, elementRef }: { ready: boolean; syncing: boolean; code: string; expired: boolean; elementRef: Ref<HTMLElement> }) {
  const { locale } = useLanguage()
  const t = forlife[locale]
  const time = (hour: number) => new Intl.DateTimeFormat(locale === 'pt' ? 'pt-PT' : 'en-GB', {
    dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC',
  }).format(Date.UTC(2027, 0, 12, hour)) + ' UTC'
  return <aside className="fl-pass" data-syncing={syncing} ref={elementRef}>
    <div className="fl-pass-head"><Wallet size={19} aria-hidden="true" /> FORLIFE <span>{syncing ? t.syncing : ready ? t.ready : t.pending}</span></div>
    <strong>{t.pass}</strong><p>{t.member}</p>
    <div className="fl-demo-code"><span aria-hidden="true" /> <b>{t.demoOnly}</b></div>
    {expired && !ready && <p><code>DEMO-CODE-001</code> · {t.expired}</p>}
    {ready && <><code>{code}</code><dl><dt>{t.updated}</dt><dd>{time(8)}</dd><dt>{t.validity}</dt><dd>{time(11)}</dd></dl></>}
  </aside>
}

export function ForLifeSimulator() {
  const { locale } = useLanguage()
  const t = forlife[locale]
  const [state, dispatch] = useReducer(reducer, initial)
  const [selected, setSelected] = useState<number | null>(null)
  const [tab, setTab] = useState(0)
  const [copy, setCopy] = useState<{ text: string; status: 'copied' | 'copyError' } | null>(null)
  const elapsed = useRef({ key: '', remaining: 0 })
  const toolbar = useRef<HTMLDivElement>(null)
  const graph = useRef<HTMLDivElement>(null)
  const inspector = useRef<HTMLDivElement>(null)
  const pass = useRef<HTMLElement>(null)
  const following = useRef(false)
  const [geometry, setGeometry] = useState({ centers: [] as number[], height: 840 })
  useEffect(() => {
    const element = graph.current
    if (!element) return
    const update = () => {
      const next = Array.from(element.querySelectorAll<HTMLElement>('.fl-node'), node => node.offsetTop + node.offsetHeight / 2)
      setGeometry(previous => previous.height === element.offsetHeight && previous.centers.every((value, i) => value === next[i]) && previous.centers.length === next.length
        ? previous : { centers: next, height: element.offsetHeight })
    }
    const observer = new ResizeObserver(update)
    observer.observe(element)
    const inspector = element.querySelector('.fl-inspect-layout')
    if (inspector) observer.observe(inspector)
    update()
    return () => observer.disconnect()
  }, [selected, state.step, state.phase, locale, tab])
  useEffect(() => {
    const key = state.step + ':' + state.phase
    if (elapsed.current.key !== key || state.mode === 'idle') {
      elapsed.current = { key, remaining: { active: processingMs, result: resultMs, transit: transferMs }[state.phase] }
    }
    if (state.mode !== 'running') return
    const start = performance.now()
    const timer = setTimeout(() => dispatch({ type: 'tick' }), elapsed.current.remaining)
    return () => {
      clearTimeout(timer)
      elapsed.current.remaining = Math.max(0, elapsed.current.remaining - (performance.now() - start))
    }
  }, [state])

  const visibleStep = state.phase === 'transit' ? state.step - 1 : state.step
  const inspected = selected ?? visibleStep
  const result = demoResult(inspected, state.scenario)
  const processing = selected === null && state.mode === 'running' && state.phase === 'active'
  const content = tab === 1 && processing ? t.states.active : [result.request, result.response, result.source][tab]
  const finished = state.mode === 'completed' || state.mode === 'failed'
  const active = state.mode === 'running' || state.mode === 'paused'
  const ready = state.step >= 9 || state.step === 8 && state.phase === 'result'
  const settled = state.phase === 'result' || finished
  const completedSteps = state.mode === 'idle' ? 0 : state.step + Number(settled)
  const explanation = result.status === 'failed' ? t.error : result.status === 'waiting' ? t.early :
    result.status === 'skipped' ? state.scenario === 1 ? t.duplicate : inspected === 5 ? t.early : t.skipped :
      inspected === 7 && state.scenario === 3 ? t.rotated : t.steps[inspected][1]
  const outcome = result.status === 'success' ? inspected === 3 && state.scenario === 1 ? t.existing : t.outcomes[inspected] : explanation

  useEffect(() => {
    if (state.mode !== 'running') return
    function pauseOnNavigation() {
      following.current = false
      dispatch({ type: 'pause' })
    }
    window.addEventListener('wheel', pauseOnNavigation, { passive: true })
    window.addEventListener('touchmove', pauseOnNavigation, { passive: true })
    window.addEventListener('hashchange', pauseOnNavigation)
    return () => {
      window.removeEventListener('wheel', pauseOnNavigation)
      window.removeEventListener('touchmove', pauseOnNavigation)
      window.removeEventListener('hashchange', pauseOnNavigation)
    }
  }, [state.mode])

  useEffect(() => {
    if (!following.current || state.phase === 'transit' || state.mode === 'paused') return
    const finalPass = visibleStep === 9
    const showingResponse = settled && !finalPass
    const vertical = window.matchMedia('(max-width: 920px)').matches
    const target = finalPass ? pass.current : showingResponse ? inspector.current?.querySelector('pre')
      : vertical ? graph.current?.querySelectorAll('.fl-node')[visibleStep] : graph.current
    if (!target || !toolbar.current) return

    const root = getComputedStyle(document.documentElement)
    const top = (parseFloat(root.scrollPaddingTop) || 0) + toolbar.current.offsetHeight + 12
    const bottom = window.innerHeight - (parseFloat(root.scrollPaddingBottom) || 0) - 12
    const box = target.getBoundingClientRect()
    const targetBottom = !vertical && !showingResponse && !finalPass ? box.top + 180 : box.bottom
    const alignTop = vertical && !showingResponse || box.top < top || targetBottom - box.top > bottom - top
    const delta = alignTop ? box.top - top : Math.max(0, targetBottom - bottom)
    if (Math.abs(delta) < 4) return
    window.scrollBy({ top: delta, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }, [settled, state.mode, state.phase, visibleStep])

  function control(type: 'run' | 'pause' | 'resume' | 'reset' | 'next') {
    following.current = type === 'run' || type === 'resume'
    if (following.current) setTab(1)
    setSelected(null)
    setCopy(null)
    if (type === 'run' || type === 'reset') elapsed.current.key = ''
    dispatch({ type })
  }

  function togglePlayback() {
    control(state.mode === 'running' ? 'pause' : state.mode === 'paused' ? 'resume' : 'run')
  }

  return <section className="fl-console" data-following={active || finished} aria-labelledby="fl-simulator-title">
    <header className="fl-console-title"><h3 id="fl-simulator-title">{t.simulator}</h3><span>{t.demo}</span></header>
    <p>{t.instructions}</p>
    <div className="fl-controls">
      <label>{t.scenario}<select value={state.scenario} onChange={e => { following.current = false; setSelected(null); setCopy(null); dispatch({ type: 'scenario', scenario: Number(e.target.value) }) }}>
        {t.scenarios.map((name, i) => <option value={i} key={name}>{name}</option>)}
      </select></label>
    </div>
    <div className="fl-toolbar" ref={toolbar}>
      <div className="fl-buttons">
        <button className="fl-primary" onClick={togglePlayback}>
          {state.mode === 'running' ? t.pause : state.mode === 'paused' ? t.resume : finished ? t.replay : t.run}
        </button>
        <button onClick={() => control('next')} disabled={finished || state.mode === 'running'}>{t.next}</button>
        <button onClick={() => control('reset')}>{t.restart}</button>
      </div>
      <div className="fl-progress" hidden={state.mode === 'idle'}>
        <progress aria-label={t.stepProgress} max={t.steps.length} value={completedSteps} />
        <span>{completedSteps}/{t.steps.length}</span>
      </div>
      <p className="fl-run-state" role="status">{t.states[state.mode]}{active && ' · ' + t.steps[visibleStep][0]}</p>
    </div>
    <div className="fl-branches"><span><Clock size={15} aria-hidden="true" /> {t.booking}</span><span><Wallet size={15} aria-hidden="true" /> {t.access}</span></div>
    <p>{t.independent}</p>
    <div className="fl-graph" ref={graph}>
      <Connectors state={state} mobile={false} {...geometry} /><Connectors state={state} mobile {...geometry} />
      {t.steps.map(([name], i) => {
        const done = i < state.step || settled && i === state.step
        const status = done ? demoResult(i, state.scenario).status :
          active && i === state.step ? state.phase === 'transit' ? 'transit' : 'active' : 'idle'
        return <button key={i} type="button" className="fl-node" style={{ gridColumn: positions[i][0]+1, gridRow: positions[i][1]+1, order: i * 2 }}
          data-status={status} aria-pressed={inspected === i} onClick={() => {
            if (state.mode === 'running') control('pause')
            setSelected(i)
            setCopy(null)
          }}>
          <span>{String(i+1).padStart(2,'0')} {status === 'success' && <Check size={12} aria-hidden="true" />}</span>
          <strong>{name}</strong><small>{t.states[status]}</small>
        </button>
      })}
      <div className="fl-inspect-layout" style={{ order: inspected * 2 + 1 }}>
        <div className="fl-inspector" ref={inspector}>
          <h4><Code2 size={18} aria-hidden="true" /> {t.inspector}</h4>
          <div className="fl-tabs">{t.tabs.map((name, i) => <button type="button" aria-pressed={tab === i} key={i} onClick={() => { setTab(i); setCopy(null) }}>{name}</button>)}</div>
          <p className="fl-note">{tab === 2 ? t.example : t.illustrative}</p>
          <strong>{t.steps[inspected][0]}</strong>
          {[1,3,6,7].includes(inspected) && <code className="fl-operation">{operations[inspected]}</code>}
          <p>{explanation}</p>
          {tab === 1 && settled && outcome !== explanation && <p className="fl-result">{outcome}</p>}
          <Highlight text={content} />
          <button type="button" onClick={async () => {
            try { await navigator.clipboard.writeText(content); setCopy({ text: content, status: 'copied' }) }
            catch { setCopy({ text: content, status: 'copyError' }) }
          }}><Clipboard size={15} aria-hidden="true" /> {t.copy}</button>
          <span className="fl-copy-state" role="status">{copy?.text === content && t[copy.status]}</span>
        </div>
        <DemoPass elementRef={pass} ready={ready} syncing={state.step === 8 && state.phase === 'active'} code={demoResult(7,state.scenario).code} expired={state.scenario === 3} />
      </div>
    </div>
  </section>
}

export function ForLifeIllustration() {
  const { locale } = useLanguage()
  const labels = forlife[locale].art
  return <div className="fl-art" aria-hidden="true">
    <svg viewBox="0 0 360 172" fill="none">
      <path d="M54 46H306V124H217" stroke="var(--turquoise)" strokeWidth="2" strokeDasharray="4 7" className="fl-art-line" />
      {[Clock, Code2, CalendarCheck, RefreshCw].map((Icon, index) => {
        const x = 54 + index * 84
        return <g key={index}>
          <rect x={x-17} y="29" width="34" height="34" rx="7" fill="var(--surface-raised)" stroke="var(--turquoise)" />
          <Icon x={x-9} y={37} width={18} height={18} color={index === 2 ? 'var(--amber)' : 'var(--turquoise)'} />
          <text x={x} y="85" textAnchor="middle" fill="var(--mint)" fontSize="11">{labels[index]}</text>
        </g>
      })}
    </svg>
    <div className="fl-art-pass"><Wallet size={19} /><b>FORLIFE</b><ArrowRight size={15}/></div>
  </div>
}
