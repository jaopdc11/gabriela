import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { DEFAULT_WORLD, NAMORO_DATE, monthTracks, worldById, type World } from './data'
import { buildChapters, type Chapter } from './chapters'
import { ChapterCard } from './components/ChapterCard'
import { MonthLetter } from './components/Letter'
import { SkyMap } from './components/SkyMap'
import { Starfield } from './components/Starfield'
import { CursorGlow } from './components/CursorGlow'
import { Hero } from './components/Hero'
import { Prologue, PrologueNamoro } from './components/Prologue'
import { NightJourney } from './components/NightJourney'
import { PhotoCarousel } from './components/PhotoCarousel'
import { Epilogue, EpilogueNamoro } from './components/Epilogue'
import { AmbientAudio } from './components/AmbientAudio'
import { WorldSwitch } from './components/WorldSwitch'

/** Mundo pedido na URL (?mundo=comeco), senão o padrão. */
const worldFromUrl = (): World['id'] => {
  if (typeof window === 'undefined') return DEFAULT_WORLD
  return worldById(new URLSearchParams(window.location.search).get('mundo')).id
}

/** Capítulo pedido na URL (?mes=2), se for um número. */
const chapterFromUrl = (): number | null => {
  if (typeof window === 'undefined') return null
  const raw = new URLSearchParams(window.location.search).get('mes')
  const n = raw ? parseInt(raw, 10) : NaN
  return Number.isFinite(n) ? n : null
}

/**
 * O capítulo que abre o mundo: o último mês que já FECHOU. O mês corrente está
 * acontecendo agora — abrir nele é abrir um capítulo pela metade, sem carta nem
 * fecho. Entre os meses fechados, o último que tem alguma coisa escrita; se
 * nenhum mês fechou ainda, o primeiro.
 */
const openingChapter = (chapters: Chapter[]) => {
  const closed = chapters.filter((c) => c.closed)
  const written = closed.filter((c) => c.stars.length > 0 || c.finale || c.dedication)
  return (written[written.length - 1] ?? closed[closed.length - 1] ?? chapters[0]).n
}

/** O mapa de todas as estrelas mora em ?mapa=1. */
const mapFromUrl = () =>
  typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('mapa')

/** ?poster=1 deixa o mapa limpo (sem botões nem som), pra virar imagem. */
const posterFromUrl = () =>
  typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('poster')

