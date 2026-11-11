import appsScript from '../assets/technology/googleappsscript.svg'
import css from '../assets/technology/css.svg'
import html from '../assets/technology/html.svg'
import javascript from '../assets/technology/javascript.svg'
import next from '../assets/technology/nextjs.svg'
import pwa from '../assets/technology/pwa.svg'
import react from '../assets/technology/react.svg'
import sheets from '../assets/technology/googlesheets.svg'
import tailwind from '../assets/technology/tailwind.svg'
import typescript from '../assets/technology/typescript.svg'
import vite from '../assets/technology/vite.svg'
import type { Localized } from './portfolio'

type Technology = { name: string; logo: string; darkTile?: boolean }
type TechnologyGroup = { title: Localized; items: Technology[] }

export const technologyGroups: TechnologyGroup[] = [
  {
    title: { pt: 'Neste portefólio', en: 'In this portfolio' },
    items: [
      { name: 'React', logo: react, darkTile: true },
      { name: 'TypeScript', logo: typescript },
      { name: 'Vite', logo: vite },
      { name: 'Tailwind CSS', logo: tailwind, darkTile: true },
    ],
  },
  {
    title: { pt: 'Nos projetos', en: 'In my projects' },
    items: [
      { name: 'HTML', logo: html },
      { name: 'CSS', logo: css },
      { name: 'JavaScript', logo: javascript },
      { name: 'Next.js', logo: next },
      { name: 'Google Apps Script', logo: appsScript },
      { name: 'Google Sheets', logo: sheets },
      { name: 'PWA', logo: pwa },
    ],
  },
]
