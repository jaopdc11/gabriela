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

/**
 * Nuvens de nebulosa (cor difusa que dá profundidade ao céu). Moram numa camada
 * de CSS atrás do canvas, e não nele: pintar três gradientes maiores que a tela
 * a cada quadro era, sozinho, metade do custo do céu, por um movimento que
 * levava minutos pra se notar. Assim o navegador pinta uma vez e só desliza a
 * camada com a rolagem.
 */
const NEBULAE = [
  { x: 0.22, y: 0.26, r: 0.55, col: '92, 108, 196', amp: 0.05 },
  { x: 0.8, y: 0.44, r: 0.62, col: '150, 78, 140', amp: 0.055 },
  { x: 0.5, y: 0.84, r: 0.5, col: '176, 116, 62', amp: 0.05 },
]
const NEBULA_BG = NEBULAE.map(
  (n) =>
    `radial-gradient(circle ${n.r * 100}vmax at ${n.x * 100}% calc(${n.y} * 100lvh), rgba(${n.col}, ${n.amp}), rgba(${n.col}, 0))`,
).join(', ')

const prefersReduced = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

/** Céu de estrelas em canvas: cintilância, parallax e meteoros ocasionais. */
export function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null)
  const nebulaRef = useRef<HTMLDivElement>(null)

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

    /**
     * Tudo que era gradiente recriado a cada quadro (nebulosa em tela cheia,
     * bokeh, cruz das estrelas, lua) vira desenho pronto, feito uma vez só: o
     * quadro passa a ser só carimbar imagem. Criar gradiente e pintar ele pixel
     * a pixel, 60 vezes por segundo, era o que travava o céu no celular.
     */
    const radial = (size: number, stops: [number, string][]) => {
      const c = document.createElement('canvas')
      c.width = c.height = size
      const g = c.getContext('2d')!
      const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
      for (const [at, col] of stops) grad.addColorStop(at, col)
      g.fillStyle = grad
      g.fillRect(0, 0, size, size)
      return c
    }

    const moteSprite = radial(64, [
      [0, 'rgba(230, 205, 150, 1)'],
      [1, 'rgba(230, 205, 150, 0)'],
    ])

    // a espícula: um traço que desbota nas duas pontas, esticado no tamanho da cruz
    const spikes = new Map<string, HTMLCanvasElement>()
    for (const rgb of STAR_COLORS) {
      const c = document.createElement('canvas')
      c.width = 64
      c.height = 1
      const g = c.getContext('2d')!
      const grad = g.createLinearGradient(0, 0, 64, 0)
      grad.addColorStop(0, `rgba(${rgb}, 0)`)
      grad.addColorStop(0.5, `rgba(${rgb}, 1)`)
      grad.addColorStop(1, `rgba(${rgb}, 0)`)
      g.fillStyle = grad
      g.fillRect(0, 0, 64, 1)
      spikes.set(rgb, c)
    }

    // a lua (halo + disco), refeita só quando a tela muda de tamanho
    let moon: HTMLCanvasElement | null = null
    let mr = 30
    function buildMoon() {
      mr = Math.max(30, Math.min(w, h) * 0.055)
      const half = Math.ceil(mr * 5)
      const c = document.createElement('canvas')
      c.width = c.height = Math.ceil(half * 2 * dpr)
      const g = c.getContext('2d')!
      g.scale(dpr, dpr)
      const halo = g.createRadialGradient(half, half, mr * 0.5, half, half, mr * 5)
      halo.addColorStop(0, 'rgba(240, 234, 216, 0.16)')
      halo.addColorStop(1, 'rgba(240, 234, 216, 0)')
      g.fillStyle = halo
      g.beginPath()
      g.arc(half, half, mr * 5, 0, Math.PI * 2)
      g.fill()
      const disc = g.createRadialGradient(half - mr * 0.3, half - mr * 0.3, mr * 0.2, half, half, mr)
      disc.addColorStop(0, 'rgba(252, 249, 240, 0.95)')
      disc.addColorStop(1, 'rgba(220, 216, 202, 0.7)')
      g.fillStyle = disc
      g.beginPath()
      g.arc(half, half, mr, 0, Math.PI * 2)
      g.fill()
      moon = c
    }

    /** Uma espícula centrada em (x, y), girada `ang`, com `len` pra cada lado. */
    function spike(img: HTMLCanvasElement, x: number, y: number, len: number, ang: number) {
      const cos = Math.cos(ang)
      const sin = Math.sin(ang)
      ctx!.setTransform(dpr * cos, dpr * sin, -dpr * sin, dpr * cos, dpr * x, dpr * y)
      ctx!.drawImage(img, -len, -0.3, len * 2, 0.6)
    }

    function build() {
      // o céu é todo luz difusa: acima de 1.5 o celular pinta o dobro de pixel
      // sem diferença que dê pra ver
      dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      w = window.innerWidth
      h = window.innerHeight
      canvas!.width = Math.floor(w * dpr)
      canvas!.height = Math.floor(h * dpr)
      canvas!.style.width = w + 'px'
      // altura em 100lvh (viewport GRANDE): cobre a tela com ou sem a barra do
      // navegador — sem isso sobra uma faixa escura embaixo no mobile quando a
      // barra recolhe (o canvas tem tamanho próprio; `inset-0` não o estica)
      canvas!.style.height = '100lvh'
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

      buildMoon()
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

      // partículas de luz (bokeh) subindo devagar
      for (const mo of motes) {
        if (!reduced) {
          mo.y -= mo.vy * dt
          if (mo.y < -mo.r) {
            mo.y = h + mo.r
            mo.x = Math.random() * w
          }
        }
        ctx!.globalAlpha = mo.a
        ctx!.drawImage(moteSprite, mo.x - mo.r, mo.y - mo.r, mo.r * 2, mo.r * 2)
        ctx!.globalAlpha = 1
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
          const img = spikes.get(rgb)!
          ctx!.globalAlpha = a
          spike(img, x, y, len, 0)
          spike(img, x, y, len, Math.PI / 2)

          // sparkle de 8 pontas nas mais brilhantes: espículas diagonais, mais curtas
          if (s.r > 1.55) {
            const d = len * 0.42 * Math.SQRT2
            ctx!.globalAlpha = a * 0.6
            spike(img, x, y, d, Math.PI / 4)
            spike(img, x, y, d, -Math.PI / 4)
          }
          ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
          ctx!.globalAlpha = 1
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
      if (moon) {
        const half = moon.width / dpr / 2
        ctx!.drawImage(moon, moonX - half, moonY - half, half * 2, half * 2)
      }
    }

    let raf = 0
    let last = performance.now()
    function frame(now: number) {
      // tela de 120 Hz: o céu não precisa de mais que 60 quadros, e cada um a
      // mais é bateria e calor
      if (now - last < 14) {
        raf = requestAnimationFrame(frame)
        return
      }
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
      // a nebulosa sobe devagar com a rolagem, como subia dentro do canvas
      if (nebulaRef.current)
        nebulaRef.current.style.transform = `translate3d(0, ${-scrollY * 0.02}px, 0)`
    }
    function onMouse(e: MouseEvent) {
      mouse.tx = e.clientX
      mouse.ty = e.clientY
    }

    build()
    onScroll()
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

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
        {/* mais alta que a tela: sobe com a rolagem sem mostrar a borda de baixo */}
        <div
          ref={nebulaRef}
          className="absolute inset-x-0 top-0 will-change-transform"
          style={{ height: 'calc(100lvh + 200vh)', backgroundImage: NEBULA_BG }}
        />
      </div>
      <canvas ref={ref} className="pointer-events-none fixed inset-0 z-0" aria-hidden />
    </>
  )
}
