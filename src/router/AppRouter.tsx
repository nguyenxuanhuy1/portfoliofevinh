import { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

import { routeConfig } from './routeConfig'
import { RouteGuard } from './RouteGuard'

import { ErrorBoundary } from '../components/error/ErrorBoundary'
import { PageError } from '../components/error/PageError'
import { LoadingSpinner } from '../components/ui/Loading/LoadingSpinner'
import { LayoutRenderer } from '../components/layouts/LayoutRenderer'

export function AppRouter() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <Routes>
        {routeConfig.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <ErrorBoundary fallback={<PageError />}>
                <RouteGuard route={route}>
                  <LayoutRenderer layout={route.layout}>
                    {route.element}
                  </LayoutRenderer>
                </RouteGuard>
              </ErrorBoundary>
            }
          />
        ))}
      </Routes>
    </Suspense>
  )
}
