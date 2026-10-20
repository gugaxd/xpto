import type { T } from "@/i18n/lang";

/**
 * Textos do site. Edite aqui — os componentes só leem.
 * Cada texto tem versão em português (pt) e inglês (en).
 */

export const mascotName = "Gugabyte";

export const arcade = {
  eyebrow: { pt: "gustavoh.dev · arcade", en: "gustavoh.dev · arcade" },
  title: { pt: "Portfólio de um designer que", en: "Portfolio of a designer who" } satisfies T,
  titleAccent: { pt: "programa.", en: "codes." } satisfies T,
  enter: { pt: "Entrar", en: "Enter" },
  credits: { pt: "créditos", en: "credits" },
  pressStart: { pt: "press start", en: "press start" },
  insertCoin: { pt: "insert coin", en: "insert coin" },
  marquee: "GUSTAVO H.",
};

export const hud = {
  sound: { pt: "som", en: "sound" },
  on: { pt: "on", en: "on" },
  off: { pt: "off", en: "off" },
  walkHint: { pt: "role pra andar ▸", en: "scroll to walk ▸" },
  left: { pt: "Andar pra esquerda", en: "Walk left" },
  right: { pt: "Andar pra direita", en: "Walk right" },
};

export const start = {
  eyebrow: { pt: "Gustavo H. · portfólio", en: "Gustavo H. · portfolio" },
  title: { pt: "De designer a", en: "From designer to" },
  titleAccent: { pt: "vibe coder.", en: "vibe coder." },
  /** cada item vira uma linha */
  sub: [
    { pt: "Hoje eu desenho, programo com IA e coloco no ar.", en: "These days I design, build with AI and ship it." },
    { pt: "O que você vai ver daqui pra frente foi feito assim.", en: "Everything ahead was made that way." },
  ],
};

export const origin = {
  title: { pt: "Uma curiosidade antiga.", en: "An old curiosity." },
  /** cada item vira uma linha */
  body: [
    { pt: "Sempre tive vontade de fazer sites e programar,", en: "I always wanted to build websites and code," },
    { pt: "mas nunca estudei pra isso.", en: "but I never studied it." },
  ],
  turn: {
    pt: "Com o avanço da IA, comecei a me aventurar na programação e a criar coisas que eu nunca tinha conseguido fazer antes.",
    en: "As AI got better, I started venturing into code and building things I could never make before.",
  },
  frameLabel: { pt: "design", en: "design" },
  codeLabel: { pt: "código", en: "code" },
};

export const method = {
  title: { pt: "Como eu construo", en: "How I build" },
  steps: [
    {
      name: { pt: "Ideia", en: "Idea" },
      text: { pt: "Tenho uma ideia e jogo no chatbot.", en: "I get an idea and throw it at a chatbot." },
    },
    {
      name: { pt: "Prompt", en: "Prompt" },
      text: { pt: "Escrevo o prompt como se fosse um briefing.", en: "I write the prompt as if it were a design brief." },
    },
    {
      name: { pt: "Iteração", en: "Iteration" },
      text: { pt: "A partir dele, vou pedindo alterações no site ou na ferramenta.", en: "From there, I keep asking for changes to the site or tool." },
    },
    {
      name: { pt: "Deploy", en: "Deploy" },
      text: { pt: "No ar, com link.", en: "Live, with a link." },
    },
  ],
};

export const projectsCopy = {
  title: { pt: "Projetos", en: "Projects" },
  sub: { pt: "Sites e ferramentas que já estão no ar.", en: "Sites and tools that are already live." },
  soon: { pt: "em breve", en: "coming soon" },
  emptySlot: { pt: "slot vazio", en: "empty slot" },
  open: { pt: "Abrir projeto", en: "Open project" },
};

export const sheet = {
  title: { pt: "Ficha do personagem", en: "Character sheet" },
  gearLabel: { pt: "equipamento", en: "gear" },
  statsLabel: { pt: "atributos", en: "stats" },
  gear: ["Figma", "Claude Code", "React", "TypeScript", "Tailwind", "Vercel"],
  /** valor de 0 a 10 */
  stats: [
    { name: { pt: "Design", en: "Design" }, value: 10 },
    { name: { pt: "Prompt", en: "Prompting" }, value: 9 },
    { name: { pt: "Front-end", en: "Front-end" }, value: 7 },
    { name: { pt: "Motion", en: "Motion" }, value: 8 },
    { name: { pt: "Paciência com bug", en: "Patience with bugs" }, value: 4 },
  ],
};

export const continueCopy = {
  title: "Continue?",
  sub: { pt: "Bora fazer o próximo juntos.", en: "Let's build the next one together." },
  gameOver: "Game over",
  joke: {
    pt: "…brincadeira. Escolhe um dos botões aqui embaixo ou volta pro começo.",
    en: "…just kidding. Pick one of the buttons below or go back to the start.",
  },
  restart: { pt: "Voltar pro começo", en: "Back to the start" },
};

/** Falas do mascote, uma por zona. Use \n pra quebrar a linha. */
export const lines: Record<string, T> = {
  start: { pt: "oi! eu sou o gugabyte. scrolle a página para eu me movimentar pelo level.", en: "hi! i'm gugabyte. scroll the page to move me through the level." },
  origin: { pt: "o gustavo sempre quis programar.\nfaltava o empurrão.", en: "gustavo always wanted to code.\nhe just needed a push." },
  method: { pt: "esse é o caminho que ele faz em todo projeto.", en: "this is the path he takes on every project." },
  projects: { pt: "os projetos ainda estão carregando. volta logo!", en: "projects are still loading. come back soon!" },
  projectsReady: { pt: "loot! clica num gabinete aceso pra abrir o projeto.", en: "loot! click a lit cabinet to open the project." },
  sheet: { pt: "ficha do personagem.\nnão repara no último atributo.", en: "character sheet.\ndon't mind the last stat." },
  continue: { pt: "continue? a próxima fase pode ser a sua.", en: "continue? the next level could be yours." },
};
