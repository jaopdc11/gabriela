import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { seen, slugify, toWatch, watching, type Watch } from '../watchlist'
import { AUDIO_DUCK_EVENT } from './AmbientAudio'
import { AmbienceLayer, hasAmbience } from './Ambience'

/**
 * Os cartazes moram em `src/cartazes/`, e cada um se liga ao seu filme pelo
 * nome do arquivo: 'interestelar.jpg' acha 'Interestelar' sozinho. É o mesmo
 * espírito do álbum — jogar o arquivo na pasta e o site se vira.
 */
const posterModules = import.meta.glob(
  '../cartazes/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}',
  { eager: true, import: 'default' },
)

/** Mapa slug → imagem, montado uma vez: 'cidade-de-deus' → /assets/...jpg */
const POSTERS: Record<string, string> = Object.fromEntries(
  Object.entries(posterModules).map(([key, src]) => {
    const file = key.slice(key.lastIndexOf('/') + 1)
    return [slugify(file.replace(/\.[^.]+$/, '')), src as string]
  }),
)

/** O cartaz de um título: o arquivo apontado à mão, senão o do próprio nome. */
const posterOf = (w: Watch) =>
  (w.poster && POSTERS[slugify(w.poster.replace(/\.[^.]+$/, ''))]) || POSTERS[slugify(w.title)]

/**
 * Em que pé está o título: já vimos inteiro, estamos no meio, ou ainda espera.
 * Só o que espera fica apagado na parede — o que a gente já começou já é nosso.
 */
type Status = 'seen' | 'watching' | 'toWatch'

type Item = Watch & { status: Status; poster?: string }

const STATUS_LABEL: Record<Status, string> = {
  seen: 'já vimos',
  watching: 'no meio',
  toWatch: 'ainda vamos ver',
}

/**
 * Cartaz de letra: o que aparece enquanto a imagem não chegou. Não é um buraco
 * esperando — é o título impresso na moldura, e a lista fica inteira do mesmo
 * jeito com ou sem imagem.
 */
function TypePoster({ item }: { item: Item }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-b from-night-soft to-night-deep px-3 text-center">
      <span aria-hidden className="text-ember/50">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3l2.4 5.6 6 .5-4.6 4 1.4 5.9L12 15.9 6.8 19l1.4-5.9-4.6-4 6-.5L12 3z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="font-display text-base font-light italic leading-tight text-star/90 sm:text-lg">
        {item.title}
      </span>
      <span className="label text-[0.5rem] text-mist/60">{item.kind}</span>
    </div>
  )
}

/** Um cartaz na grade. O que falta ver fica apagado, e acende no toque. */
function PosterCard({ item, onOpen }: { item: Item; onOpen: () => void }) {
  const waiting = item.status === 'toWatch'
  return (
    // self-start: a fileira estica até o cartão mais alto (título de duas
    // linhas), e botão centraliza o conteúdo na vertical — os de título curto
    // desciam e o de título comprido parecia maior que os vizinhos
    <button
      onClick={onOpen}
      className="group self-start text-left focus-visible:outline-none"
      aria-label={`${item.title} — ${item.kind}, ${STATUS_LABEL[item.status]}`}
    >
      <div
        className={`relative aspect-[2/3] overflow-hidden rounded-md border border-white/10 shadow-[0_16px_40px_-20px_rgba(0,0,0,0.95)] transition-all duration-500 ease-out group-hover:-translate-y-1.5 group-hover:border-ember/40 group-hover:shadow-[0_22px_50px_-18px_rgba(230,192,122,0.25)] group-focus-visible:border-ember/60 ${waiting
            ? 'opacity-45 grayscale group-hover:opacity-100 group-hover:grayscale-0 group-focus-visible:opacity-100 group-focus-visible:grayscale-0'
            : ''
          }`}
      >
        {item.poster ? (
          <img
            src={item.poster}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <TypePoster item={item} />
        )}

        {/* série ganha um selo, pra bater o olho e saber o que é */}
        {item.kind === 'serie' && (
          <span className="label absolute left-2 top-2 rounded-full bg-night-deep/80 px-2 py-0.5 text-[0.5rem] text-mist backdrop-blur-sm">
            série
          </span>
        )}

        {/* o que ainda não vimos carrega a marca de que está esperando; o que
            está no meio mostra onde a gente parou */}
        {(waiting || item.status === 'watching') && (
          <span className="label absolute bottom-2 right-2 rounded-full bg-night-deep/80 px-2 py-0.5 text-[0.5rem] text-ember/70 backdrop-blur-sm">
            {waiting ? 'a ver' : (item.progress ?? 'no meio')}
          </span>
        )}
      </div>

      <p className="mt-2.5 font-display text-sm font-light italic leading-tight text-star/85 transition-colors group-hover:text-star sm:text-base">
        {item.title}
      </p>
      {item.year && <p className="label mt-1 text-[0.5rem] text-mist/50">{item.year}</p>}
    </button>
  )
}

