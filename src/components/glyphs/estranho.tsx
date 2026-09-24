import { useId } from 'react'

/**
 * Doutor Estranho: o portal do anel de fundar, o Olho de Agamotto aberto na
 * Joia do Tempo, e o chicote de energia mística. Tudo que é sorteado (faísca,
 * estrela, curva) é calculado uma vez só, quando o arquivo carrega.
 */

function seeded(seed: number) {
  let h = seed >>> 0 || 1
  return () => {
    h ^= h << 13
    h ^= h >>> 17
    h ^= h << 5
    return (h >>> 0) / 4294967296
  }
}

const f1 = (n: number) => n.toFixed(1)

/* ─── o portal do anel ────────────────────────────────────────────────────── */

type Spark = { d: string; c: string; w: number; o: number }

/**
 * As faíscas do portal, do jeito que o filme faz: o aro gira e cospe fagulha
 * pela tangente, como esmeril — cada fagulha é um risco curto ao longo da sua
 * trajetória, que sai quase branca colada no aro e vai ficando laranja, mais
 * fina e mais apagada conforme se afasta, caindo um tico com o peso. As
 * fagulhas saem em jorros (alguns pontos do aro cospem mais que outros).
 */
const PORTAL = (() => {
  const rnd = seeded(7)
  const R = 36
  const sparks: Spark[] = []
  const jets = Array.from({ length: 7 }, () => rnd() * Math.PI * 2)
  const warm = (t: number) =>
    t < 0.15 ? '#fff6d8' : t < 0.35 ? '#ffe08a' : t < 0.6 ? '#ffb347' : t < 0.85 ? '#ff8a1f' : '#e0561a'
  for (let i = 0; i < 1100; i++) {
    // metade sai de um jorro, metade de qualquer ponto do aro
    const a = rnd() < 0.55 ? jets[Math.floor(rnd() * jets.length)] + (rnd() - 0.5) * 0.5 : rnd() * Math.PI * 2
    const ex = 50 + R * Math.cos(a)
    const ey = 50 + R * Math.sin(a)
    // gira no sentido horário: a fagulha sai pela tangente, abrindo um tico pra fora
    const dir = a + Math.PI / 2 - 0.18 - rnd() * 0.35
    const vx = Math.cos(dir)
    const vy = Math.sin(dir)
    const reach = rnd() ** 1.45 // a maioria morre perto do aro
    const t = reach * 50
    const g = 0.012 // o peso da fagulha
    const x = ex + vx * t
    const y = ey + vy * t + g * t * t
    // o risco aponta pra onde ela está indo naquele ponto
    const tx = vx
    const ty = vy + 2 * g * t
    const n = Math.hypot(tx, ty)
    const len = (1.4 + rnd() * 3.4) * (1 - reach * 0.55)
    sparks.push({
      d: `M${f1(x)} ${f1(y)}l${f1((-tx / n) * len)} ${f1((-ty / n) * len)}`,
      c: warm(reach + rnd() * 0.12),
      w: (0.35 + rnd() * 0.55) * (1 - reach * 0.55),
      o: Math.min(1, 1 - reach * 0.55 + rnd() * 0.15),
    })
  }
  // quem fica colado no aro vai por último, por cima: é o que faz o aro "girar"
  sparks.sort((p, q) => q.w - p.w)
  const stars = Array.from({ length: 22 }, () => {
    const a = rnd() * Math.PI * 2
    const r = Math.sqrt(rnd()) * 32
    return { x: 50 + r * Math.cos(a), y: 44 + r * Math.sin(a) * 0.8, r: 0.3 + rnd() * 0.55, o: 0.4 + rnd() * 0.6 }
  })
  return { sparks, stars, R }
})()

/**
 * O portal do anel de fundar, como no filme: um aro FINO e muito claro —
 * miolo quase branco, borda amarela, brilho laranja em volta — cuspindo
 * fagulha pela tangente, e dentro o outro lugar (a noite de Kamar-Taj, com a
 * cordilheira) com a luz do aro vazando pra dentro pela beirada.
 */
