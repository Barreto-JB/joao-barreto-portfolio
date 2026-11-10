import { useEffect, useState } from 'react'
import { sectionIds } from '../i18n/translations'
import type { SectionId } from '../i18n/translations'

export function useActiveSection() {
  const [active, setActive] = useState<SectionId>('inicio')

  useEffect(() => {
    const sections = sectionIds.map(id => document.getElementById(id))
    let frame: number | undefined

    function update() {
      frame = undefined
      const line = Math.min(225, window.innerHeight * 0.32)
      let current: SectionId = 'inicio'
      for (const [index, section] of sections.entries()) {
        if (section && section.getBoundingClientRect().top <= line) current = sectionIds[index]
      }
      const pageEnd = document.documentElement.scrollHeight - window.innerHeight
      setActive(window.scrollY >= pageEnd - 3 ? 'contacto' : current)
    }

    function queueUpdate() {
      if (frame === undefined) frame = requestAnimationFrame(update)
    }

    const observer = new ResizeObserver(queueUpdate)
    if (document.querySelector('main')) observer.observe(document.querySelector('main')!)
    update()
    window.addEventListener('scroll', queueUpdate, { passive: true })
    window.addEventListener('resize', queueUpdate)
    return () => {
      if (frame !== undefined) cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', queueUpdate)
      window.removeEventListener('resize', queueUpdate)
    }
  }, [])

  return active
}
