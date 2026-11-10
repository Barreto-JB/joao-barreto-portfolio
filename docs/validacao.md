# Validação

## Capturas da build de produção

| Largura | Abertura | Projeto em destaque | Página completa |
| --- | --- | --- | --- |
| 390 px | [Início](capturas/inicio-390.png) | [Projeto](capturas/projeto-390.png) | [Página](capturas/pagina-390.png) |
| 768 px | [Início](capturas/inicio-768.png) | [Projeto](capturas/projeto-768.png) | [Página](capturas/pagina-768.png) |
| 1440 px | [Início](capturas/inicio-1440.png) | [Projeto](capturas/projeto-1440.png) | [Página](capturas/pagina-1440.png) |

A primeira ronda revelou títulos demasiado apertados e sobreposição da dock desktop no projeto em destaque. A segunda confirmou a nova posição da dock, a leitura dos títulos, o alinhamento da grelha e a transição do hero para os projetos. As capturas finais foram feitas com a preferência de movimento reduzido.

## Verificações

- Playwright em Chromium com 18 testes na build de produção. Navegação e secção ativa, teclado e foco, menu móvel, idiomas e persistência, detalhes dos projetos, área de transferência e pausa efetiva do Canvas, do monograma e do cursor.
- Larguras de 320, 360, 390, 430, 768, 1024 e 1440 px verificadas em português e inglês, sem overflow horizontal.
- WebKit com emulação iPhone de 390 px. Navegação por toque, mudança de idioma e expansão de projetos.
- HTML pré-renderizado verificado com JavaScript desligado. Uma build local em subpasta confirmou o URL canónico, a imagem de partilha e o sitemap com um endereço de teste.
- axe-core em português a 390 px e em inglês a 1440 px, sem violações automatizadas nas regras WCAG A/AA executadas. As capturas também verificaram erros de consola e pedidos de recursos.
- Contraste calculado de 14,21:1 para texto menta sobre o fundo, 5,54:1 para destaques sobre a superfície elevada e acima de 3:1 para o contorno dos botões sobre essa superfície.

## Lighthouse

Na entrega inicial, o Lighthouse 13.6.0 atribuiu 100/100 a desempenho, acessibilidade, boas práticas e SEO na build local com emulação móvel. A medição registou FCP de 0,8 s, LCP de 1,9 s, TBT de 10 ms e CLS de 0.

## Web Interface Guidelines

- `src/App.tsx:17` — Nome acessível da marca inclui o monograma visível.
- `src/components/LanguageSwitch.tsx:7` — Nomes acessíveis do seletor incluem as siglas visíveis.
- `src/styles/projects.css:70` — Contorno dos botões de detalhes reforçado.
- `src/styles/tokens.css:105` — Margem de scroll revista para a posição da dock desktop.

[Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md)

## Reproduzir

Com `npm run preview -- --port 4179` a correr, `node scripts/screenshots.mjs` atualiza as capturas. Para verificar HTML estático e toque, instala o Chromium e o WebKit com `npx playwright install chromium webkit` e executa `node scripts/verify-static.mjs`. O script aceita o endereço local e, opcionalmente, o URL canónico esperado.
