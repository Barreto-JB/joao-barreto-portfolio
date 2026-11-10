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

O ficheiro [`src/data/portfolio.ts`](src/data/portfolio.ts) reúne o perfil, a biografia bilingue, o email, o CV, as redes sociais, os projetos, o percurso e a stack.

- Coloca o avatar, o CV e as capturas aprovadas em `public/`. Usa caminhos como `'media/cv.pdf'` e `'media/escalas.webp'`. Ao adicionar uma captura, atualiza o texto alternativo em PT e EN.
- Preenche `email` e `socials` com os teus contactos públicos. O site apresenta as respetivas ações quando os dados existem.
- Preenche `status`, `technologies` e `links` dos projetos com dados confirmados. As três imagens iniciais são ilustrações conceptuais. Para a trajetória, usa datas ISO (`AAAA`, `AAAA-MM` ou `AAAA-MM-DD`).
- As traduções da interface estão em [`src/i18n/translations.ts`](src/i18n/translations.ts). Os metadados em português estão em [`index.html`](index.html). A imagem de partilha está em `public/partilha.png`.

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
- [Licença SIL Open Font License de Space Mono](src/assets/fonts/OFL.txt)
