import { useEffect, useId, useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { site } from '../site'

export function MessageDialog({ pieceName, onClose }: { pieceName: string, onClose: () => void }) {
  const titleId = useId()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [message, setMessage] = useState(`Olá, quero saber da peça ${pieceName}.`)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [onClose])

  async function submit(event: FormEvent) {
    event.preventDefault()
    setStatus('sending')
    try {
      const response = await fetch(`https://formsubmit.co/ajax/${site.email}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          WhatsApp: whatsapp.trim(),
          message: `${message.trim()}\n\nWhatsApp: ${whatsapp.trim()}`,
          peça: pieceName,
          _subject: `LJ Tech — ${pieceName}`,
          _replyto: email.trim(),
          _template: 'box',
          _captcha: 'false',
        }),
      })
      const data = await response.json().catch(() => null) as { success?: string | boolean, message?: string } | null
      if (!response.ok || data?.success === false || data?.success === 'false') {
        throw new Error(data?.message || 'fail')
      }
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return createPortal(
    <div className="modal-back" onMouseDown={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-head">
          <h2 id={titleId}>Mandar mensagem</h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Fechar">Fechar</button>
        </div>
        {status === 'sent' ? (
          <p className="modal-done">Mensagem enviada. A LJ Tech responde no seu e-mail.</p>
        ) : (
          <form className="modal-form" onSubmit={submit}>
            <p className="modal-piece">{pieceName}</p>
            <label>
              Seu nome
              <input value={name} onChange={(event) => setName(event.target.value)} required autoFocus />
            </label>
            <label>
              Seu e-mail
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </label>
            <label>
              Seu WhatsApp
              <input type="tel" inputMode="tel" value={whatsapp} onChange={(event) => setWhatsapp(event.target.value)} required placeholder="41999999999" />
            </label>
            <label>
              Mensagem
              <textarea rows={5} value={message} onChange={(event) => setMessage(event.target.value)} required />
            </label>
            {status === 'error' ? <p className="modal-error">Não consegui enviar. Tente de novo.</p> : null}
            <button className="cta" type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Enviando...' : 'Enviar'}
            </button>
          </form>
        )}
      </div>
    </div>,
    document.body,
  )
}
