export const site = {
  name: 'LJ Tech',
  tagline: 'Peças impressas em 3D.',
  city: 'Paranaguá',
  email: 'nlaudemir@gmail.com',
  wholesaleMin: 5,
  intro: 'Escolha uma peça e mande uma mensagem. A compra combina na conversa.',
}

export function brl(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
