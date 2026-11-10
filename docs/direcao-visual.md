# Direção visual

## Investigação

A referência usa uma coluna editorial centrada, uma dock fixa no topo e um caso de estudo com introdução, estados, imagens e detalhes expansíveis. No ecrã estreito, a dock mantém a estrutura horizontal e condensa os destinos. No código, `FloatingDock`, `WhatIBuild`, `HeaderProfile` e `NetworkBackground` separam navegação, projetos, perfil e Canvas. O contexto de idioma alimenta as secções em React.

[Referência visual](https://omlobao.github.io/#construo) · [Código-fonte da referência](https://github.com/omlobao/omlobao.github.io)

## Três propostas

| Proposta | Composição | Efeito |
| --- | --- | --- |
| Prancha técnica | Nome e mensagem à esquerda, monograma numa grelha à direita, caso principal panorâmico | Dá escala às imagens e cria uma assinatura gráfica para João Barreto |
| Índice editorial | Abertura alinhada a uma margem numerada, projetos em linhas densas, navegação vertical | Facilita a comparação rápida de um catálogo extenso |
| Consola modular | Painéis equilibrados, metadados em barras e navegação junto ao cabeçalho | Reforça a linguagem do terminal e aumenta a densidade visual |

A prancha técnica foi escolhida para dar presença ao nome e permitir que cada projeto tenha uma composição visual adequada ao seu formato. A dock fixa alinha-se com o cabeçalho no desktop. No telemóvel fica junto à base, com três atalhos e um menu para as restantes secções.

## Sistema

As cinco cores Midnight Teal definem fundo, superfícies, texto e interação. Space Mono 400 e 700 serve toda a interface. A escala de espaçamento parte de 4 px. A grelha visual usa traços finos, cantos de 8 a 16 px, sombras concentradas na navegação e transições de 140 a 360 ms. As composições de conteúdo mudam aos 640 e 1000 px. A navegação desktop surge aos 1000 px.

## Implementação e revisão

1. Centralizar conteúdos bilingues, metadados e recursos públicos. Verificar estados vazios e idiomas.
2. Compor a abertura, os três casos de estudo e as restantes secções. Verificar navegação por âncoras, expansão e teclado.
3. Aplicar os tokens, criar diagramas originais e adicionar Canvas com pausa. Verificar contraste, toque, redução de movimento e sete larguras.
4. Gerar HTML estático, testar a build de produção, rever capturas e documentar configuração e publicação.
