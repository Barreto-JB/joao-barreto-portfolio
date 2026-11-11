const pt = {
  heroHeadline: 'Aprendo a programar a construir ferramentas que me fazem falta.',
  heroIntro: 'Sou programador autodidata em Portugal. As tarefas do trabalho deram-me ideias para aplicações que uso para consultar turnos, orientar visitantes e registar acessos.',
  question: 'E se desse para resolver isto com código?',
  journeyTitle: ['Da curiosidade', 'ao código.'],
  journeyIntro: 'Estudei programação na Tokio School entre maio de 2024 e maio de 2025. No fim desse ano, o Dofus deu-me vontade de voltar aos scripts e experimentar por conta própria.',
  milestones: [
    {
      label: 'Final de 2025',
      title: 'Dofus e os scripts',
      text: 'A curiosidade pelo Dofus levou-me a aprofundar Lua, AutoHotkey e C#. Escrevia scripts pequenos, alterava a lógica e voltava a testar para perceber onde tinha falhado.',
      tags: ['Lua', 'AutoHotkey', 'C#'],
    },
    {
      label: 'Aprendizagem autodidata',
      title: 'Protótipos que ficaram comigo',
      text: 'Muitas experiências ficaram no meu computador. Usei esses protótipos para testar ideias e aprender a organizar o código de modo a encontrar erros mais depressa.',
    },
    {
      label: 'Colaboração',
      title: 'Ajudar com problemas de outras pessoas',
      text: 'Fui usando o que aprendia para ajudar informalmente com dúvidas técnicas e pequenas ferramentas. Às vezes, ouvir a pessoa explicar como fazia a tarefa já mudava a ideia que eu tinha para a resolver.',
    },
    {
      label: '2026',
      date: '2026',
      title: 'Ferramentas para o trabalho',
      text: 'A Escala Inteligente, o PG Guia de Bolso e o Registo Cais nasceram de dificuldades que encontrei no trabalho. Nesse ano fiz também o site Vitor Lior Performance para oferecer a um amigo.',
    },
    {
      label: 'Objetivo para 2027',
      title: 'Licenciatura em Engenharia Informática',
      text: 'Quero iniciar a licenciatura na Escola Superior de Tecnologia e Gestão de Viseu (ESTGV), no Instituto Politécnico de Viseu. Quero aprofundar as bases da programação que já uso nos meus projetos.',
    },
  ],
  luaTitle: 'Um exemplo de lógica em Lua',
  luaCaption: 'Exemplo ilustrativo. A simulação mostra como dois eventos mudam o estado de uma tarefa fictícia.',
  luaStart: 'Simular exemplo',
  luaRunning: 'A simular…',
  luaReset: 'Reiniciar',
  luaStates: ['Estado inicial: por iniciar', 'Evento start: em curso', 'Evento finish: concluída'],
  about: 'Gosto de perceber onde uma tarefa se torna mais complicada do que devia. Começo por reparar nos passos que repito ou na informação que demoro a encontrar. Depois experimento uma forma mais simples de fazer a tarefa.',
  thinkingTitle: 'A minha forma de pensar',
  thinkingSteps: ['Observar', 'Experimentar', 'Simplificar'],
}

const en: typeof pt = {
  heroHeadline: 'I learn to code by building tools I actually need.',
  heroIntro: 'I’m a self-taught developer in Portugal. Everyday tasks at work led me to build apps for checking shifts, helping visitors find their way and logging access.',
  question: 'Could I solve this with code?',
  journeyTitle: ['From curiosity', 'to code.'],
  journeyIntro: 'I studied programming at Tokio School from May 2024 to May 2025. Later that year, Dofus got me interested in writing scripts again and experimenting on my own.',
  milestones: [
    {
      label: 'Late 2025',
      title: 'Dofus and scripting',
      text: 'My curiosity about Dofus pushed me to explore Lua, AutoHotkey and C# in more depth. I wrote small scripts, changed the logic and ran them again to see where I had gone wrong.',
      tags: ['Lua', 'AutoHotkey', 'C#'],
    },
    {
      label: 'Learning on my own',
      title: 'Prototypes I kept to myself',
      text: 'A lot of experiments stayed on my computer. I used those prototypes to try ideas and learn how to organise my code so I could find bugs faster.',
    },
    {
      label: 'Helping others',
      title: 'Working through other people’s problems',
      text: 'I used what I had learned to help people informally with technical questions and small tools. Sometimes hearing how someone did a task changed my idea of how to fix it.',
    },
    {
      label: '2026',
      date: '2026',
      title: 'Tools for everyday work',
      text: 'Escala Inteligente, PG Guia de Bolso and Registo Cais grew out of problems I encountered at work. That year I also made the Vitor Lior Performance website as a gift for a friend.',
    },
    {
      label: 'Goal for 2027',
      title: 'Computer Engineering degree',
      text: 'I plan to start a degree at the School of Technology and Management of Viseu (ESTGV), part of the Polytechnic Institute of Viseu. I want a stronger grounding in the programming I already use in my projects.',
    },
  ],
  luaTitle: 'An example of Lua logic',
  luaCaption: 'In this illustrative example, two events change the state of a fictional task.',
  luaStart: 'Run simulation',
  luaRunning: 'Running…',
  luaReset: 'Reset',
  luaStates: ['Initial state: not started', 'Event start: in progress', 'Event finish: complete'],
  about: 'I like finding the point where a task gets harder than it needs to be. I look at the steps I repeat or the information I spend too long looking for. Then I try a simpler way of doing it.',
  thinkingTitle: 'How I think',
  thinkingSteps: ['Notice', 'Experiment', 'Simplify'],
}

export const journey = { pt, en }
