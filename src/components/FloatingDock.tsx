import { useRef } from 'react'
import { Archive, Code2, FolderOpen, History, House, LayoutGrid, Mail, UserRound } from 'lucide-react'
import { useLanguage } from '../i18n/Language'
import { sectionIds } from '../i18n/translations'
import type { SectionId } from '../i18n/translations'
import { useActiveSection } from '../hooks/useActiveSection'

const icons = { inicio: House, construo: FolderOpen, projetos: Archive, stack: Code2, trajetoria: History, sobre: UserRound, contacto: Mail }
const mobileMain: SectionId[] = ['inicio', 'construo', 'contacto']
const mobileExtra = sectionIds.filter(id => !mobileMain.includes(id))

export function FloatingDock() {
  const { t } = useLanguage()
  const active = useActiveSection()
  const menu = useRef<HTMLDivElement>(null)

  function link(id: SectionId, inMenu = false) {
    const Icon = icons[id]
    return (
      <a key={id} className="dock-link" href={`#${id}`} aria-current={active === id ? 'location' : undefined}
        onClick={inMenu ? () => menu.current?.hidePopover() : undefined}>
        <Icon size={17} aria-hidden="true" />
        <span>{inMenu ? t.sections[id].title : t.sections[id].short}</span>
      </a>
    )
  }

  return (
    <nav className="dock" aria-label={t.nav}>
      <div className="dock-desktop">{sectionIds.map(id => link(id))}</div>
      <div className="dock-mobile">
        {mobileMain.map(id => link(id))}
        <button className="dock-link" type="button" popoverTarget="mobile-navigation"
          aria-label={t.moreSections} data-current={mobileExtra.includes(active) ? true : undefined}>
          <LayoutGrid size={17} aria-hidden="true" /><span>{t.moreSections}</span>
        </button>
        <div className="dock-menu" id="mobile-navigation" popover="auto" ref={menu}>
          {mobileExtra.map(id => link(id, true))}
        </div>
      </div>
    </nav>
  )
}
