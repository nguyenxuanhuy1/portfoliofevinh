// hooks/useAdminProfile.ts
import { useState, useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAdminProfileQuery, ADMIN_PROFILE_KEY } from '../../../../hooks/useAdminProfileQuery'
import type { AdminProfileFormData } from '../../../../types/AdminProfile'
import adminProfileService from '../service/adminProfileService'

export function useAdminProfile() {
  const queryClient = useQueryClient()
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const { profile, loading, refetch } = useAdminProfileQuery()

  const { mutateAsync, isPending: saving } = useMutation({
    mutationFn: (data: AdminProfileFormData) => {
      if (profile?.id) {
        return adminProfileService.update(profile.id, data)
      }
      return adminProfileService.create(data)
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(ADMIN_PROFILE_KEY, updated)
      setSuccessMsg(profile?.id ? 'Cập nhật hồ sơ thành công!' : 'Tạo hồ sơ thành công!')
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Có lỗi xảy ra, vui lòng thử lại.'
      setError(msg)
    },
  })

  const fetchProfile = useCallback(async () => {
    await refetch()
  }, [refetch])

  const saveProfile = useCallback(async (data: AdminProfileFormData) => {
    setError(null)
    setSuccessMsg(null)
    await mutateAsync(data)
  }, [mutateAsync])

  const clearMessages = useCallback(() => {
    setError(null)
    setSuccessMsg(null)
  }, [])

  return { profile, loading, saving, error, successMsg, fetchProfile, saveProfile, clearMessages }
}