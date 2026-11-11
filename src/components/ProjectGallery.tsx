import { useId, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react'
import { publicAsset } from '../data/paths'
import { useLanguage } from '../i18n/Language'
import '../styles/project-gallery.css'

type Localized = { pt: string; en: string }

export type GalleryImage = {
  src: string
  width: number
  height: number
  alt: Localized
  caption: Localized
}

const galleryCopy = {
  pt: { heading: 'Capturas da aplicação', enlarge: 'Ampliar', previous: 'Imagem anterior', next: 'Imagem seguinte', close: 'Fechar galeria', image: 'Imagem' },
  en: { heading: 'App screenshots', enlarge: 'Enlarge', previous: 'Previous image', next: 'Next image', close: 'Close gallery', image: 'Image' },
}

export function ProjectGallery({ images, title }: { images: readonly GalleryImage[]; title: string }) {
  const { locale } = useLanguage()
  const copy = galleryCopy[locale]
  const heading = useId()
  const dialog = useRef<HTMLDialogElement>(null)
  const [selected, setSelected] = useState<number | null>(null)

  if (images.length === 0) return null

  function move(offset: number) {
    setSelected(current => ((current ?? 0) + offset + images.length) % images.length)
  }

  const current = selected === null ? null : images[selected]
  return (
    <section className="case-gallery" aria-label={copy.heading + ' · ' + title}>
      <h4>{copy.heading}</h4>
      <ul className="case-gallery-grid">
        {images.map((item, index) => (
          <li key={item.src}>
            <figure>
              <button type="button" className="case-gallery-thumb" aria-haspopup="dialog" aria-label={copy.enlarge + ' · ' + item.caption[locale]} onClick={() => {
                setSelected(index)
                dialog.current?.showModal()
              }}>
                <img src={publicAsset(item.src)} width={item.width} height={item.height} alt={item.alt[locale]} loading="lazy" decoding="async" />
                <Maximize2 size={18} aria-hidden="true" />
              </button>
              <figcaption>{item.caption[locale]}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
      <dialog className="case-gallery-dialog" ref={dialog} aria-labelledby={heading}
        onClose={() => setSelected(null)}
        onClick={event => { if (event.target === event.currentTarget) dialog.current?.close() }}
        onKeyDown={event => {
          if (images.length < 2) return
          if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault()
            move(event.key === 'ArrowLeft' ? -1 : 1)
          }
        }}>
        <div className="case-gallery-viewer">
          <header>
            <h4 id={heading}>{title}</h4>
            <button type="button" aria-label={copy.close} onClick={() => dialog.current?.close()}>
              <X size={22} aria-hidden="true" />
            </button>
          </header>
          {current && (
            <figure>
              <img key={current.src} src={publicAsset(current.src)} width={current.width} height={current.height} alt={current.alt[locale]} />
              <figcaption aria-live="polite">{current.caption[locale]}</figcaption>
            </figure>
          )}
          {images.length > 1 && (
            <div className="case-gallery-controls">
              <button type="button" aria-label={copy.previous} onClick={() => move(-1)}><ChevronLeft aria-hidden="true" /></button>
              <span aria-label={copy.image}>{(selected ?? 0) + 1} / {images.length}</span>
              <button type="button" aria-label={copy.next} onClick={() => move(1)}><ChevronRight aria-hidden="true" /></button>
            </div>
          )}
        </div>
      </dialog>
    </section>
  )
}
