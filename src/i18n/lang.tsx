import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "pt" | "en";
/** Texto bilíngue. Todo conteúdo do site usa esse formato. */
export type T = Record<Lang, string>;

const KEY = "gh-lang";

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === "pt" || saved === "en") return saved;
  } catch {
    /* sem storage: segue pro idioma do navegador */
  }
  return navigator.language?.toLowerCase().startsWith("pt") ? "pt" : "en";
}

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (x: T) => string };
const LangContext = createContext<Ctx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(KEY, l);
    } catch {
      /* ignora */
    }
  }, []);

  const t = useCallback((x: T) => x[lang], [lang]);

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang precisa estar dentro de <LangProvider>");
  return ctx;
}