export function SlingPortal({ className }: { className?: string }) {
  const id = useId()
  const R = PORTAL.R
  return (
    <svg viewBox="0 0 100 100" overflow="visible" className={className} aria-hidden>
      <defs>
        <radialGradient id={`${id}-in`} cx="50%" cy="42%" r="55%">
          <stop offset="0" stopColor="#2a3a78" />
          <stop offset=".55" stopColor="#15123e" />
          <stop offset="1" stopColor="#06051a" />
        </radialGradient>
        <linearGradient id={`${id}-mt`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#6a78b8" />
          <stop offset=".35" stopColor="#2a3068" />
          <stop offset="1" stopColor="#0c0c26" />
        </linearGradient>
        {/* a luz do aro entrando no outro lado, pela beirada */}
        <radialGradient id={`${id}-bleed`} cx="50%" cy="50%" r="50%">
          <stop offset=".6" stopColor="#ff9a2a" stopOpacity="0" />
          <stop offset=".88" stopColor="#ff9a2a" stopOpacity=".4" />
          <stop offset="1" stopColor="#ffe0a0" stopOpacity=".85" />
        </radialGradient>
        {/* o brilho de fora, que some pra longe do aro */}
        <radialGradient id={`${id}-glow`} cx="50%" cy="50%" r="50%">
          <stop offset=".6" stopColor="#ff8a1f" stopOpacity="0" />
          <stop offset=".71" stopColor="#ffa03a" stopOpacity=".55" />
          <stop offset=".8" stopColor="#ff7a1a" stopOpacity=".2" />
          <stop offset="1" stopColor="#ff7a1a" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`${id}-c`}>
          <circle cx="50" cy="50" r={R - 0.4} />
        </clipPath>
      </defs>

      <circle cx="50" cy="50" r={R * 1.42} fill={`url(#${id}-glow)`} />

      {/* o outro lado */}
      <g clipPath={`url(#${id}-c)`}>
        <circle cx="50" cy="50" r={R} fill={`url(#${id}-in)`} />
        {PORTAL.stars.map((s, i) => (
          <circle key={i} cx={f1(s.x)} cy={f1(s.y)} r={s.r} fill="#e8ecff" opacity={s.o} />
        ))}
        <path d="M10 76l12-12 6 4 10-14 8 7 7-11 9 12 6-5 10 12 8-6 8 13V100H10z" fill={`url(#${id}-mt)`} />
        <path d="M38 54l-3.5 5 3.5-1.5 2.5 2zM53 50l-3 5 3-1.2 2.4 1.8z" fill="#c9d2ff" opacity=".7" />
        <path d="M10 86c20-6 40-5 60-2s24 2 32 0V100H10z" fill="#08081c" opacity=".85" />
        <circle cx="50" cy="50" r={R} fill={`url(#${id}-bleed)`} />
      </g>

      {/* o aro: fino, com o miolo quase branco */}
      <circle cx="50" cy="50" r={R} fill="none" stroke="#ff8a1f" strokeWidth="5.5" strokeOpacity=".5" />
      <circle cx="50" cy="50" r={R} fill="none" stroke="#ffc85a" strokeWidth="2.2" strokeOpacity=".9" />
      <circle cx="50" cy="50" r={R} fill="none" stroke="#fffbe8" strokeWidth="1.1" />

      <g strokeLinecap="round">
        {PORTAL.sparks.map((s, i) => (
          <path key={i} d={s.d} stroke={s.c} strokeWidth={f1(s.w)} opacity={f1(s.o)} />
        ))}
      </g>
    </svg>
  )
}

/* ─── o olho de agamotto ──────────────────────────────────────────────────── */

