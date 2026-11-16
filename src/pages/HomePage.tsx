import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { brl, site } from '../site'
import type { Piece } from '../types'

function Banner({ pieces }: { pieces: Piece[] }) {
  const slides = pieces.filter((piece) => piece.photos[0]).slice(0, 6)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (slides.length < 2 || paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length)
    }, 5000)
    return () => window.clearInterval(timer)
  }, [paused, slides.length])

  if (slides.length === 0) return null
  const turn = (step: number) => setIndex((value) => (value + step + slides.length) % slides.length)

  return (
    <section
      className="banner"
      aria-label="Peças em destaque"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((piece, slide) => {
        let offset = slide - index
        if (offset > slides.length / 2) offset -= slides.length
        if (offset < -slides.length / 2) offset += slides.length
        const place = offset === 0 ? 'current' : offset === -1 ? 'prev' : offset === 1 ? 'next' : offset < 0 ? 'far-prev' : 'far-next'
        return (
          <Link
            key={piece.id}
            className={`banner-card ${place}`}
            to={`/pecas/${piece.slug}`}
            aria-hidden={place === 'far-prev' || place === 'far-next'}
            tabIndex={place === 'prev' || place === 'current' || place === 'next' ? 0 : -1}
            aria-label={place === 'prev' ? 'Peça anterior' : place === 'next' ? 'Próxima peça' : undefined}
            onClick={(event) => {
              if (place === 'prev') {
                event.preventDefault()
                turn(-1)
              }
              if (place === 'next') {
                event.preventDefault()
                turn(1)
              }
              if (place === 'far-prev' || place === 'far-next') event.preventDefault()
            }}
          >
            <img src={piece.photos[0].src} alt="" />
            <span className="banner-caption">
              <strong>{piece.name}</strong>
              {piece.wholesale != null ? (
                <em>{brl(piece.wholesale)} · mínimo {site.wholesaleMin}</em>
              ) : null}
            </span>
          </Link>
        )
      })}
    </section>
  )
}

export function HomePage({ pieces }: { pieces: Piece[] }) {
  const [categoryId, setCategoryId] = useState<string | null>(null)
  const categories = [...pieces.reduce((map, piece) => {
    if (!piece.category) return map
    const current = map.get(piece.category.id)
    map.set(piece.category.id, {
      title: piece.category.title,
      count: (current?.count ?? 0) + 1,
    })
    return map
  }, new Map<string, { title: string, count: number }>()).entries()]
    .sort((a, b) => b[1].count - a[1].count || a[1].title.localeCompare(b[1].title, 'pt-BR'))
  const visible = categoryId ? pieces.filter((piece) => piece.category?.id === categoryId) : pieces
  const count = visible.length === 1 ? '1 peça' : `${visible.length} peças`
  return (
    <>
      <section className="intro">
        <p className="eyebrow">{site.city}</p>
        <h1>{site.tagline}</h1>
        <p className="lede">{site.intro}</p>
      </section>
      {pieces.length === 0 ? (
        <p className="status">Nenhuma peça anunciada ainda.</p>
      ) : (
        <>
          {categories.length > 0 ? (
            <div className="cloud" role="group" aria-label="Categorias">
              <button type="button" aria-pressed={categoryId === null} onClick={() => setCategoryId(null)}>
                Todas<span className="cloud-count">{pieces.length}</span>
              </button>
              {categories.map(([id, category]) => (
                <button key={id} type="button" aria-pressed={categoryId === id} onClick={() => setCategoryId(id)}>
                  {category.title}<span className="cloud-count">{category.count}</span>
                </button>
              ))}
            </div>
          ) : null}
          <Banner pieces={visible} />
          <p className="count">{count}</p>
          <ul className="grid">
            {visible.map((piece) => {
              const cover = piece.photos[0]
              return (
                <li key={piece.id}>
                  <Link className="card" to={`/pecas/${piece.slug}`}>
                    {cover ? (
                      <img src={cover.src} alt="" />
                    ) : (
                      <span className="no-photo">Sem foto</span>
                    )}
                    <div className="card-text">
                      <h2>{piece.name}</h2>
                      {piece.wholesale != null ? (
                        <p className="card-price">{brl(piece.wholesale)} · mín. {site.wholesaleMin}</p>
                      ) : null}
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </>
  )
}
