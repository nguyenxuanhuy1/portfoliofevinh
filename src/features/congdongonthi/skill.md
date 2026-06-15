# AI Code Generation Skill & Guidelines for Frontend (FE)

> [!IMPORTANT]
> This is a mandatory instruction file (Skill File) for all AI assistants working on the frontend (`fe/`) of the Portfolio project. You must strictly adhere to the guidelines, architectures, and patterns defined below.

---

## 1. Feature Architecture Pattern (Feature-Sliced/Modular Structure)
Every feature under `fe/src/features/` (e.g., `learnEnglish`, `portfolio`, `congdongonthi`) must follow a strict modular folder structure:

```text
features/<feature-name>/
├── components/         # Feature-specific UI components
├── hooks/              # Feature-specific hooks (Queries, Mutations)
├── pages/              # Main page views (containers)
├── router/
│   └── routes.tsx      # Feature routes definition (using AppRoute type)
├── style/
│   └── index.scss      # SCSS styling specific to the feature
├── types/
│   └── index.ts        # TypeScript interfaces and types for the feature
└── utils/              # Feature-specific utility functions
```

### Rules:
1. **Never** mix components from one feature directly into another. Use `features/shared/` or global components in `fe/src/components/` if sharing is needed.
2. **Lazy Load Pages**: All components loaded by routes must be lazy-loaded in `router/routes.tsx` using `React.lazy`.

---

## 2. Component Development & UI Reusability
Before creating any custom button, input, modal, or table, check the global UI components in `fe/src/components/ui/`:
- **Path**: `fe/src/components/ui/`
- **Available Components**: `Button`, `Input`, `Form`, `Modal`, `Alert`, `Loading`, `Skeleton`, `Dropdown`, `Pagination`, `Steps`, `Table`.

### Rules:
1. **UI Component Inheritance & Scoping**:
   - For all UI needs, inherit from the global UI components in `fe/src/components/ui/`.
   - Re-write/wrap these inherited components inside `features/congdongonthi/components/ui/` to enforce the new Academic Library styling (e.g., custom border-radius, color settings, shadow-free state).
   - Use these newly wrapped UI components from `features/congdongonthi/components/ui/` in pages and components of this feature.
   - If other parts of the web application need this academic/minimalist aesthetic, they should import and share these scoped components directly from `features/congdongonthi/components/ui/`.
2. **Icons**: Use `@ant-design/icons` for icons. Do not import raw SVG strings directly unless custom icons are required.
3. **No Direct DOM Style Manipulation**: Always handle state-based style modifications using CSS classes or CSS variables.
---

## 3. Styling & Theming Guidelines
This application uses **Vanilla SCSS/CSS** with **CSS Variables** for light/dark mode compatibility.
- Global theme variables are defined in `fe/src/index.css`.
- Feature-specific styles go into `features/<feature-name>/style/index.scss` and are imported into pages.

### Rules:
1. **CSS Variables Only**: Never hardcode colors (like `#ffffff` or `red`) in component inline styles or SCSS. Use the theme variables:
   - Text colors: `var(--color-text)`, `var(--color-text-secondary)`, `var(--color-text-muted)`
   - Backgrounds: `var(--color-bg)`, `var(--color-card-bg)`
   - Borders: `var(--color-card-border)`
   - Accents: `var(--color-primary)`, `var(--color-primary-hover)`
   - Transitions: `var(--transition-fast)`, `var(--transition-normal)`
2. **BEM Naming Convention**: Class names in SCSS must follow BEM:
   ```scss
   .feature-name {
     &__element {
       color: var(--color-text);
       
       &--modifier {
         color: var(--color-primary);
       }
     }
   }
   ```
3. **Inline Styles**: Avoid inline styles unless setting dynamic values (e.g. animation delays, heights computed via JS).

---

## 4. API Request & Data Fetching (React Query)
The project uses `@tanstack/react-query` to manage server state.
- **Client**: `fe/src/services/apiClient.ts` or `fe/src/services/axiosInstance.ts`

### Rules:
1. **No direct fetch/axios inside components**: Do not run fetch requests inside `useEffect` or component render cycles.
2. **Create custom hooks**: Put all fetching logic in custom hooks inside `features/<feature-name>/hooks/`.
   - **Query Keys**: Use consistent array-based keys exported as constants.
   - **Query Hook Template**:
     ```typescript
     import { useQuery } from '@tanstack/react-query'
     import myFeatureService from '../services/myFeatureService'
     
     export function useFeatureData() {
       return useQuery({
         queryKey: ['my-feature-key'],
         queryFn: myFeatureService.getAll,
       })
     }
     ```
3. **Service Layer**: Define your API requests in a service object using `apiClient`.

---

## 5. Routing Guidelines
Every feature route must be configured under `features/<feature-name>/router/routes.tsx` using the `AppRoute` schema from `features/shared/types/Layout`.

### Rules:
1. **Route Properties**:
   - `path`: URL pattern
   - `element`: Lazy-loaded component
   - `public`: boolean (whether public or auth-guarded)
   - `layout`: Layout type (`'auth' | 'public' | 'admin'`)
   - `label`: `{ vi: string; en: string }` translation object for menu items.
2. **Integration**: Always append new feature routes to `fe/src/router/routeConfig.tsx`.

---

## 6. TypeScript & Clean Code Practices
1. **Strict Types**: No usage of `any` without a clear comment explanation. Create descriptive interfaces in the `types/` directory.
2. **Clean Imports**:
   - React hooks and modules first.
   - External libraries next (e.g., React Router, Ant Icons).
   - Project-wide services/hooks/types.
   - Relative imports (e.g., local hooks, components).
   - Styles last.
3. **Component Structure**:
   - Export named functions or defaults clearly.
   - Place helper functions outside components if they don't depend on React state/props.
4. **State Management**: Keep states local unless shared across pages/features, in which case use React context or `store/` (Zustand/Redux if present).
