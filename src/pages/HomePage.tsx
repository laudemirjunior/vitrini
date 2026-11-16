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
  const count = pieces.length === 1 ? '1 peça' : `${pieces.length} peças`
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
          <Banner pieces={pieces} />
          <p className="count">{count}</p>
          <ul className="grid">
            {pieces.map((piece) => {
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