/** Uma prateleira do cinema: o título, quantos são, e a grade de cartazes. */
function Shelf({
  label,
  hint,
  items,
  onOpen,
}: {
  label: string
  hint?: string
  items: Item[]
  onOpen: (i: Item) => void
}) {
  if (items.length === 0) return null
  return (
    <section className="mt-14 w-full max-w-6xl">
      <div className="flex items-baseline justify-center gap-3">
        <h2 className="label text-ember/90">{label}</h2>
        <span className="timecode text-sm text-mist/60">{items.length}</span>
      </div>
      {hint && <p className="mt-2 text-center text-xs text-mist/60">{hint}</p>}

      <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {items.map((item) => (
          <PosterCard key={`${item.title}-${item.year ?? ''}`} item={item} onOpen={() => onOpen(item)} />
        ))}
      </div>
    </section>
  )
}

/** 130 → "2h10"; 73 → "1h13"; 42 → "42min". */
const fmtRuntime = (min: number) =>
  min >= 60 ? `${Math.floor(min / 60)}h${String(min % 60).padStart(2, '0')}` : `${min}min`

/** A ficha: quem fez, quanto dura, de que gênero é. Só o que existir. */
function Ficha({ item }: { item: Item }) {
  const bits: string[] = []
  if (item.by) bits.push(item.by)
  if (item.runtime) bits.push(item.kind === 'serie' ? `${item.runtime}min por ep` : fmtRuntime(item.runtime))
  if (item.seasons) {
    bits.push(
      `${item.seasons} temporadas${item.episodes ? `, ${item.episodes} episódios` : ''}`,
    )
  }
  if (item.genre) bits.push(item.genre)
  if (bits.length === 0) return null
  return (
    <p className="mt-4 font-mono text-[0.7rem] leading-relaxed text-mist">
      {bits.map((b, i) => (
        <span key={b}>
          {i > 0 && <span className="mx-2 text-mist/40">·</span>}
          {b}
        </span>
      ))}
    </p>
  )
}

/**
 * A música tema tocando enquanto ela lê o cartaz. É o trecho de 30s que a
 * Apple publica, em loop, com a trilha do site abaixada por baixo (o mesmo
 * duck que o álbum usa nos vídeos). Se o navegador barrar o autoplay, o botão
 * fica lá esperando o toque — nunca fica mudo sem explicação.
 */
