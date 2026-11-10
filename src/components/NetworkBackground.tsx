import { useEffect, useRef } from 'react'

type Point = { x: number; y: number; vx: number; vy: number; radius: number }

export function NetworkBackground({ paused }: { paused: boolean }) {
  const element = useRef<HTMLCanvasElement>(null)
  const pausedState = useRef(paused)
  const syncAnimation = useRef<(() => void) | null>(null)

  useEffect(() => {
    pausedState.current = paused
    syncAnimation.current?.()
  }, [paused])

  useEffect(() => {
    const canvas = element.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return
    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    const fine = matchMedia('(pointer: fine)')
    const accent = getComputedStyle(canvas).getPropertyValue('--turquoise').trim()
    let width = 0
    let height = 0
    let visible = false
    let frame = 0
    let last = 0
    let points: Point[] = []
    let pointer: { x: number; y: number } | undefined

    function draw(elapsed = 0) {
      const ctx = context!
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = accent
      ctx.strokeStyle = accent
      for (const [index, point] of points.entries()) {
        point.x = (point.x + point.vx * elapsed + width) % width
        point.y = (point.y + point.vy * elapsed + height) % height
        ctx.globalAlpha = 0.42
        ctx.beginPath()
        ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2)
        ctx.fill()
        for (let next = index + 1; next < points.length; next++) {
          const other = points[next]
          const distance = (point.x - other.x) ** 2 + (point.y - other.y) ** 2
          if (distance < 125 ** 2) connect(point, other, 0.21 * (1 - distance / 125 ** 2))
        }
        if (pointer && fine.matches && !motion.matches && !pausedState.current) {
          const distance = (point.x - pointer.x) ** 2 + (point.y - pointer.y) ** 2
          if (distance < 145 ** 2) connect(point, pointer, 0.34 * (1 - distance / 145 ** 2))
        }
      }
    }

    function connect(from: Point, to: Pick<Point, 'x' | 'y'>, opacity: number) {
      const ctx = context!
      ctx.globalAlpha = opacity
      ctx.beginPath()
      ctx.moveTo(from.x, from.y)
      ctx.lineTo(to.x, to.y)
      ctx.stroke()
    }

    function tick(now: number) {
      frame = requestAnimationFrame(tick)
      if (last && now - last < 30) return
      draw(last ? Math.min(now - last, 60) : 0)
      last = now
    }

    function sync() {
      cancelAnimationFrame(frame)
      last = 0
      if (visible && !pausedState.current && !motion.matches && !document.hidden) frame = requestAnimationFrame(tick)
      else draw()
    }

    function resize() {
      const { clientWidth, clientHeight } = canvas!
      if (!clientWidth || !clientHeight || (width === clientWidth && height === clientHeight)) return
      width = clientWidth
      height = clientHeight
      const density = Math.min(devicePixelRatio || 1, width < 640 ? 1 : 1.5)
      canvas!.width = Math.round(width * density)
      canvas!.height = Math.round(height * density)
      context!.setTransform(density, 0, 0, density, 0, 0)
      const count = width < 640 ? 16 : Math.min(54, Math.ceil(width / 24))
      points = Array.from({ length: count }, () => ({
        x: Math.random() * width, y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.023, vy: (Math.random() - 0.5) * 0.023,
        radius: 0.7 + Math.random() * 0.9,
      }))
      draw()
    }

    function move(event: PointerEvent) {
      if (!fine.matches || motion.matches || pausedState.current) return
      const bounds = canvas!.getBoundingClientRect()
      pointer = { x: event.clientX - bounds.left, y: event.clientY - bounds.top }
    }

    function leave() { pointer = undefined }

    const parent = canvas.parentElement!
    const resizeObserver = new ResizeObserver(resize)
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      sync()
    })
    resize()
    syncAnimation.current = sync
    resizeObserver.observe(canvas)
    visibilityObserver.observe(canvas)
    parent.addEventListener('pointermove', move, { passive: true })
    parent.addEventListener('pointerleave', leave)
    motion.addEventListener('change', sync)
    document.addEventListener('visibilitychange', sync)
    return () => {
      syncAnimation.current = null
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      parent.removeEventListener('pointermove', move)
      parent.removeEventListener('pointerleave', leave)
      motion.removeEventListener('change', sync)
      document.removeEventListener('visibilitychange', sync)
    }
  }, [])

  return <canvas ref={element} className="network" aria-hidden="true" />
}
