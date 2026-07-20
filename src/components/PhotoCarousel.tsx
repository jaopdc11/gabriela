import { useEffect, useRef, useState } from 'react'

/** Carrega automaticamente todas as fotos de src/fotos (ordem alfabética do nome). */
const modules = import.meta.glob('../fotos/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}', {
  eager: true,
  import: 'default',
})
const PHOTOS = Object.keys(modules)
  .sort()
  .map((k) => modules[k] as string)

/** Inclinação/flutuação determinística por índice (mesmo mural todo carregamento). */
const tiltOf = (k: number) => ((k * 53) % 9) - 4 // -4..4 graus
const durOf = (k: number) => 6 + (k % 5) // 6..10s
const delayOf = (k: number) => -((k % 7) * 0.9) // desencontra as fotos
const tapeOf = (k: number) => ((k * 31) % 15) - 7 // rotação da fita

const reducedMotion = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

/** Uma foto polaroid: revela ao entrar na tela, flutua, e estala em cor no hover. */
function PhotoCard({ src, k, onOpen }: { src: string; k: number; onOpen: () => void }) {
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

  return (
    <div
      ref={ref}
      className={`mb-5 break-inside-avoid transition-all duration-[900ms] ease-out ${
        shown ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-10 opacity-0 blur-[2px]'
      }`}
      style={{ transitionDelay: `${(k % 6) * 90}ms` }}
    >
      {/* camada da flutuação */}
      <div style={{ animation: `float-y ${durOf(k)}s ease-in-out ${delayOf(k)}s infinite` }}>
        <button
          onClick={onOpen}
          aria-label={`Ampliar foto ${k + 1}`}
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
            <img
              src={src}
              alt={`Nós dois, foto ${k + 1}`}
              loading="lazy"
              draggable={false}
              className="w-full object-cover brightness-[0.92] saturate-[0.9] transition-all duration-500 ease-out group-hover:scale-[1.06] group-hover:brightness-105 group-hover:saturate-100"
            />
            {/* brilho quente + reflexo diagonal no hover */}
            <span className="pointer-events-none absolute inset-0 bg-ember/0 transition-colors duration-300 group-hover:bg-ember/10" />
            <span className="pointer-events-none absolute -inset-y-2 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:left-[120%] group-hover:opacity-100" />
          </span>
        </button>
      </div>
    </div>
  )
}

/** Mural flutuante das nossas fotos, com abertura em tela cheia ao clicar. */
export function PhotoCarousel() {
  const n = PHOTOS.length
  const [sel, setSel] = useState<number | null>(null)
  const open = sel !== null

  // trava scroll do fundo + teclado (Esc fecha, setas navegam) com o lightbox aberto
  useEffect(() => {
    if (!open) return
    const body = document.body
    const prevOverflow = body.style.overflow
    body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSel(null)
      if (e.key === 'ArrowLeft') setSel((s) => (s === null ? s : (s - 1 + n) % n))
      if (e.key === 'ArrowRight') setSel((s) => (s === null ? s : (s + 1) % n))
    }
    window.addEventListener('keydown', onKey)
    return () => {
      body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, n])

  return (
    <section id="album" className="relative mx-auto max-w-6xl px-6 py-28 text-center sm:py-36">
      <p className="label text-mist">o nosso álbum</p>
      <h2 className="mt-4 font-display text-3xl font-light italic text-star sm:text-5xl">
        a gente, em fotos
      </h2>

      {n === 0 ? (
        <p className="mt-12 text-sm leading-relaxed text-mist">
          (as fotos aparecem aqui automaticamente assim que forem colocadas na pasta{' '}
          <span className="font-mono text-star/70">src/fotos/</span>)
        </p>
      ) : (
        <div className="mt-14 gap-5 [column-fill:_balance] columns-2 sm:columns-3 lg:columns-4">
          {PHOTOS.map((src, k) => (
            <PhotoCard key={src} src={src} k={k} onOpen={() => setSel(k)} />
          ))}
        </div>
      )}

      <p className="mt-12 text-xs text-mist/70">toque numa foto pra ver de perto</p>

      {/* lightbox / tela cheia */}
      {open && sel !== null && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-night-deep/92 px-4 backdrop-blur-sm"
          onClick={() => setSel(null)}
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
              setSel((s) => (s === null ? s : (s - 1 + n) % n))
            }}
            aria-label="Foto anterior"
            className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-ember/25 bg-night-soft/60 text-star/80 backdrop-blur-sm transition-colors hover:border-ember/50 hover:text-star sm:left-8"
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
              <img
                src={PHOTOS[sel]}
                alt={`Nós dois, foto ${sel + 1}`}
                className="block max-h-[76vh] max-w-[86vw] object-contain"
                draggable={false}
              />
              {/* vinheta suave nas bordas da foto */}
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
              setSel((s) => (s === null ? s : (s + 1) % n))
            }}
            aria-label="Próxima foto"
            className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-ember/25 bg-night-soft/60 text-star/80 backdrop-blur-sm transition-colors hover:border-ember/50 hover:text-star sm:right-8"
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