function ThemePlayer({ theme }: { theme: NonNullable<Watch['theme']> }) {
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const audio = new Audio(theme.preview)
    audio.loop = true
    audio.volume = 0
    audioRef.current = audio

    // sobe o volume devagar: entrar num corte seco assusta
    let raf = 0
    const fadeTo = (target: number, done?: () => void) => {
      cancelAnimationFrame(raf)
      const step = () => {
        const diff = target - audio.volume
        if (Math.abs(diff) < 0.02) {
          audio.volume = target
          done?.()
          return
        }
        audio.volume = Math.min(1, Math.max(0, audio.volume + diff * 0.08))
        raf = requestAnimationFrame(step)
      }
      step()
    }

    const duck = (active: boolean) =>
      window.dispatchEvent(new CustomEvent(AUDIO_DUCK_EVENT, { detail: { active } }))

    audio
      .play()
      .then(() => {
        setPlaying(true)
        duck(true)
        fadeTo(0.5)
      })
      .catch(() => setPlaying(false))

    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)

    return () => {
      cancelAnimationFrame(raf)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.pause()
      audio.src = ''
      duck(false)
    }
  }, [theme.preview])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      audio.volume = 0.5
      audio.play().catch(() => { })
      window.dispatchEvent(new CustomEvent(AUDIO_DUCK_EVENT, { detail: { active: true } }))
    } else {
      audio.pause()
      window.dispatchEvent(new CustomEvent(AUDIO_DUCK_EVENT, { detail: { active: false } }))
    }
  }

  return (
    <button
      onClick={toggle}
      className="group mt-7 flex w-full items-center gap-3 rounded-lg border border-ember/20 bg-night-soft/40 px-4 py-3 text-left transition-colors hover:border-ember/45 hover:bg-ember/5"
      aria-label={`${playing ? 'Pausar' : 'Tocar'} ${theme.track}, de ${theme.artist}`}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ember/30 text-ember">
        {playing ? (
          <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
            <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
            <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
            <path d="M8 5l11 7-11 7V5z" fill="currentColor" />
          </svg>
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="label block text-[0.55rem] text-mist/70">
          {playing ? 'tocando · o tema' : 'o tema desse'}
        </span>
        <span className="mt-0.5 block truncate font-display text-base font-light italic text-star/90">
          {theme.track}
        </span>
        <span className="block truncate text-xs text-mist">{theme.artist}</span>
      </span>
      {/* barrinhas de equalizador, só enquanto toca */}
      {playing && (
        <span aria-hidden className="flex shrink-0 items-end gap-[3px] pr-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-[3px] rounded-full bg-ember/70"
              style={{
                height: 14,
                animation: `eq 1.1s ease-in-out ${i * 0.18}s infinite`,
                transformOrigin: 'bottom',
              }}
            />
          ))}
        </span>
      )}
    </button>
  )
}

