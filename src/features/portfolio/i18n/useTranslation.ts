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

  const t = (key: keyof TranslationKeys, interpolation?: { count?: number }): string => {
    const dictionary = locales[language] || locales.vi
    let value = dictionary[key] || key
    if (interpolation && interpolation.count !== undefined) {
      value = value.replace('{count}', interpolation.count.toString())
    }
    return value
  }

  return { t, language }
}
