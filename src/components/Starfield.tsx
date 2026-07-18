import { useEffect, useRef } from 'react'

type Star = {
  x: number
  y: number
  r: number
  base: number // brilho base
  amp: number // amplitude da cintilância
  phase: number
  speed: number
  layer: number // 0..1 profundidade (parallax)
  rgb: string // cor da estrela (branca, quente ou azulada)
}

/** Cor de uma estrela: maioria branca, algumas quentes, poucas azuladas. */
function starColor(roll: number) {
  if (roll < 0.16) return '232, 196, 128' // quente (dourada)
  if (roll < 0.3) return '196, 212, 246' // azulada
  return '245, 241, 232' // branco quente
}

type Meteor = {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  max: number
}

const prefersReduced = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

/** Céu de estrelas em canvas: cintilância, parallax e meteoros ocasionais. */
export function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = prefersReduced()
    let w = 0
    let h = 0
    let dpr = 1
    let stars: Star[] = []
    let motes: { x: number; y: number; r: number; a: number; vy: number }[] = []
    const meteors: Meteor[] = []
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 }
    let scrollY = window.scrollY

    // nuvens de nebulosa (cor difusa que dá profundidade ao céu)
    const nebulae = [
      { x: 0.22, y: 0.26, r: 0.55, col: [92, 108, 196], amp: 0.05, drift: 0.03 },
      { x: 0.8, y: 0.44, r: 0.62, col: [150, 78, 140], amp: 0.055, drift: 0.024 },
      { x: 0.5, y: 0.84, r: 0.5, col: [176, 116, 62], amp: 0.05, drift: 0.02 },
    ]

    const rand = (a: number, b: number) => a + Math.random() * (b - a)

    // sprites de glow (um por cor), criados uma vez — estrela vira luz suave, não disco
    const STAR_COLORS = ['245, 241, 232', '232, 196, 128', '196, 212, 246']
    const sprites = new Map<string, HTMLCanvasElement>()
    for (const rgb of STAR_COLORS) {
      const s = 64
      const c = document.createElement('canvas')
      c.width = c.height = s
      const g = c.getContext('2d')!
      const grad = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2)
      grad.addColorStop(0, `rgba(${rgb}, 1)`)
      grad.addColorStop(0.16, `rgba(${rgb}, 0.85)`)
      grad.addColorStop(0.45, `rgba(${rgb}, 0.2)`)
      grad.addColorStop(1, `rgba(${rgb}, 0)`)
      g.fillStyle = grad
      g.fillRect(0, 0, s, s)
      sprites.set(rgb, c)
    }

    function build() {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas!.width = Math.floor(w * dpr)
      canvas!.height = Math.floor(h * dpr)
      canvas!.style.width = w + 'px'
      canvas!.style.height = h + 'px'
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)

      // densidade proporcional à área, com teto pra performance
      const count = Math.min(260, Math.round((w * h) / 6500))
      stars = Array.from({ length: count }, () => {
        const layer = Math.random()
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r: rand(0.4, 1.5) * (0.6 + layer),
          base: rand(0.15, 0.7),
          amp: rand(0.1, 0.4),
          phase: Math.random() * Math.PI * 2,
          speed: rand(0.4, 1.3),
          layer,
          rgb: starColor(Math.random()),
        }
      })

      // partículas de luz desfocadas (bokeh) que sobem devagar
      motes = Array.from({ length: 8 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 8 + Math.random() * 22,
        a: 0.03 + Math.random() * 0.05,
        vy: 4 + Math.random() * 9,
      }))
    }

    let meteorTimer = rand(0.8, 2.2)

    function spawnMeteor() {
      const fromLeft = Math.random() < 0.5
      const startX = fromLeft ? rand(-0.1, 0.3) * w : rand(0.7, 1.1) * w
      const speed = rand(420, 640)
      const dir = fromLeft ? 1 : -1
      const ang = rand(0.18, 0.42) // radianos, descida suave
      meteors.push({
        x: startX,
        y: rand(0, 0.4) * h,
        vx: Math.cos(ang) * speed * dir,
        vy: Math.sin(ang) * speed,
        life: 0,
        max: rand(0.7, 1.1),
      })
    }

    function draw(dt: number, t: number) {
      ctx!.clearRect(0, 0, w, h)

      // nebulosa (aditiva, bem sutil)
      ctx!.globalCompositeOperation = 'lighter'
      for (const n of nebulae) {
        const cx = n.x * w + Math.sin(t * n.drift) * w * 0.05
        const cy = n.y * h + Math.cos(t * n.drift * 0.8) * h * 0.05 - scrollY * 0.02
        const rad = n.r * Math.max(w, h)
        const g = ctx!.createRadialGradient(cx, cy, 0, cx, cy, rad)
        const [r, gr, b] = n.col
        g.addColorStop(0, `rgba(${r}, ${gr}, ${b}, ${n.amp})`)
        g.addColorStop(1, `rgba(${r}, ${gr}, ${b}, 0)`)
        ctx!.fillStyle = g
        ctx!.fillRect(0, 0, w, h)
      }
      ctx!.globalCompositeOperation = 'source-over'

      // partículas de luz (bokeh) subindo devagar
      for (const mo of motes) {
        if (!reduced) {
          mo.y -= mo.vy * dt
          if (mo.y < -mo.r) {
            mo.y = h + mo.r
            mo.x = Math.random() * w
          }
        }
        const mg = ctx!.createRadialGradient(mo.x, mo.y, 0, mo.x, mo.y, mo.r)
        mg.addColorStop(0, `rgba(230, 205, 150, ${mo.a})`)
        mg.addColorStop(1, 'rgba(230, 205, 150, 0)')
        ctx!.fillStyle = mg
        ctx!.beginPath()
        ctx!.arc(mo.x, mo.y, mo.r, 0, Math.PI * 2)
        ctx!.fill()
      }

      const px = (mouse.x - w / 2) * 0.012
      const py = (mouse.y - h / 2) * 0.012

      for (const s of stars) {
        // parallax: camadas mais "próximas" (layer alto) deslocam mais
        const depth = 0.3 + s.layer
        const ox = px * depth * 6
        const oy = (py * depth * 6 + scrollY * s.layer * 0.06) % (h + 40)
        let y = s.y - oy
        if (y < -4) y += h + 8
        const x = s.x + ox

        // cintilância orgânica: duas ondas em frequências diferentes
        const flicker = reduced
          ? 0
          : Math.sin(t * s.speed + s.phase) * s.amp +
            Math.sin(t * s.speed * 2.7 + s.phase * 1.6) * s.amp * 0.35
        const alpha = Math.max(0, Math.min(1, s.base + flicker))

        const rgb = s.rgb

        // glow suave (sprite) no lugar de um disco chapado
        const size = s.r * 5.5
        ctx!.globalAlpha = alpha
        ctx!.drawImage(sprites.get(rgb)!, x - size, y - size, size * 2, size * 2)
        ctx!.globalAlpha = 1

        // brilho de difração (cruz) nas estrelas mais fortes — cintila com o brilho
        if (s.r > 1.15 && alpha > 0.4) {
          const len = s.r * (5 + alpha * 5)
          const a = alpha * 0.5
          ctx!.lineWidth = 0.6
          const gh = ctx!.createLinearGradient(x - len, y, x + len, y)
          gh.addColorStop(0, `rgba(${rgb}, 0)`)
          gh.addColorStop(0.5, `rgba(${rgb}, ${a})`)
          gh.addColorStop(1, `rgba(${rgb}, 0)`)
          ctx!.strokeStyle = gh
          ctx!.beginPath()
          ctx!.moveTo(x - len, y)
          ctx!.lineTo(x + len, y)
          ctx!.stroke()
          const gv = ctx!.createLinearGradient(x, y - len, x, y + len)
          gv.addColorStop(0, `rgba(${rgb}, 0)`)
          gv.addColorStop(0.5, `rgba(${rgb}, ${a})`)
          gv.addColorStop(1, `rgba(${rgb}, 0)`)
          ctx!.strokeStyle = gv
          ctx!.beginPath()
          ctx!.moveTo(x, y - len)
          ctx!.lineTo(x, y + len)
          ctx!.stroke()

          // sparkle de 8 pontas nas mais brilhantes: espículas diagonais, mais curtas
          if (s.r > 1.55) {
            const d = len * 0.42
            const gd = ctx!.createLinearGradient(x - d, y - d, x + d, y + d)
            gd.addColorStop(0, `rgba(${rgb}, 0)`)
            gd.addColorStop(0.5, `rgba(${rgb}, ${a * 0.6})`)
            gd.addColorStop(1, `rgba(${rgb}, 0)`)
            ctx!.strokeStyle = gd
            ctx!.beginPath()
            ctx!.moveTo(x - d, y - d)
            ctx!.lineTo(x + d, y + d)
            ctx!.stroke()
            const ga = ctx!.createLinearGradient(x - d, y + d, x + d, y - d)
            ga.addColorStop(0, `rgba(${rgb}, 0)`)
            ga.addColorStop(0.5, `rgba(${rgb}, ${a * 0.6})`)
            ga.addColorStop(1, `rgba(${rgb}, 0)`)
            ctx!.strokeStyle = ga
            ctx!.beginPath()
            ctx!.moveTo(x - d, y + d)
            ctx!.lineTo(x + d, y - d)
            ctx!.stroke()
          }
        }
      }

      // meteoros
      if (!reduced) {
        meteorTimer -= dt
        if (meteorTimer <= 0) {
          spawnMeteor()
          meteorTimer = rand(2, 4.5)
        }
      }
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i]
        m.life += dt
        m.x += m.vx * dt
        m.y += m.vy * dt
        const k = m.life / m.max
        if (k >= 1) {
          meteors.splice(i, 1)
          continue
        }
        const fade = Math.sin(k * Math.PI) // sobe e desce
        const tailX = m.x - m.vx * 0.14
        const tailY = m.y - m.vy * 0.14
        const grad = ctx!.createLinearGradient(m.x, m.y, tailX, tailY)
        grad.addColorStop(0, `rgba(255, 250, 235, ${0.95 * fade})`)
        grad.addColorStop(0.4, `rgba(245, 235, 210, ${0.4 * fade})`)
        grad.addColorStop(1, 'rgba(245, 235, 210, 0)')
        ctx!.lineCap = 'round'
        ctx!.strokeStyle = grad
        // rastro largo e suave
        ctx!.globalAlpha = 0.45
        ctx!.lineWidth = 2.6
        ctx!.beginPath()
        ctx!.moveTo(m.x, m.y)
        ctx!.lineTo(tailX, tailY)
        ctx!.stroke()
        // núcleo nítido do rastro
        ctx!.globalAlpha = 1
        ctx!.lineWidth = 1
        ctx!.beginPath()
        ctx!.moveTo(m.x, m.y)
        ctx!.lineTo(tailX, tailY)
        ctx!.stroke()
        // cabeça brilhante com glow
        const hg = ctx!.createRadialGradient(m.x, m.y, 0, m.x, m.y, 5)
        hg.addColorStop(0, `rgba(255, 252, 240, ${fade})`)
        hg.addColorStop(1, 'rgba(255, 252, 240, 0)')
        ctx!.fillStyle = hg
        ctx!.beginPath()
        ctx!.arc(m.x, m.y, 5, 0, Math.PI * 2)
        ctx!.fill()
        ctx!.lineCap = 'butt'
      }

      // lua — presença suave e distante, velando o céu
      const moonX = w * 0.82 + px * 2
      const moonY = h * 0.19 - scrollY * 0.03
      const mr = Math.max(30, Math.min(w, h) * 0.055)
      const halo = ctx!.createRadialGradient(moonX, moonY, mr * 0.5, moonX, moonY, mr * 5)
      halo.addColorStop(0, 'rgba(240, 234, 216, 0.16)')
      halo.addColorStop(1, 'rgba(240, 234, 216, 0)')
      ctx!.fillStyle = halo
      ctx!.beginPath()
      ctx!.arc(moonX, moonY, mr * 5, 0, Math.PI * 2)
      ctx!.fill()
      const disc = ctx!.createRadialGradient(
        moonX - mr * 0.3,
        moonY - mr * 0.3,
        mr * 0.2,
        moonX,
        moonY,
        mr,
      )
      disc.addColorStop(0, 'rgba(252, 249, 240, 0.95)')
      disc.addColorStop(1, 'rgba(220, 216, 202, 0.7)')
      ctx!.fillStyle = disc
      ctx!.beginPath()
      ctx!.arc(moonX, moonY, mr, 0, Math.PI * 2)
      ctx!.fill()
    }

    let raf = 0
    let last = performance.now()
    function frame(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      // easing do mouse
      mouse.x += (mouse.tx - mouse.x) * 0.06
      mouse.y += (mouse.ty - mouse.y) * 0.06
      draw(dt, now / 1000)
      raf = requestAnimationFrame(frame)
    }

    function onResize() {
      build()
    }
    function onScroll() {
      scrollY = window.scrollY
    }
    function onMouse(e: MouseEvent) {
      mouse.tx = e.clientX
      mouse.ty = e.clientY
    }

    build()
    if (reduced) {
      // desenha um quadro estático e para
      draw(0, 0)
    } else {
      raf = requestAnimationFrame(frame)
    }
    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('mousemove', onMouse)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mousemove', onMouse)
    }
  }, [])

  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-0" aria-hidden />
}
