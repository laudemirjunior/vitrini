export type PiecePhoto = {
  src: string
  alt: string
}

export type PieceCategory = {
  id: string
  title: string
}

export type Piece = {
  id: string
  slug: string
  name: string
  description: string
  photos: PiecePhoto[]
  wholesale: number | null
  category: PieceCategory | null
}

export type Catalog = {
  exportedAt: string | null
  pieces: Piece[]
}
