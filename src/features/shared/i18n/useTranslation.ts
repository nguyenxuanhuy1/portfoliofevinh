import { useLanguageStore } from '../../../store/languageStore'
import { vi } from './locales/vi'
import { en } from './locales/en'
import type { TranslationKeys } from './locales/vi'

const locales = {
  vi,
  en,
}

export function useTranslation() {
  const language = useLanguageStore((state) => state.language)

  const t = (key: keyof TranslationKeys): string => {
    const dictionary = locales[language] || locales.vi
    return dictionary[key] || key
  }

  return { t, language }
}
