import React, { useCallback } from "react";
import i18next, { type Resource } from "i18next";
import {
  initReactI18next,
  I18nextProvider,
  useTranslation,
  Trans,
} from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";

// Supported locales (BCP 47). Add one by dropping a folder of namespace JSON
// files (e.g. fr-FR/) and adding an entry here.
export type Locale = "en-US" | "nl-BE";

export type LocaleInfo = { id: Locale; label: string };

export const locales: LocaleInfo[] = [
  { id: "en-US", label: "English" },
  { id: "nl-BE", label: "Nederlands" },
];

const defaultLocale: Locale = "nl-BE";

// ---------------------------------------------------------------------------
// Resources: auto-discover every ./<locale>/<namespace>.json. Folder = locale,
// filename = i18next namespace. Drop a new module's JSON into each locale folder
// and it is registered automatically — no edits here.
// ---------------------------------------------------------------------------
const files = import.meta.glob("./*/*.json", {
  eager: true,
  import: "default",
}) as Record<string, Record<string, unknown>>;

const resources: Resource = {};
const namespaceSet = new Set<string>();

for (const path in files) {
  const match = path.match(/^\.\/([^/]+)\/([^/]+)\.json$/);
  if (!match) continue;
  const [, lng, ns] = match;
  namespaceSet.add(ns);
  resources[lng] ??= {};
  (resources[lng] as Record<string, unknown>)[ns] = files[path];
}

const namespaces = [...namespaceSet];

// Type guard for locales
function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && locales.some((l) => l.id === value);
}

// URL localization utilities
const extractLocale = (relURL: string) => {
  const pathComponents = relURL.split("/");
  if (isLocale(pathComponents[1])) {
    const locale = pathComponents[1] as Locale;
    pathComponents.splice(0, 2);
    return { locale, rest: `/${pathComponents.join("/")}` };
  }
  return { locale: null, rest: relURL };
};

export const localizeURL = (locale: string, relURL: string) => {
  const { rest } = extractLocale(relURL);
  return `/${locale}${rest}`;
};

export const delocalizeURL = (relURL: string) => {
  const { rest } = extractLocale(relURL);
  return rest;
};

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    detection: { order: ["path", "navigator"], lookupFromPathIndex: 0 },
    supportedLngs: locales.map((l) => l.id),
    resources,
    ns: namespaces,
    defaultNS: "common",
    // Non-exact browser languages (en-GB, nl-NL, …) fall back to this.
    fallbackLng: defaultLocale,
    interpolation: { escapeValue: false }, // React handles escaping
    react: { useSuspense: false },
    debug: false,
  });

export const I18nProvider = ({ children }: { children: React.ReactNode }) => (
  <I18nextProvider i18n={i18next}>{children}</I18nextProvider>
);

// Trans wrapper for rich (component-substituted) translations.
export const T = ({
  translationKey,
  ns,
  textSubstitutions,
  componentSubstitutions,
}: {
  translationKey: string;
  ns?: string;
  textSubstitutions?: Record<string, string>;
  componentSubstitutions?: Record<string, React.ReactElement>;
}) => (
  <Trans
    i18nKey={translationKey}
    ns={ns}
    values={textSubstitutions}
    components={componentSubstitutions}
  />
);

/**
 * Scoped translation hook. Pass a namespace to bind `t` to a module's keys:
 *   const { t } = useTranslate("cars");  // t("form.make")
 * Defaults to the "common" namespace.
 */
export const useTranslate = (ns: string = "common"): UseTranslateResult => {
  const { i18n, t } = useTranslation(ns);
  const resolved = i18n.resolvedLanguage ?? i18n.language;
  const locale: Locale = isLocale(resolved) ? resolved : defaultLocale;

  const changeLocale = useCallback(
    (next: string) => {
      void i18n.changeLanguage(next);
    },
    [i18n]
  );

  const tL = useCallback(
    (URL: string, localeId: string | undefined | null = undefined) => {
      if (localeId === undefined) return localizeURL(locale, URL);
      if (localeId === null) return delocalizeURL(URL);
      return localizeURL(localeId, URL);
    },
    [locale]
  );

  return { _i18n: i18next, t, T, tL, locale, changeLocale, locales };
};

export type UseTranslateResult = {
  /** Lookup a translation by key (scoped to the hook's namespace). */
  t: ReturnType<typeof useTranslation>["t"];
  /** Trans-based component for rich translations. */
  T: typeof T;
  /**
   * Localize an internal URL:
   * - localeId undefined -> current locale
   * - localeId provided  -> that locale
   * - localeId null       -> strip the locale
   */
  tL: (URL: string, localeId?: string | null) => string;
  /** The current locale (BCP 47). */
  locale: Locale;
  /** Switch the active locale. */
  changeLocale: (language: Locale) => void;
  /** All supported locales. */
  locales: LocaleInfo[];
  /** The raw i18next instance. */
  _i18n: typeof i18next;
};

// Keeps the URL locale segment and the i18n instance in sync.
export function PushLocaleToRoute() {
  const { maybeLang } = useParams();
  const { pathname, ...locationWithoutPathname } = useLocation();
  const { locale } = useTranslate();

  if (!maybeLang || !isLocale(maybeLang)) {
    return (
      <Navigate
        to={{ ...locationWithoutPathname, pathname: `/${locale}${pathname}` }}
        replace
      />
    );
  }

  if (maybeLang !== locale) {
    return (
      <Navigate
        to={{
          ...locationWithoutPathname,
          pathname: `/${locale}${pathname.replace(maybeLang + "/", "")}`,
        }}
        replace
      />
    );
  }

  return <Outlet />;
}
