export type PiecePhoto = {
  src: string
  alt: string
}

export type Piece = {
  id: string
  slug: string
  name: string
  description: string
  photos: PiecePhoto[]
  wholesale: number | null
}

export type Catalog = {
  exportedAt: string | null
  pieces: Piece[]
}
