import { useCallback, useEffect, useRef, useState } from 'react'
import { AUDIO_DUCK_EVENT } from './AmbientAudio'

/** Distância mínima (px) de um arrastar pra contar como troca de mídia. */
const SWIPE_THRESHOLD = 45

type Media = { src: string; type: 'photo' | 'video'; poster: number }

/**
 * Carrega automaticamente fotos E vídeos de src/fotos (ordem alfabética do nome).
 * Pra escolher o frame de capa de um vídeo, ponha o tempo (em segundos) no fim do
 * nome com "@": ex. "praia@3.5.mp4" mostra o frame de 3,5s. Sem "@", usa ~0,1s.
 */
const photoModules = import.meta.glob('../fotos/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}', {
  eager: true,
  import: 'default',
})
const videoModules = import.meta.glob('../fotos/*.{mp4,webm,mov,m4v,MP4,WEBM,MOV,M4V}', {
  eager: true,
  import: 'default',
})

/** Tempo (s) do frame de capa, lido do sufixo "@N" no nome do arquivo. */
const posterOf = (key: string) => {
  const m = key.match(/@(\d+(?:\.\d+)?)(?=\.[^.]+$)/)
  return m ? parseFloat(m[1]) : 0.1
}

const MEDIA: Media[] = [
  ...Object.entries(photoModules).map(([key, v]) => ({
    key,
    src: v as string,
    type: 'photo' as const,
    poster: 0,
  })),
  ...Object.entries(videoModules).map(([key, v]) => ({
    key,
    src: v as string,
    type: 'video' as const,
    poster: posterOf(key),
  })),
]
  .sort((a, b) => a.key.localeCompare(b.key))
  .map(({ src, type, poster }) => ({ src, type, poster }))

/** Inclinação/flutuação determinística por índice (mesmo mural todo carregamento). */
const tiltOf = (k: number) => ((k * 53) % 9) - 4 // -4..4 graus
const durOf = (k: number) => 6 + (k % 5) // 6..10s
const delayOf = (k: number) => -((k % 7) * 0.9) // desencontra as fotos
const tapeOf = (k: number) => ((k * 31) % 15) - 7 // rotação da fita

const reducedMotion = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

/** Tela estreita (mobile) — sem flutuação perpétua pra não travar o scroll. */
const isNarrow = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(max-width: 640px)').matches

/** Selo de "play" sobre a capa de um vídeo. */
function PlayBadge() {
  return (
    <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-night-deep/45 backdrop-blur-[2px] transition-transform duration-300 ease-out group-hover:scale-110">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 text-star/90" aria-hidden>
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
    </span>
  )
}

/** Uma mídia polaroid: revela ao entrar na tela, flutua, e estala no hover. */
function MediaCard({ item, k, onOpen }: { item: Media; k: number; onOpen: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(() => reducedMotion())

  useEffect(() => {
    if (reducedMotion()) return
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const isVideo = item.type === 'video'

  return (
    <div
      ref={ref}
      className={`mb-5 break-inside-avoid transition-all duration-[900ms] ease-out ${
        shown ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-10 opacity-0 blur-[2px]'
      }`}
      style={{ transitionDelay: `${(k % 6) * 90}ms` }}
    >
      {/* camada da flutuação (desligada no mobile pra não travar o scroll) */}
      <div
        style={
          reducedMotion() || isNarrow()
            ? undefined
            : { animation: `float-y ${durOf(k)}s ease-in-out ${delayOf(k)}s infinite` }
        }
      >
        <button
          onClick={onOpen}
          aria-label={isVideo ? `Abrir vídeo ${k + 1}` : `Ampliar foto ${k + 1}`}
          className="group relative block w-full rounded-[3px] bg-[#f4efe3] p-2.5 pb-7 shadow-[0_14px_40px_-16px_rgba(0,0,0,0.85)] outline-none transition-all duration-300 ease-out [transform:rotate(var(--r))] hover:z-10 hover:shadow-[0_28px_70px_-18px_rgba(0,0,0,0.9)] hover:[transform:rotate(0deg)_scale(1.05)] focus-visible:[transform:rotate(0deg)_scale(1.05)]"
          style={{ ['--r' as string]: `${tiltOf(k)}deg` }}
        >
          {/* fita adesiva no topo */}
          <span
            aria-hidden
            className="absolute -top-2 left-1/2 h-5 w-14 -translate-x-1/2 rounded-[1px] bg-star/15 shadow-sm ring-1 ring-white/10 backdrop-blur-[1px]"
            style={{ transform: `translateX(-50%) rotate(${tapeOf(k)}deg)` }}
          />
          <span className="relative block overflow-hidden rounded-[2px]">
            {isVideo ? (
              <video
                src={`${item.src}#t=${item.poster}`}
                muted
                playsInline
                preload="metadata"
                draggable={false}
                className="w-full object-cover brightness-[0.92] saturate-[0.9] transition-all duration-500 ease-out group-hover:scale-[1.06] group-hover:brightness-105 group-hover:saturate-100"
              />
            ) : (
              <img
                src={item.src}
                alt={`Nós dois, foto ${k + 1}`}
                loading="lazy"
                draggable={false}
                className="w-full object-cover brightness-[0.92] saturate-[0.9] transition-all duration-500 ease-out group-hover:scale-[1.06] group-hover:brightness-105 group-hover:saturate-100"
              />
            )}
            {isVideo && <PlayBadge />}
            {/* brilho quente + reflexo diagonal no hover */}
            <span className="pointer-events-none absolute inset-0 bg-ember/0 transition-colors duration-300 group-hover:bg-ember/10" />
            <span className="pointer-events-none absolute -inset-y-2 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:left-[120%] group-hover:opacity-100" />
          </span>
        </button>
      </div>
    </div>
  )
}

/** Vídeo em destaque: toca sozinho, em loop, sem controles nem pause. */
function LightboxVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    // a abertura veio de um clique → o play com som é permitido
    ref.current?.play().catch(() => {})
  }, [src])
  return (
    <video
      ref={ref}
      src={src}
      autoPlay
      loop
      playsInline
      className="block max-h-[76vh] max-w-[86vw] object-contain"
      draggable={false}
    />
  )
}

