// hooks/useAdminProfileQuery.ts
import { useQuery } from '@tanstack/react-query'
import adminProfileService from '../pages/admin/adminProfile/service/adminProfileService'
import type { AdminProfile } from '../types/AdminProfile'

export const ADMIN_PROFILE_KEY = ['adminProfile'] as const

export function useAdminProfileQuery() {
  const { data: profile = null, isLoading: loading, refetch } = useQuery<AdminProfile | null>({
    queryKey: ADMIN_PROFILE_KEY,
    queryFn: () => adminProfileService.get(),
  })

  return { profile, loading, refetch }
}