export default function App() {
  const [showMap, setShowMap] = useState(mapFromUrl)
  const poster = showMap && posterFromUrl()
  const [worldId, setWorldId] = useState<World['id']>(worldFromUrl)
  const world = worldById(worldId)

  // os capítulos nascem do calendário: um mês vira, um capítulo aparece
  const chapters = useMemo(
    () =>
      world.chaptered ? buildChapters(world, NAMORO_DATE, new Date(), import.meta.env.DEV) : [],
    [world],
  )
  const [chapterN, setChapterN] = useState<number | null>(chapterFromUrl)
  const chapter =
    chapters.find((c) => c.n === chapterN) ??
    (chapters.length > 0 ? chapters.find((c) => c.n === openingChapter(chapters))! : undefined)
  const nextChapter = chapter ? chapters.find((c) => c.n === chapter.n + 1) : undefined
  // estável: é prop do álbum, e o álbum reage a mudança de identidade
  const monthTabs = useMemo(() => chapters.map((c) => ({ n: c.n, nav: c.nav })), [chapters])

  const changeChapter = useCallback((n: number) => {
    setChapterN(n)
    const url = new URL(window.location.href)
    url.searchParams.set('mes', String(n))
    url.hash = ''
    window.history.pushState({ ...window.history.state, mes: n }, '', url)
  }, [])

  // o site tem que abrir na capa, sempre: o navegador guarda a altura da rolagem
  // e devolve ela no F5, o que fazia o site abrir no meio do capítulo
  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
    // link com âncora (#ceu, #album) continua valendo
    if (!window.location.hash) window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [])

  // troca de capítulo cai na cartela do mês novo. compara com o capítulo de
  // antes em vez de marcar "primeira vez": no StrictMode o efeito roda duas
  // vezes na montagem, e a segunda rolava a página sozinha ao abrir o site
  const shownChapter = useRef(chapterN)
  useEffect(() => {
    if (shownChapter.current === chapterN) return
    shownChapter.current = chapterN
    document.getElementById('capitulo')?.scrollIntoView({ behavior: 'instant' as ScrollBehavior })
  }, [chapterN])

  const changeWorld = useCallback((id: World['id']) => {
    const url = new URL(window.location.href)
    url.searchParams.set('mundo', id)
    url.searchParams.delete('mes')
    url.searchParams.delete('mapa')
    url.hash = ''
    window.history.pushState({ mundo: id }, '', url)
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    setShowMap(false)
    setWorldId(id)
    setChapterN(null)
  }, [])

  /** entra e sai do mapa mantendo o resto da URL (link compartilhável). */
  const toggleMap = useCallback((on: boolean) => {
    const url = new URL(window.location.href)
    if (on) url.searchParams.set('mapa', '1')
    else url.searchParams.delete('mapa')
    url.hash = ''
    window.history.pushState({ ...window.history.state, mapa: on }, '', url)
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    setShowMap(on)
  }, [])

  // voltar/avançar do navegador volta pro mundo, pro capítulo e pro mapa de antes
  useEffect(() => {
    const onPop = () => {
      setShowMap(mapFromUrl())
      setWorldId(worldFromUrl())
      setChapterN(chapterFromUrl())
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  return (
    <div className="grain vignette relative">
      <Starfield />
      <CursorGlow />
      {/* a trilha do mês manda; sem ela, toca a do mundo */}
      {!poster && (
        <AmbientAudio tracks={(chapter && monthTracks[chapter.n]) || world.tracks} />
      )}

      {/* abertura de cinema: a tela nasce do preto */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[80] bg-night-deep"
        style={{ animation: 'fade-from-black 1.9s ease-out forwards' }}
      />

      <WorldSwitch
        current={worldId}
        onChange={changeWorld}
        onMap={() => toggleMap(true)}
        mapActive={showMap}
      />

      {showMap ? (
        <main className="relative z-10">
          <SkyMap poster={poster} />
        </main>
      ) : (
      /* a key remonta tudo na troca: as animações de entrada rodam de novo */
      <main key={worldId} className="relative z-10">
        {/* o prólogo (#antes) só existe no capítulo 1; nos outros meses o botão
            da capa desce direto pra cartela do capítulo */}
        <Hero world={world} to={world.chaptered && chapter && chapter.n !== 1 ? '#capitulo' : '#antes'} />
        {world.chaptered && chapter ? (
          <>
            {/* a ponte do sim pro namoro abre o primeiro capítulo */}
            {chapter.n === 1 && <PrologueNamoro />}
            {/* a key remonta o capítulo: cartela e céu entram de novo, do zero */}
            <div key={chapter.n}>
              <ChapterCard chapter={chapter} chapters={chapters} onChange={changeChapter} />
              {/* a carta do mês: mesma forma todo mês, escrita em `monthDedications` */}
              {chapter.dedication && (
                <MonthLetter
                  dedication={chapter.dedication}
                  label={`a carta do ${chapter.bareName}`}
                  date={chapter.end}
                />
              )}
              <NightJourney
                stars={chapter.stars}
                finale={chapter.finale}
                seed={chapter.seed}
                label={`${chapter.name}, nas estrelas`}
                emptyNote={
                  chapter.current
                    ? 'esse mês tá acontecendo agora. as estrelas dele ainda vão acender.'
                    : 'esse mês ainda não tem estrela aqui.'
                }
              />
              <PhotoCarousel
                dir={world.albumDir}
                label={world.albumLabel}
                title={world.albumTitle}
                months={monthTabs}
                activeMonth={chapter.n}
              />
              <EpilogueNamoro next={nextChapter} onNext={changeChapter} />
            </div>
          </>
        ) : (
          <>
            <Prologue />
            <NightJourney
              stars={world.stars ?? []}
              finale={world.finale}
              seed={world.seed}
              label={world.skyLabel}
            />
            <PhotoCarousel dir={world.albumDir} label={world.albumLabel} title={world.albumTitle} />
            <Epilogue />
          </>
        )}
      </main>
      )}
    </div>
  )
}
