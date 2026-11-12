import type { Localized } from './portfolio'

type ProjectImage = {
  src: string
  width: number
  height: number
  alt: Localized
  caption: Localized
}

export type Project = {
  id: string
  title: string
  category: Localized
  description: Localized
  problem: Localized
  solution: Localized
  features: Localized[]
  technologies: string[]
  status: Localized
  images: ProjectImage[]
  links: { label: Localized; href: string }[]
  notice?: Localized
}

const l = (pt: string, en: string): Localized => ({ pt, en })
const source = l('Ver código', 'Source code')
const visit = l('Ver website', 'Visit website')

export const projects: [Project, ...Project[]] = [
  {
    id: 'escalas',
    title: 'Escala Inteligente',
    category: l('Aplicação web e automação', 'Web app and automation'),
    description: l(
      'Transformei duas escalas de trabalho em PDF num calendário pessoal. Num só ecrã vejo quando trabalho, em que posto e quando tenho folga.',
      'I turned two PDF rotas into a personal calendar. I can see when and where I’m working and when I have a day off.',
    ),
    problem: l(
      'No Palácio do Gelo, os turnos estavam divididos por dois PDFs. Para saber se trabalhava num dia, procurava o meu código nos dois ficheiros e depois confirmava o horário e o posto. Se o código não aparecesse, estava de folga.',
      'At Palácio do Gelo, shifts were split across two PDFs. To find out whether I was working, I searched both files for my staff code, then looked up the shift time and location. If the code wasn’t in either file, I had the day off.',
    ),
    solution: l(
      'Criei um fluxo que identifica os anexos recebidos por e-mail, valida os dados importados e organiza os turnos num calendário mensal. Usei Google Apps Script e Google Sheets no fluxo e JavaScript na interface.',
      'I built a workflow that identifies the email attachments, checks the imported data and puts the shifts into a monthly calendar. I used Google Apps Script and Google Sheets in the workflow, and JavaScript in the interface.',
    ),
    features: [
      l('Calendário com turnos, postos e folgas', 'Calendar with shift times, locations and days off'),
      l('Vista do dia com próximo compromisso, meteorologia e uma personagem que muda em dias de folga', 'Daily view with the next shift, the weather and a character that changes on days off'),
    ],
    technologies: ['Google Apps Script', 'Google Sheets', 'HTML', 'CSS', 'JavaScript'],
    status: l('Demonstração com dados fictícios', 'Demo with sample data'),
    images: [{
      src: 'media/projects/escala-hoje.webp', width: 1180, height: 537,
      alt: l('Ecrã da Escala Inteligente num dia de folga, com personagem em descanso e previsão do tempo.', 'Escala Inteligente on a day off, with a resting character and a weather forecast.'),
      caption: l('Recorte da aplicação com dados operacionais ocultados.', 'Cropped app screenshot with work details obscured.'),
    }],
    links: [],
  },
  {
    id: 'pg-guia',
    title: 'PG Guia de Bolso',
    category: l('Guia para telemóvel · PWA', 'Mobile guide · PWA'),
    description: l(
      'Um guia do Palácio do Gelo para pesquisar lojas, consultar plantas e encontrar o piso certo.',
      'A pocket guide for finding shops and checking floor plans at Palácio do Gelo.',
    ),
    problem: l(
      'No trabalho, pediam-me muitas vezes indicações para uma loja. Quando não me lembrava do piso ou do caminho, tinha de consultar várias fontes.',
      'At work, people often asked me where to find a shop. If I couldn’t remember the floor or the route, I had to check several sources.',
    ),
    solution: l(
      'Juntei o diretório e as plantas numa aplicação para telemóvel. Começou como ferramenta pessoal e evoluiu para um guia não oficial para visitantes.',
      'I brought the directory and floor plans together in a mobile app. It started as a tool for my own use and grew into an unofficial guide for visitors.',
    ),
    features: [
      l('Catálogo com 142 locais na base do projeto, com pesquisa e filtros por piso', 'The project dataset contains 142 locations, with search and floor filters'),
      l('Plantas e pontos de referência para orientar o percurso', 'Floor plans and landmarks for finding your way'),
      l('Favoritos e notas guardados no dispositivo. Os recursos em cache ficam disponíveis offline após a primeira visita.', 'Favourites and notes stay on the device. Cached resources are available offline after the first visit.'),
    ],
    technologies: ['HTML', 'CSS', 'JavaScript', 'PWA', 'Service Worker'],
    status: l('Aplicação pública', 'Public app'),
    images: [
      {
        src: 'media/projects/pg-inicio.webp', width: 1990, height: 1884,
        alt: l('Início do PG Guia de Bolso com campo de pesquisa e atalhos para lojas e pisos.', 'PG Guia de Bolso home screen with search and shortcuts to shops and floors.'),
        caption: l('Início · Encontrar uma loja', 'Home · Find a shop'),
      },
      {
        src: 'media/projects/pg-lojas.webp', width: 2048, height: 761,
        alt: l('Diretório do PG com pesquisa, filtros por piso e resultados de lojas.', 'PG shop directory showing search, floor filters and shop results.'),
        caption: l('Diretório · Pesquisar e filtrar', 'Directory · Search and filter'),
      },
      {
        src: 'media/projects/pg-mapa.webp', width: 1990, height: 1353,
        alt: l('Mapa do PG com seletor de pisos e planta do piso −2.', 'PG map with a floor selector and the floor plan for level −2.'),
        caption: l('Mapa · Orientar-se por piso', 'Map · Find your way by floor'),
      },
    ],
    links: [
      { label: l('Abrir guia', 'Open guide'), href: 'https://49c0ddeb-palacio-gelo-guia.imjoaobarreto.workers.dev/#/' },
      { label: source, href: 'https://github.com/Barreto-JB/palacio-gelo-guia' },
    ],
  },
  {
    id: 'acessos',
    title: 'Registo Cais',
    category: l('Aplicação web', 'Web app'),
    description: l(
      'Passei os registos de entradas e saídas do papel para uma aplicação com pesquisa e exportação.',
      'I moved entry and exit logs from paper to a searchable web app with report exports.',
    ),
    problem: l(
      'No cais, os movimentos de estafetas, viaturas e visitantes eram anotados à mão. Corrigir uma entrada ou procurar um registo antigo obrigava a voltar às folhas.',
      'At the loading bay, couriers, vehicles and visitors were logged by hand. Correcting an entry or finding an older record meant going back through the paperwork.',
    ),
    solution: l(
      'Criei uma aplicação que guarda a hora de entrada e saída, mostra quem ainda está no local e permite pesquisar ou corrigir registos. Há armazenamento local no navegador, suporte offline e uma integração opcional com Supabase no repositório.',
      'I built an app that records entry and exit times, shows who is still on site and lets users search or correct entries. It supports local browser storage and offline use. The repository includes an optional Supabase integration.',
    ),
    features: [
      l('Registos de estafetas, viaturas e visitantes com histórico', 'Courier, vehicle and visitor records with history'),
      l('Exportação CSV e relatórios para impressão ou PDF', 'CSV export and printable reports that can be saved as PDF'),
    ],
    technologies: ['HTML', 'CSS', 'JavaScript', 'localStorage'],
    status: l('Aplicação pública', 'Public app'),
    images: [{
      src: 'media/projects/registo-cais.webp', width: 1260, height: 272,
      alt: l('Separadores de estafetas, viaturas e pessoas do Registo Cais, com contadores a zero.', 'Registo Cais tabs for couriers, vehicles and visitors, with all counters at zero.'),
      caption: l('Captura da interface com a lista vazia.', 'App screenshot with an empty list.'),
    }],
    links: [
      { label: l('Testar aplicação', 'Try the app'), href: 'https://barreto-jb.github.io/registo-cais/?v=a50799f' },
      { label: source, href: 'https://github.com/Barreto-JB/registo-cais' },
    ],
    notice: l('Abre a aplicação publicada. Se a experimentares, usa apenas dados fictícios.', 'This opens the published app. If you try it, use sample data only.'),
  },
  {
    id: 'vitor-lior',
    title: 'Vitor Lior Performance',
    category: l('Website de apresentação', 'Personal training website'),
    description: l(
      'Criei este website como presente para um amigo apresentar o seu trabalho na área do treino.',
      'I built this website as a gift for a friend who wanted to show people how he works as a personal trainer.',
    ),
    problem: l(
      'Queria dar-lhe um lugar para explicar como acompanha os alunos e responder a dúvidas antes do primeiro contacto.',
      'I wanted him to have a place to explain how he coaches and answer questions before the first conversation.',
    ),
    solution: l(
      'Organizei o conteúdo em torno do método de treino, com vídeos, perguntas frequentes e um formulário de diagnóstico em quatro etapas. Na versão do GitHub Pages, o visitante pode enviar as respostas pelo WhatsApp.',
      'I built the page around his training approach, with videos, FAQs and a four-step questionnaire. On GitHub Pages, visitors can send their answers through WhatsApp.',
    ),
    features: [
      l('Navegação adaptada a desktop e telemóvel', 'Navigation designed for desktop and mobile'),
      l('Formulário por etapas com envio pelo WhatsApp', 'Multi-step questionnaire with WhatsApp hand-off'),
    ],
    technologies: ['Next.js', 'React', 'TypeScript', 'GitHub Pages'],
    status: l('Website público', 'Public website'),
    images: [{
      src: 'media/projects/vitor-lior.webp', width: 1280, height: 772,
      alt: l('Página inicial do Vitor Lior Performance com o título “Treino não é tentativa. É estratégia.”', 'Vitor Lior Performance home screen with the headline “Training isn’t guesswork. It’s strategy.”'),
      caption: l('Captura da página inicial publicada.', 'Screenshot of the published home page.'),
    }],
    links: [
      { label: visit, href: 'https://barreto-jb.github.io/vitor-lior-performance/' },
      { label: source, href: 'https://github.com/Barreto-JB/vitor-lior-performance' },
    ],
  },
]
