import { Check, Copy } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../i18n/Language'
import { InteractiveButton } from './Primitives'

export function CopyButton({ email }: { email?: string }) {
  const { t } = useLanguage()
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle')
  const [fallback, setFallback] = useState('')
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => () => clearTimeout(timeout.current), [])

  const label = email ? t.copyEmail : t.copyLink
  async function copy() {
    const url = new URL(window.location.href)
    url.hash = ''
    url.search = ''
    const value = email ?? url.href
    clearTimeout(timeout.current)
    try {
      await navigator.clipboard.writeText(value)
      setState('copied')
      timeout.current = setTimeout(() => setState('idle'), 2600)
    } catch {
      setFallback(value)
      setState('failed')
    }
  }

  const Icon = state === 'copied' ? Check : Copy
  return (
    <div className="copy-control">
      <InteractiveButton onClick={copy}><Icon size={16} aria-hidden="true" />{label}</InteractiveButton>
      <span className="copy-feedback" role="status">
        {state === 'copied' && (email ? t.copiedEmail : t.copiedLink)}
        {state === 'failed' && t.copyFailed}
      </span>
      {state === 'failed' && <input className="copy-fallback" name="copy-value" type={email ? 'email' : 'url'} autoComplete="off" spellCheck={false} readOnly value={fallback} aria-label={label} onFocus={event => event.currentTarget.select()} />}
    </div>
  )
}
