import { useEffect, useState } from 'react'
import { portfolio } from '../data/portfolio'

export function useProjectDetails() {
  const [openId, setOpenId] = useState<string | null>(null)
  useEffect(() => {
    function read() {
      const id = new URLSearchParams(window.location.search).get('projeto')
      setOpenId(portfolio.projects.some(project => project.id === id) ? id : null)
    }
    read()
    window.addEventListener('popstate', read)
    return () => window.removeEventListener('popstate', read)
  }, [])

  function toggle(id: string) {
    const next = openId === id ? null : id
    const url = new URL(window.location.href)
    if (next) {
      url.searchParams.set('projeto', next)
      url.hash = 'construo'
    } else {
      url.searchParams.delete('projeto')
    }
    window.history.pushState(null, '', url)
    setOpenId(next)
  }

  return { openId, toggle }
}