/**
 * O Olho de Agamotto do filme: um medalhão de bronze envelhecido em forma de
 * olho gordo (quase oval, as pontas dos lados só sugeridas), com a moldura
 * larga gravada de volutas; no meio um aro redondo grosso que quase encosta na
 * moldura em cima e embaixo; dentro dele a esfera aberta na Joia do Tempo, e
 * por cima as faixas de prata cruzando em gaiola — as "pálpebras" em arco e as
 * duas diagonais. Os dois tubinhos de cima são onde entra o cordão.
 */
export function EyeOfAgamotto({ className }: { className?: string }) {
  const id = useId()
  const body = 'M3 38C8 17 30 5 50 5s42 12 47 33C92 59 70 71 50 71S8 59 3 38z'
  // a gaiola de prata: as pálpebras em arco, as duas curvas em V que descem do
  // alto, e as que cruzam em X embaixo — tudo curvo, como no amuleto
  const bands = [
    'M23 36C31 22 44 17 52 18S70 24 77 36',
    'M23 40C31 54 44 59 52 58S70 52 77 40',
    'M38 12c-1 9 3 20 12 26',
    'M62 12c1 9-3 20-12 26',
    'M50 38c-7 6-13 14-15 25',
    'M50 38c7 6 13 14 15 25',
    'M26 27c10 1 20 8 26 20s7 13 6 17',
    'M74 27c-10 1-20 8-26 20s-7 13-6 17',
  ]
  return (
    <svg viewBox="0 0 100 76" overflow="visible" className={className} aria-hidden>
      <defs>
        <radialGradient id={`${id}-halo`}>
          <stop offset="0" stopColor="#6dff8a" stopOpacity=".45" />
          <stop offset=".45" stopColor="#3dff6a" stopOpacity=".14" />
          <stop offset="1" stopColor="#3dff6a" stopOpacity="0" />
        </radialGradient>
        {/* bronze velho: pouca cor, luz de cima, patina escura embaixo */}
        <linearGradient id={`${id}-bronze`} x1="0" x2=".25" y1="0" y2="1">
          <stop offset="0" stopColor="#e6c77e" />
          <stop offset=".28" stopColor="#b08a44" />
          <stop offset=".62" stopColor="#6e5222" />
          <stop offset="1" stopColor="#2c1e09" />
        </linearGradient>
        <linearGradient id={`${id}-ring`} x1="0" x2=".15" y1="0" y2="1">
          <stop offset="0" stopColor="#f6e3a6" />
          <stop offset=".4" stopColor="#a8823c" />
          <stop offset=".75" stopColor="#5e4418" />
          <stop offset="1" stopColor="#8a6a30" />
        </linearGradient>
        <radialGradient id={`${id}-well`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#123a1a" />
          <stop offset=".65" stopColor="#0b1a0c" />
          <stop offset="1" stopColor="#140e05" />
        </radialGradient>
        <radialGradient id={`${id}-gem`} cx="42%" cy="38%" r="62%">
          <stop offset="0" stopColor="#f1ffd0" />
          <stop offset=".3" stopColor="#7dff8e" />
          <stop offset=".75" stopColor="#1fc24a" />
          <stop offset="1" stopColor="#0a6a24" />
        </radialGradient>
        <linearGradient id={`${id}-silver`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#f6f2e4" />
          <stop offset=".5" stopColor="#bdb6a0" />
          <stop offset="1" stopColor="#7a735f" />
        </linearGradient>
        <clipPath id={`${id}-well-c`}>
          <circle cx="50" cy="38" r="26" />
        </clipPath>
      </defs>

      {/* o verde vazando em volta */}
      <ellipse cx="50" cy="38" rx="50" ry="42" fill={`url(#${id}-halo)`} />

      {/* os tubinhos do cordão, em cima */}
      <g stroke="#221606" strokeWidth=".6">
        <path d="M30 11l-7-11 4-2 7 11z" fill={`url(#${id}-bronze)`} />
        <path d="M70 11l7-11-4-2-7 11z" fill={`url(#${id}-bronze)`} />
      </g>
      <path d="M23 0l-4-6M77 0l4-6" stroke="#5a2a2a" strokeWidth="1.6" strokeLinecap="round" />

      {/* as pontas dos lados */}
      <path d="M-1 38l6-4.5v9zM101 38l-6-4.5v9z" fill={`url(#${id}-bronze)`} stroke="#221606" strokeWidth=".5" />

      {/* a moldura: as "asas" dos lados, gravadas de voluta */}
      <path d={body} fill={`url(#${id}-bronze)`} stroke="#221606" strokeWidth="1" />
      <g fill="none" strokeLinecap="round">
        <g stroke="#221606" strokeOpacity=".7" strokeWidth=".9">
          <path d="M7 33c2-5 7-6 8.5-3s-2.5 4.5-3.8 2.2M7 43c2 5 7 6 8.5 3s-2.5-4.5-3.8-2.2" />
          <path d="M93 33c-2-5-7-6-8.5-3s2.5 4.5 3.8 2.2M93 43c-2 5-7 6-8.5 3s2.5-4.5 3.8-2.2" />
          <path d="M13 24c3-5 8-6 9-3s-3 4-4 2M13 52c3 5 8 6 9 3s-3-4-4-2" />
          <path d="M87 24c-3-5-8-6-9-3s3 4 4 2M87 52c-3 5-8 6-9 3s3-4 4-2" />
          <path d="M9 38h7M84 38h7" />
          <path d="M18 38c0-4 2-7 4-9M18 38c0 4 2 7 4 9M82 38c0-4-2-7-4-9M82 38c0 4-2 7-4 9" />
        </g>
        {/* fio de luz nas volutas e na beirada de cima */}
        <g stroke="#fff0c0" strokeOpacity=".35" strokeWidth=".5">
          <path d="M7.4 32.4c2-4.6 6.4-5.4 7.8-2.6M13.4 23.4c2.8-4.6 7.4-5.4 8.4-2.6" />
          <path d="M92.6 32.4c-2-4.6-6.4-5.4-7.8-2.6M86.6 23.4c-2.8-4.6-7.4-5.4-8.4-2.6" />
        </g>
        <path d="M10 26C18 12 34 6.5 50 6.5S82 12 90 26" stroke="#fff3c8" strokeOpacity=".5" strokeWidth=".8" />
      </g>

      {/* o poço do meio e a joia do tempo aberta */}
      <g clipPath={`url(#${id}-well-c)`}>
        <circle cx="50" cy="38" r="26" fill={`url(#${id}-well)`} />
        <path d="M30 38c3.5-3.6 6.5-4.6 9-4.6-1.6 2.6-1.6 6.6 0 9.2-2.5 0-5.5-1-9-4.6zM70 38c-3.5-3.6-6.5-4.6-9-4.6 1.6 2.6 1.6 6.6 0 9.2 2.5 0 5.5-1 9-4.6z" fill="#5dff7a" opacity=".8" />
        <circle cx="50" cy="38" r="14.5" fill="#0a3a14" />
        <circle cx="50" cy="38" r="12.8" fill={`url(#${id}-gem)`} />
        <path d="M44 38a6 6 0 0 1 12 0M42 38a8 8 0 0 0 16 0" stroke="#eaffd8" strokeOpacity=".35" strokeWidth=".6" fill="none" />
        <ellipse cx="45.5" cy="32.5" rx="3.8" ry="2.2" fill="#fff" opacity=".7" transform="rotate(-25 45.5 32.5)" />
      </g>

      {/* a gaiola de prata por cima da joia: sombra, metal e o fio de luz */}
      <g clipPath={`url(#${id}-well-c)`} fill="none" strokeLinecap="round">
        <g stroke="#120c04" strokeWidth="2.8" strokeOpacity=".85">
          {bands.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
        <g stroke={`url(#${id}-silver)`} strokeWidth="1.6">
          {bands.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
        <g stroke="#fffdf4" strokeWidth=".45" strokeOpacity=".7" transform="translate(-.35 -.35)">
          {bands.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
      </g>

      {/* o aro redondo grosso, quase encostando na moldura, com o filete de dentro */}
      <circle cx="50" cy="38" r="28" fill="none" stroke="#1a1105" strokeWidth="5.2" />
      <circle cx="50" cy="38" r="28" fill="none" stroke={`url(#${id}-ring)`} strokeWidth="3.8" />
      <circle cx="50" cy="38" r="25.3" fill="none" stroke="#c9a352" strokeOpacity=".6" strokeWidth=".7" />
      <path d="M29 24.5a25 25 0 0 1 42 0" stroke="#fff6dc" strokeOpacity=".7" strokeWidth=".9" fill="none" strokeLinecap="round" />
    </svg>
  )
}

/* ─── o chicote de energia ────────────────────────────────────────────────── */

/**
 * O chicote místico: uma fita de energia fazendo voltinhas em S (uma trocoide,
 * que é o que dá o laço), afinando nas pontas, desenhada em três passadas —
 * halo largo, meio, e o miolo claro — com faíscas e runinhas ao longo.
 */
const WHIP = (() => {
  const rnd = seeded(23)
  const pts: [number, number][] = []
  const N = 220
  for (let k = 0; k <= N; k++) {
    const u = k / N
    const env = Math.sin(Math.PI * u) // afina nas pontas
    const x = 14 + 172 * u - 20 * Math.sin(6 * Math.PI * u) * env
    const y = 30 + 6 * Math.sin(2 * Math.PI * u) - 15 * Math.cos(6 * Math.PI * u) * env
    pts.push([x, y])
  }
  const d = 'M' + pts.map(([x, y]) => `${f1(x)} ${f1(y)}`).join('L')
  const sparks = Array.from({ length: 34 }, () => {
    const [x, y] = pts[Math.floor(rnd() * N)]
    return { x: x + (rnd() - 0.5) * 10, y: y + (rnd() - 0.5) * 10, r: 0.4 + rnd() * 0.9, o: 0.4 + rnd() * 0.6 }
  })
  // runinhas: um tracinho em cruz ou um anelzinho, ao longo da fita
  const runes = Array.from({ length: 9 }, (_, i) => {
    const [x, y] = pts[Math.floor(((i + 0.5) / 9) * N)]
    const s = 1.6 + rnd() * 1
    return rnd() < 0.5
      ? `M${f1(x - s)} ${f1(y - s - 4)}l${f1(2 * s)} ${f1(2 * s)}M${f1(x + s)} ${f1(y - s - 4)}l${f1(-2 * s)} ${f1(2 * s)}`
      : `M${f1(x)} ${f1(y + 4)}m-${f1(s)} 0a${f1(s)} ${f1(s)} 0 1 0 ${f1(2 * s)} 0a${f1(s)} ${f1(s)} 0 1 0 -${f1(2 * s)} 0`
  })
  return { d, sparks, runes }
})()

export function EldritchWhip({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 60" overflow="visible" className={className} aria-hidden>
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d={WHIP.d} stroke="currentColor" strokeWidth="12" strokeOpacity=".16" />
        <path d={WHIP.d} stroke="currentColor" strokeWidth="6" strokeOpacity=".35" />
        <path d={WHIP.d} stroke="#ffb347" strokeWidth="3" strokeOpacity=".8" />
        <path d={WHIP.d} stroke="#fff4d6" strokeWidth="1.3" />
        {WHIP.runes.map((r) => (
          <path key={r} d={r} stroke="currentColor" strokeWidth=".7" strokeOpacity=".8" />
        ))}
      </g>
      {WHIP.sparks.map((s, i) => (
        <circle key={i} cx={f1(s.x)} cy={f1(s.y)} r={s.r} fill="#ffd27a" opacity={s.o} />
      ))}
    </svg>
  )
}
