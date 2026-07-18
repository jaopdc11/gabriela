import { useEffect, useRef } from 'react'

/** Um brilho quente e sutil que segue o cursor (só faz sentido no desktop). */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof matchMedia !== 'undefined' && !matchMedia('(hover: hover)').matches) return

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const cur = { ...target }
    let raf = 0

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX
      target.y = e.clientY
      el.style.opacity = '1'
    }
    const loop = () => {
      cur.x += (target.x - cur.x) * 0.12
      cur.y += (target.y - cur.y) * 0.12
      el.style.transform = `translate3d(${cur.x - 250}px, ${cur.y - 250}px, 0)`
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove)
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[35] h-[500px] w-[500px] opacity-0 mix-blend-screen transition-opacity duration-1000"
      style={{
        background: 'radial-gradient(circle, rgba(230,192,122,0.07), transparent 65%)',
      }}
    />
  )
}
