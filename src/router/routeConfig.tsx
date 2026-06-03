import { portfolioRoutes } from '../features/portfolio/router/routes'
import { learnEnglishRoutes } from '../features/learnEnglish/router/routes'
import { sharedRoutes } from '../features/shared/router/routes'
import type { AppRoute } from '../features/shared/types/Layout'

/**
 * Global Routing Configuration of the Application.
 * Merges configurations from different feature areas: Portfolio, Learn English, and Shared/Common.
 */
export const routeConfig: AppRoute[] = [
  ...portfolioRoutes,
  ...learnEnglishRoutes,
  ...sharedRoutes,
]