/** Mural flutuante das nossas fotos e vídeos, com abertura em tela cheia ao clicar. */
export function PhotoCarousel() {
  const n = MEDIA.length
  const [sel, setSel] = useState<number | null>(null)
  const open = sel !== null

  const go = useCallback(
    (dir: number) => setSel((s) => (s === null ? s : (s + dir + n) % n)),
    [n],
  )

  // arrastar pra os lados troca de mídia (mobile): guarda o toque inicial e mede o delta
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0]
    touchStart.current = { x: t.clientX, y: t.clientY }
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current
    touchStart.current = null
    if (!start) return
    const t = e.changedTouches[0]
    const dx = t.clientX - start.x
    const dy = t.clientY - start.y
    // só conta como swipe se for horizontal o suficiente (não confunde com scroll/tap)
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1)
  }

  // trava scroll do fundo + teclado (Esc fecha, setas navegam) com o lightbox aberto
  useEffect(() => {
    if (!open) return
    const body = document.body
    const prevOverflow = body.style.overflow
    body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSel(null)
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'ArrowRight') go(1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, go])

  // abaixa a música só enquanto um VÍDEO está em destaque; restaura ao fechar
  // ou ao trocar pra uma foto
  useEffect(() => {
    const duck = open && sel !== null && MEDIA[sel]?.type === 'video'
    window.dispatchEvent(new CustomEvent(AUDIO_DUCK_EVENT, { detail: { active: duck } }))
    return () => {
      window.dispatchEvent(new CustomEvent(AUDIO_DUCK_EVENT, { detail: { active: false } }))
    }
  }, [open, sel])

  const current = sel !== null ? MEDIA[sel] : null

  return (
    <section id="album" className="relative mx-auto max-w-6xl px-6 py-28 text-center sm:py-36">
      <p className="label text-mist">o nosso álbum</p>
      <h2 className="mt-4 font-display text-3xl font-light italic text-star sm:text-5xl">
        a gente, em fotos
      </h2>

      {n === 0 ? (
        <p className="mt-12 text-sm leading-relaxed text-mist">
          (as fotos e vídeos aparecem aqui automaticamente assim que forem colocados na pasta{' '}
          <span className="font-mono text-star/70">src/fotos/</span>)
        </p>
      ) : (
        <div className="mt-14 gap-5 [column-fill:_balance] columns-2 sm:columns-3 lg:columns-4">
          {MEDIA.map((item, k) => (
            <MediaCard key={item.src} item={item} k={k} onOpen={() => setSel(k)} />
          ))}
        </div>
      )}

      <p className="mt-12 text-xs text-mist/70">toque pra ver de perto</p>

      {/* lightbox / tela cheia */}
      {open && sel !== null && current && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-night-deep/95 px-4 sm:backdrop-blur-sm"
          onClick={() => setSel(null)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={() => setSel(null)}
            aria-label="Fechar"
            className="label absolute right-5 top-5 z-10 text-mist transition-colors hover:text-star"
          >
            fechar
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              go(-1)
            }}
            aria-label="Anterior"
            className="absolute left-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-ember/25 bg-night-soft/60 text-star/80 backdrop-blur-sm transition-colors hover:border-ember/50 hover:text-star sm:left-8"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* moldura polaroid: papel creme, base pra legenda, sombra de cinema */}
          <div
            key={sel}
            onClick={(e) => e.stopPropagation()}
            className="relative animate-title-in rounded-[4px] bg-[#f4efe3] p-3 pb-11 shadow-[0_40px_130px_-30px_rgba(0,0,0,0.95)] sm:p-4 sm:pb-14"
          >
            {/* textura de papel + calço interno */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-[4px] bg-gradient-to-br from-white/40 via-transparent to-black/[0.06]"
            />
            <span className="relative block overflow-hidden rounded-[2px] ring-1 ring-black/10">
              {current.type === 'video' ? (
                <LightboxVideo src={current.src} />
              ) : (
                <img
                  src={current.src}
                  alt={`Nós dois, foto ${sel + 1}`}
                  className="block max-h-[76vh] max-w-[86vw] object-contain"
                  draggable={false}
                />
              )}
              {/* vinheta suave nas bordas */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 shadow-[inset_0_0_60px_-20px_rgba(0,0,0,0.5)]"
              />
            </span>
            <p className="absolute inset-x-0 bottom-3 text-center font-mono text-[0.7rem] uppercase tracking-label text-[#8a7256] sm:bottom-4">
              {(sel + 1).toString().padStart(2, '0')} / {n.toString().padStart(2, '0')}
            </p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation()
              go(1)
            }}
            aria-label="Próxima"
            className="absolute right-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-ember/25 bg-night-soft/60 text-star/80 backdrop-blur-sm transition-colors hover:border-ember/50 hover:text-star sm:right-8"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
    </section>
  )
}
