import { useEffect, useState, type ReactNode } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { PiecePage } from './pages/PiecePage'
import { site } from './site'
import type { Catalog, Piece } from './types'

type Load =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; pieces: Piece[] }

function useCatalog(): Load {
  const [load, setLoad] = useState<Load>({ status: 'loading' })
  useEffect(() => {
    let gone = false
    fetch('/catalog/catalog.json')
      .then((response) => {
        if (!response.ok) throw new Error('catalog')
        return response.json() as Promise<Catalog>
      })
      .then((catalog) => {
        if (!gone) setLoad({ status: 'ready', pieces: catalog.pieces ?? [] })
      })
      .catch(() => {
        if (!gone) setLoad({ status: 'error' })
      })
    return () => {
      gone = true
    }
  }, [])
  return load
}

function Shell({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="top">
        <div className="top-inner">
          <Link to="/" className="brand">{site.name}</Link>
        </div>
      </header>
      <div className="page">
        <main>{children}</main>
        <footer className="foot">
          <p>{site.name} · {site.city}</p>
          <p><a href={`mailto:${site.email}`}>{site.email}</a></p>
        </footer>
      </div>
    </>
  )
}

function Missing() {
  return (
    <Shell>
      <section className="intro">
        <h1>Essa página não existe.</h1>
        <Link className="text-link" to="/">Ver as peças</Link>
      </section>
    </Shell>
  )
}

export function App() {
  const load = useCatalog()
  if (load.status === 'loading') {
    return <Shell><p className="status">Carregando as peças.</p></Shell>
  }
  if (load.status === 'error') {
    return <Shell><p className="status">Não consegui abrir o catálogo.</p></Shell>
  }
  const pieces = load.pieces
  return (
    <Routes>
      <Route path="/" element={<Shell><HomePage pieces={pieces} /></Shell>} />
      <Route path="/pecas/:slug" element={<Shell><PiecePage pieces={pieces} /></Shell>} />
      <Route path="*" element={<Missing />} />
    </Routes>
  )
}
