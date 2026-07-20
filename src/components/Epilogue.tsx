import { useEffect, useRef, useState, type ReactNode } from 'react'

const reducedMotion = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

/** Revela o filho quando ele entra na viewport: fade + leve subida saindo do desfoque. */
function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
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
      { threshold: 0.4, rootMargin: '0px 0px -12% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`transition-all duration-[1400ms] ease-out ${
        shown ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-6 opacity-0 blur-[4px]'
      } ${className}`}
    >
      {children}
    </div>
  )
}

/** Epílogo: a última batida, depois das fotos. O fim (só do site). */
export function Epilogue() {
  return (
    <section
      id="fim"
      className="relative flex min-h-[88svh] flex-col items-center justify-center px-6 py-32 text-center"
    >
      <Reveal>
        <span className="mb-10 block animate-breathe text-2xl text-ember/70" aria-hidden>
          ✦
        </span>
        <p
          className="mx-auto max-w-4xl font-display font-light italic leading-[1.05] text-ember text-[2.5rem] sm:text-[5.5rem]"
          style={{ textShadow: '0 0 60px rgba(230, 192, 122, 0.2)' }}
        >
          Eu te amo pra um caralho
        </p>
        <p className="label mt-14 text-mist">pra sempre — João</p>
      </Reveal>
    </section>
  )
}
