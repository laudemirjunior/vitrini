import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { MessageDialog } from '../components/MessageDialog'
import { brl, site } from '../site'
import type { Piece } from '../types'

export function PiecePage({ pieces }: { pieces: Piece[] }) {
  const { slug } = useParams()
  const piece = pieces.find((item) => item.slug === slug)
  const [photo, setPhoto] = useState(0)
  const [messageOpen, setMessageOpen] = useState(false)

  useEffect(() => {
    setPhoto(0)
  }, [piece?.id])

  if (!piece) {
    return (
      <section className="intro">
        <h1>Essa peça não está na vitrine.</h1>
        <Link className="text-link" to="/">Ver as peças</Link>
      </section>
    )
  }

  const current = piece.photos[photo] ?? piece.photos[0]
  return (
    <article className="piece">
      <div className="gallery">
        {current ? (
          <img className="hero-photo" src={current.src} alt={current.alt} />
        ) : (
          <span className="no-photo tall">Sem foto</span>
        )}
        {piece.photos.length > 1 ? (
          <div className="thumbs">
            {piece.photos.map((item, index) => (
              <button
                key={item.src}
                type="button"
                className={index === photo ? 'thumb on' : 'thumb'}
                onClick={() => setPhoto(index)}
                aria-label={`Foto ${index + 1}`}
              >
                <img src={item.src} alt="" />
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <div className="piece-copy">
        <Link className="text-link" to="/">Peças</Link>
        <h1>{piece.name}</h1>
        {piece.wholesale != null ? (
          <p className="price">
            <strong>{brl(piece.wholesale)}</strong>
            <span>a unidade no atacado. Mínimo de {site.wholesaleMin} unidades, {brl(piece.wholesale * site.wholesaleMin)}.</span>
          </p>
        ) : null}
        <button type="button" className="cta" onClick={() => setMessageOpen(true)}>Mandar mensagem</button>
        <p className="hint">A mensagem sai daqui e chega em {site.email}.</p>
        {messageOpen ? <MessageDialog pieceName={piece.name} onClose={() => setMessageOpen(false)} /> : null}
        {piece.description ? <p className="description">{piece.description}</p> : null}
      </div>
    </article>
  )
}
