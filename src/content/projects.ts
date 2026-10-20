import type { T } from "@/i18n/lang";

export type Project = {
  title: string;
  /** pra quem foi feito (opcional) */
  client?: string;
  description: T;
  url: string;
  /** caminho de uma imagem em /public, ex.: "/projects/meu-site.jpg" */
  image?: string;
  /** palavras-chave (não aparecem no gabinete, servem pra organizar) */
  tags?: string[];
};

/**
 * Projetos que aparecem no corredor de gabinetes, na ordem da lista.
 * A descrição aparece embaixo da tela do gabinete, então mantenha curta.
 */
export const projects: Project[] = [
  {
    title: "the hub",
    description: { pt: "8 ferramentas de design no navegador", en: "8 browser-based design tools" },
    url: "https://gh-the-hub.vercel.app/",
    image: "/projects/the-hub.jpg",
    tags: ["grid maker", "bento maker", "gradient maker", "3d maker", "texture prompts", "wireframe maker", "logo resizer", "font defining"],
  },
];

/** O corredor sempre tem pelo menos esse número de gabinetes; os que sobram aparecem "em breve". */
export const placeholderSlots = 3;