/** O cartaz aberto em tela cheia, com o que ficou daquele filme pra gente. */
function Sheet({ item, onClose }: { item: Item; onClose: () => void }) {
  const ambient = hasAmbience(item.title, item.status === 'toWatch')
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      onClick={onClose}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-night-deep/95 px-5 py-10 sm:backdrop-blur-sm"
    >
      <AmbienceLayer title={item.title} off={item.status === 'toWatch'} />
      <div
        onClick={(e) => e.stopPropagation()}
        className={`lb-in no-scrollbar relative flex max-h-full w-full max-w-3xl flex-col items-center gap-7 overflow-y-auto sm:flex-row sm:items-start sm:gap-10 ${
          // com clima atrás, a ficha ganha um véu escuro que se desfaz num halo:
          // a aurora e o holofote clareiam a tela e o texto sumia no meio deles
          ambient ? 'rounded-2xl bg-night-deep/75 p-5 shadow-[0_0_90px_50px_rgba(4,5,11,0.7)] sm:p-8' : ''
        }`}
      >
        <div className="w-40 shrink-0 overflow-hidden rounded-md border border-white/10 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.9)] sm:w-56">
          <div className="aspect-[2/3]">
            {item.poster ? (
              <img src={item.poster} alt="" className="h-full w-full object-cover" />
            ) : (
              <TypePoster item={item} />
            )}
          </div>
        </div>

        {/* min-w-0: sem ele, o título comprido da música (que não quebra linha)
            empurrava a coluna pra fora da ficha e cortava o texto na direita */}
        <div className="min-w-0 flex-1 text-center sm:pt-4 sm:text-left">
          <p className="label text-ember/90">
            {item.kind}
            {item.year && (
              <>
                <span className="mx-2 text-mist">·</span>
                {item.year}
              </>
            )}
            <span className="mx-2 text-mist">·</span>
            {item.status === 'watching' && item.progress
              ? item.progress
              : STATUS_LABEL[item.status]}
          </p>

          <h3 className="mt-3 font-display text-2xl font-light italic text-star sm:text-4xl">
            {item.title}
          </h3>

          <Ficha item={item} />

          {item.synopsis && (
            <p className="mt-5 text-sm leading-relaxed text-star/70 sm:text-[0.95rem]">
              {item.synopsis}
            </p>
          )}

          {/* a minha voz vem depois da sinopse, separada por um fio */}
          {item.note && (
            <p className="mt-5 whitespace-pre-line border-t border-white/10 pt-5 text-sm leading-relaxed text-star/80 sm:text-base">
              {item.note}
            </p>
          )}

          {item.theme && <ThemePlayer theme={item.theme} />}

          <button
            onClick={onClose}
            className="label mt-8 rounded-full border border-ember/40 px-5 py-2 text-ember transition-all duration-300 hover:border-ember/70 hover:bg-ember/10 hover:text-star"
          >
            fechar
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * O nosso cinema: uma parede de cartazes com o que a gente já viu junto e o que
 * ficou combinado. Sem data nenhuma, de propósito — ver filme com ela não é
 * efeméride, é hábito.
 */
export function Cinema({ onBack }: { onBack?: () => void }) {
  const shelves = useMemo(() => {
    const dress = (list: Watch[], status: Status): Item[] =>
      list.map((w) => ({ ...w, status, poster: posterOf(w) }))
    return {
      watched: dress(seen, 'seen'),
      midway: dress(watching, 'watching'),
      pending: dress(toWatch, 'toWatch'),
    }
  }, [])
  const { watched, midway, pending } = shelves

  const [open, setOpen] = useState<Item | null>(null)
  const close = useCallback(() => setOpen(null), [])

  const empty = watched.length + midway.length + pending.length === 0

  return (
    <section className="relative flex min-h-[100svh] flex-col items-center px-4 py-20">
      <p className="label animate-title-in text-mist">o que a gente vê junto</p>
      <h1
        className="mt-4 animate-title-in text-center font-display text-3xl font-light italic text-star sm:text-5xl"
        style={{ animationDelay: '250ms', textShadow: '0 0 50px rgba(230, 192, 122, 0.12)' }}
      >
        Nosso Cinema
      </h1>
      <p className="timecode mt-5 animate-title-in text-2xl text-ember sm:text-3xl" style={{ animationDelay: '500ms' }}>
        {watched.length}
      </p>
      <p className="label mt-3 animate-title-in text-mist/60" style={{ animationDelay: '650ms' }}>
        {watched.length === 1 ? 'filme visto contigo' : 'vistos contigo'}
      </p>

      <Shelf label="já vimos" items={watched} onOpen={setOpen} />
      <Shelf
        label="no meio de"
        hint="essas a gente começou e não terminou"
        items={midway}
        onOpen={setOpen}
      />
      <Shelf
        label="ainda vamos ver"
        hint="tá tudo apagado esperando a gente. passa o dedo pra acender"
        items={pending}
        onOpen={setOpen}
      />

      {/* a dica de como preencher é pra mim, não pra ela: só aparece rodando local */}
      {empty && (
        <p className="mt-16 max-w-md text-center text-sm leading-relaxed text-mist/70">
          {import.meta.env.DEV ? (
            <>
              a lista mora em <span className="font-mono text-star/70">src/watchlist.ts</span> e os
              cartazes em <span className="font-mono text-star/70">src/cartazes/</span> — cada
              imagem com o nome do filme.
            </>
          ) : (
            'o nosso cinema ainda vai abrir.'
          )}
        </p>
      )}

      {onBack && (
        <button
          onClick={onBack}
          className="label mt-16 rounded-full border border-ember/40 bg-night-soft/40 px-6 py-2.5 text-ember backdrop-blur-sm transition-all duration-300 hover:border-ember/70 hover:bg-ember/10 hover:text-star"
        >
          voltar pra história
        </button>
      )}

      {open && <Sheet item={open} onClose={close} />}
    </section>
  )
}
