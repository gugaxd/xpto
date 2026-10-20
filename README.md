# gustavoh.dev — arcade

Portfólio em forma de fase de jogo. Abre num salão de arcade; ao clicar em **Entrar**, a câmera mergulha na tela do gabinete e o scroll passa a mover o Gugabyte pra direita.

## Rodar

```bash
npm install
npm run dev
```

Produção: `npm run build` (gera `dist/`).

## Onde editar

| O quê | Arquivo |
|---|---|
| Textos (PT/EN) e falas do mascote | `src/content/site.ts` |
| Projetos do corredor de gabinetes | `src/content/projects.ts` |
| Links de contato | `src/content/contact.ts` |
| Cores (paleta Fósforo) | `src/index.css` (`:root`) |
| Largura das zonas e posição do personagem | `src/components/game/layout.ts` |

Enquanto `projects` estiver vazio, aparecem 3 gabinetes "em breve" (`placeholderSlots`).

## Componentes externos

O projeto segue o formato shadcn/ui (`components.json`, alias `@/`), então dá pra trazer componentes de fora:

- **21st.dev:** `npx shadcn@latest add "<url do componente>"`. Cai em `src/components/ui/`.
- **Origin Kit:** copie o código React/TSX do componente para `src/components/ui/` e instale as dependências que ele pedir.

Os tokens do shadcn (`--primary`, `--background`, `--border`…) já apontam pra paleta, então os componentes chegam nas cores do site.

## Estrutura

- `src/components/arcade/` — tela de entrada e zoom
- `src/components/game/` — fase, personagem, HUD, diálogo, céu
- `src/components/game/zones/` — conteúdo de cada zona
- `src/audio/sfx.ts` — sons 8-bit sintetizados (sem arquivos de áudio)
- `src/i18n/lang.tsx` — troca PT/EN
