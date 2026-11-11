import { Headphones, ListMusic, Pause, Play, SkipBack, SkipForward, Volume2, VolumeX, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { publicAsset } from '../data/paths'
import { useLanguage } from '../i18n/Language'
import '../styles/radio.css'

const tracks = [
  { title: 'Morning Coffee', file: 'morning-coffee', source: 'lo-fi-and-chill/morning-coffee' },
  { title: 'Warm Fuzz', file: 'warm-fuzz', source: 'public-domain-lofi/warm-fuzz-lofi-retro' },
  { title: 'City Lights', file: 'city-lights', source: 'be-happy-with-who-you-are/city-lights-1' },
  { title: 'A Little Shade', file: 'a-little-shade', source: 'lo-fi-and-chill/a-little-shade' },
  { title: 'Peaceful Drift', file: 'peaceful-drift', source: 'public-domain-lofi/peaceful-drift-lofi-nostalgic-calm' },
]

const copy = {
  pt: {
    station: 'Rádio JB', close: 'Fechar fila', playlist: 'Fila de reprodução',
    play: 'Reproduzir', pause: 'Pausar rádio', previous: 'Faixa anterior', next: 'Faixa seguinte',
    volume: 'Volume da rádio', mute: 'Silenciar rádio', unmute: 'Reativar som', position: 'Posição na faixa',
    error: 'Não foi possível reproduzir a faixa. Tenta novamente ou escolhe outra.',
  },
  en: {
    station: 'JB Radio', close: 'Close queue', playlist: 'Play queue',
    play: 'Play', pause: 'Pause radio', previous: 'Previous track', next: 'Next track',
    volume: 'Radio volume', mute: 'Mute radio', unmute: 'Unmute radio', position: 'Track position',
    error: 'This track could not play. Try again or choose another track.',
  },
}

const storageKey = 'joao-portfolio-radio'
const defaultVolume = 0.32
const mediaPath = (index: number) => publicAsset('media/radio/' + tracks[index].file + '.mp3')
const formatTime = (seconds: number) => Math.floor(seconds / 60) + ':' + String(Math.floor(seconds % 60)).padStart(2, '0')

export function RadioPlayer() {
  const { locale } = useLanguage()
  const t = copy[locale]
  const audio = useRef<HTMLAudioElement>(null)
  const bar = useRef<HTMLDivElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const preferences = useRef({ index: 0, volume: defaultVolume, resume: true, muted: false })
  const awaitingGesture = useRef(false)
  const [index, setIndex] = useState(0)
  const [volume, setVolume] = useState(defaultVolume)
  const [muted, setMuted] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [error, setError] = useState(false)
  const [position, setPosition] = useState(0)
  const [duration, setDuration] = useState(0)
  const track = tracks[index]

  const play = useCallback(async (element: HTMLAudioElement) => {
    const source = element.src
    setError(false)
    try {
      await element.play()
    } catch (reason) {
      if (element.src !== source || (reason instanceof DOMException && reason.name === 'AbortError')) return
      if (reason instanceof DOMException && reason.name === 'NotAllowedError') {
        awaitingGesture.current = preferences.current.resume
      } else {
        setError(true)
      }
    }
  }, [])

  useEffect(() => {
    const element = audio.current
    if (!element) return
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) ?? '{}') ?? {}
      const index = Number.isInteger(saved.index) && tracks[saved.index] ? saved.index as number : 0
      const volume = typeof saved.volume === 'number' && saved.volume >= 0 && saved.volume <= 1 ? saved.volume : defaultVolume
      preferences.current = { index, volume, resume: true, muted: saved.muted === true }
      setIndex(index)
      setVolume(volume)
      setMuted(preferences.current.muted)
    } catch {
      // The player also works with storage disabled.
    }
    element.volume = preferences.current.volume
    element.muted = preferences.current.muted
    element.src = mediaPath(preferences.current.index)
    awaitingGesture.current = true
    void play(element)

    function tryAfterGesture(event: MouseEvent | KeyboardEvent) {
      if (!event.isTrusted || !element || !awaitingGesture.current || !preferences.current.resume || !element.paused) return
      if (event.target instanceof Element && event.target.closest('[data-radio-transport]')) return
      if (event instanceof KeyboardEvent && (event.repeat || event.key === 'Escape' || event.key === 'Tab')) return
      awaitingGesture.current = false
      void play(element)
    }
    window.addEventListener('click', tryAfterGesture)
    window.addEventListener('keydown', tryAfterGesture)
    return () => {
      window.removeEventListener('click', tryAfterGesture)
      window.removeEventListener('keydown', tryAfterGesture)
    }
  }, [play])

  function save() {
    const { index, volume, muted } = preferences.current
    try { localStorage.setItem(storageKey, JSON.stringify({ index, volume, muted })) } catch { /* Storage can be unavailable. */ }
  }

  function select(next: number, start: boolean) {
    const element = audio.current
    if (!element) return
    const source = mediaPath(next)
    if (element.getAttribute('src') !== source || element.error) {
      element.src = source
      setPosition(0)
      setDuration(0)
    }
    setIndex(next)
    setError(false)
    preferences.current.index = next
    preferences.current.resume = start
    save()
    if (start) void play(element)
  }

  function move(offset: number, start = preferences.current.resume) {
    select((preferences.current.index + offset + tracks.length) % tracks.length, start)
  }

  function toggle() {
    const element = audio.current
    if (!element) return
    if (element.paused) select(index, true)
    else {
      element.pause()
      awaitingGesture.current = false
      preferences.current.resume = false
    }
  }

  function adjustVolume(next: number) {
    const element = audio.current
    if (!element) return
    element.volume = next
    element.muted = false
    setMuted(false)
    setVolume(next)
    Object.assign(preferences.current, { volume: next, muted: false })
    save()
  }

  function toggleMute() {
    const element = audio.current
    if (!element) return
    element.muted = !element.muted
    setMuted(element.muted)
    preferences.current.muted = element.muted
    save()
  }

  const volumeControls = (
    <div className="radio-volume">
      <button type="button" aria-label={muted ? t.unmute : t.mute} onClick={toggleMute}>
        {muted || !volume ? <VolumeX size={18} aria-hidden="true" /> : <Volume2 size={18} aria-hidden="true" />}
      </button>
      <input type="range" min={0} max={100} value={Math.round(volume * 100)} aria-label={t.volume}
        onChange={event => adjustVolume(event.currentTarget.valueAsNumber / 100)} />
    </div>
  )

  return (
    <aside className="radio-player" aria-label={t.station}>
      <div className="container radio-bar" ref={bar}>
        <div className="radio-current">
          <span className="radio-cover" aria-hidden="true"><Headphones size={17} /></span>
          <div className="radio-track" aria-live="polite">
            <strong title={track.title}>{track.title}</strong>
            <span>HoliznaCC0</span>
          </div>
        </div>
        <div className="radio-transport" data-radio-transport>
          <button type="button" aria-label={t.previous} onClick={() => move(-1)}><SkipBack size={18} aria-hidden="true" /></button>
          <button className="radio-play" type="button" aria-label={playing ? t.pause : t.play} onClick={toggle}>
            {playing ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
          </button>
          <button type="button" aria-label={t.next} onClick={() => move(1)}><SkipForward size={18} aria-hidden="true" /></button>
        </div>
        <div className="radio-position">
          <span>{formatTime(position)}</span>
          <input type="range" min={0} max={duration || 1} step="any" value={position} disabled={!duration} aria-label={t.position}
            aria-valuetext={formatTime(position) + ' / ' + formatTime(duration)} onChange={event => {
              if (audio.current) audio.current.currentTime = event.currentTarget.valueAsNumber
              setPosition(event.currentTarget.valueAsNumber)
            }} />
          <span>{formatTime(duration)}</span>
        </div>
        <div className="radio-tools">
          <button type="button" className="radio-queue" popoverTarget="jb-radio-queue" aria-label={t.playlist} title={t.playlist}
            onClick={() => {
              if (bar.current) panel.current?.style.setProperty('--radio-queue-top', `${bar.current.getBoundingClientRect().bottom + 8}px`)
            }}>
            <ListMusic size={20} aria-hidden="true" />
          </button>
          <div className="radio-desktop-volume">{volumeControls}</div>
        </div>
      </div>
      {error && <p className="container radio-error" role="status">{t.error}</p>}
      <div className="radio-panel" id="jb-radio-queue" popover="auto" ref={panel} role="region" aria-labelledby="jb-radio-title">
        <div className="radio-list-header">
          <h2 id="jb-radio-title">{t.playlist}</h2>
          <button type="button" aria-label={t.close} onClick={() => panel.current?.hidePopover()}><X size={18} aria-hidden="true" /></button>
        </div>
        <ol className="radio-list">
          {tracks.map(({ title, file }, trackIndex) => (
            <li key={file}><button type="button" data-radio-transport aria-current={index === trackIndex ? 'true' : undefined} onClick={() => select(trackIndex, true)}>
              <span aria-hidden="true">{String(trackIndex + 1).padStart(2, '0')}</span>{title}
            </button></li>
          ))}
        </ol>
        <div className="radio-mobile-volume">{volumeControls}</div>
        <div className="radio-credits">
          <a href={'https://freemusicarchive.org/music/holiznacc0/' + track.source + '/'} target="_blank" rel="noopener noreferrer">HoliznaCC0</a>
          <a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank" rel="noopener noreferrer">CC0 1.0</a>
        </div>
      </div>
      <audio ref={audio} preload="none" onPlay={() => { setPlaying(true); awaitingGesture.current = false }} onPause={() => setPlaying(false)}
        onEnded={() => move(1, true)} onEmptied={() => setPlaying(false)}
        onError={() => { setPlaying(false); setError(true) }}
        onTimeUpdate={event => setPosition(event.currentTarget.currentTime)}
        onDurationChange={event => setDuration(Number.isFinite(event.currentTarget.duration) ? event.currentTarget.duration : 0)} />
    </aside>
  )
}
