# João Barreto · Portefólio

Portefólio estático em React, TypeScript e Vite. Inclui sete secções, PT-PT e EN, casos de estudo expansíveis, hora de Portugal continental, Canvas com pausa e Space Mono alojada localmente.

## Executar

Requer Node.js 20.19+ na série 20, ou 22.12+.

```sh
npm ci
npm run dev
```

Gera e verifica os ficheiros estáticos em `dist/` com estes comandos.

```sh
npm run build
npm run preview
```

Instala o Chromium do Playwright e executa os testes.

```sh
npx playwright install chromium
npm test
```

## Editar o conteúdo

- O avatar, as redes sociais e o cartão ForLife estão em [`src/data/portfolio.ts`](src/data/portfolio.ts). Os quatro casos de estudo principais estão em [`src/data/projects.ts`](src/data/projects.ts).
- Os contactos e o PDF do currículo são configurados em [`src/data/contact.ts`](src/data/contact.ts). Coloca o PDF original e as capturas aprovadas em `public/media/`. Preenche o texto alternativo das capturas em PT e EN.
- Os grupos de tecnologias estão em [`src/data/technology.ts`](src/data/technology.ts). Os logótipos são locais e têm [atribuição e licença](src/assets/technology).
- Os textos de início, percurso e apresentação estão em [`src/i18n/journey.ts`](src/i18n/journey.ts). Os textos da interface estão em [`src/i18n/translations.ts`](src/i18n/translations.ts) e os metadados iniciais em [`index.html`](index.html).

## Publicar

### Cloudflare Pages

1. Cria um projeto de Pages com integração Git e seleciona o repositório.
2. Define `npm run build` como comando de build e `dist` como pasta de saída. Usa Node.js 22.12+ no ambiente de build.
3. Define `VITE_SITE_URL` com o endereço público completo e volta a gerar a build. Isto ativa o URL canónico, a imagem de partilha e o sitemap. Para um carregamento direto, configura o URL em `.env.local`, executa a build e carrega `dist`.

[Documentação de Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-a-react-site/)

### GitHub Pages

1. Em **Settings → Pages**, seleciona **GitHub Actions** como origem.
2. Em **Actions**, abre **Publicar no GitHub Pages** e escolhe **Run workflow** na branch `main`. O workflow gera e publica `dist`.
3. O workflow usa o endereço e a subpasta fornecidos pelo GitHub Pages para configurar os recursos, o URL canónico e o sitemap.

[Guia de publicação do Vite para GitHub Pages](https://vite.dev/guide/static-deploy.html#github-pages)

## Direção visual e validação

- [Investigação e direção visual](docs/direcao-visual.md)
- [Capturas e resultados dos testes](docs/validacao.md)
- [Auditoria editorial da atualização v2](docs/editorial-audit.md)
- [Licença SIL Open Font License de Space Mono](src/assets/fonts/OFL.txt)
