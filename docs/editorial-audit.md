# Auditoria editorial da atualização v2

Usei a skill local `portfolio-editorial-review` do pacote e as instruções da Humanizer 4.0.0, instalada a partir do [repositório de blader](https://github.com/blader/humanizer). A primeira leitura cruzou as afirmações com o CV, o relato do autor, as capturas e os repositórios públicos. A segunda comparou PT-PT e EN e reviu frases promocionais, repetições, títulos, ações, estados, descrições alternativas e metadados.

## Percurso e apresentação

- O CV regista formação de programação na Tokio School de maio de 2024 a maio de 2025. O Dofus motivou o aprofundamento de Lua, AutoHotkey e C# no fim de 2025. A cronologia deixa os protótipos e a ajuda informal sem datas inventadas.
- A intenção de iniciar Engenharia Informática na ESTGV/IPV em 2027 é apresentada como objetivo. O exemplo Lua mostra uma mudança de estado numa tarefa fictícia.
- O início usa uma pergunta do autor e exemplos do trabalho que levaram a aplicações concretas. A versão inglesa usa a mesma cronologia e o mesmo grau de certeza.

## Projetos e privacidade

| Projeto | Fonte e decisão |
| --- | --- |
| Escala Inteligente | O relato e a captura confirmam o contexto dos dois PDFs, o calendário e a vista do dia. A descrição não atribui todo o processamento de PDF ao Apps Script nem promove funcionalidades do código privado por verificar. A captura «Hoje» foi recortada e os dados do próximo compromisso foram ocultados. A captura do calendário original ficou de fora porque mostra datas, horários e postos reais. A demonstração usa anexos, identificador e calendário fictícios. |
| PG Guia de Bolso | O [repositório](https://github.com/Barreto-JB/palacio-gelo-guia) confirma a PWA e o catálogo com 142 locais em `data.js`. O número não representa 142 lojas ativas. O [GitHub Pages](https://barreto-jb.github.io/palacio-gelo-guia/) abre sem autenticação. O endereço Cloudflare pede acesso e o endereço anterior no domínio `barretomen` devolve 404. As três capturas fornecidas aparecem por ordem de utilização. As plantas avulsas ficaram fora do site. |
| Registo Cais | O [repositório](https://github.com/Barreto-JB/registo-cais) documenta armazenamento local, exportação, offline e integração opcional com Supabase. A sincronização ativa não foi confirmada. A [aplicação publicada](https://barreto-jb.github.io/registo-cais/?v=a50799f) foi verificada sem submeter registos. A captura contém apenas separadores e contadores a zero. |
| Vitor Lior Performance | O [repositório](https://github.com/Barreto-JB/vitor-lior-performance) confirma Next.js, React, TypeScript, quatro etapas de diagnóstico e o encaminhamento para WhatsApp na versão estática. O [website](https://barreto-jb.github.io/vitor-lior-performance/) foi verificado sem usar o formulário. A descrição apresenta o trabalho como oferta a um amigo. |
| ForLife Cloud Wallet | O caso e o simulador anteriores mantêm-se em «Mais projetos». Pedidos, respostas e dados de acesso são fictícios. |

## Tecnologias e contacto

Tailwind CSS aparece no grupo do portefólio porque o plugin Vite e o import CSS estão em uso. Android saiu da lista quando a ficha provisória de acessos deu lugar ao Registo Cais, que é uma aplicação web. As restantes tecnologias aparecem no grupo correspondente aos projetos. Os logótipos têm nomes textuais e [atribuição local](../src/assets/technology).

O contacto apresenta WhatsApp, e-mail e download direto nas duas línguas. O PDF original conserva o cabeçalho «João Mendes». O nome mostrado no portefólio continua a ser «João Barreto».
