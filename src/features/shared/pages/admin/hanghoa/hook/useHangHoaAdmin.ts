import { useState, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { HANG_HOA_KEY, useHangHoaMutations } from '../../../../../hanghoa/hooks/useHangHoa'
import type { HangHoaFormData } from '../../../../../hanghoa/types'

interface UseHangHoaAdminReturn {
  saving: boolean
  deleting: string | null
  error: string | null
  successMsg: string | null
  createHangHoa: (data: HangHoaFormData) => Promise<boolean>
  updateHangHoa: (id: string, data: HangHoaFormData) => Promise<boolean>
  deleteHangHoa: (id: string) => Promise<void>
  clearMessages: () => void
}

export function useHangHoaAdmin(): UseHangHoaAdminReturn {
  const queryClient = useQueryClient()
  const { createMutation, updateMutation, deleteMutation } = useHangHoaMutations()

  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const createHangHoa = useCallback(
    async (data: HangHoaFormData): Promise<boolean> => {
      setError(null)
      setSuccessMsg(null)
      try {
        const created = await createMutation.mutateAsync(data)
        setSuccessMsg(`Đã thêm hàng hóa "${created.name}" thành công!`)
        return true
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Có lỗi xảy ra.')
        return false
      }
    },
    [createMutation]
  )

  const updateHangHoa = useCallback(
    async (id: string, data: HangHoaFormData): Promise<boolean> => {
      setError(null)
      setSuccessMsg(null)
      try {
        const updated = await updateMutation.mutateAsync({ id, data })
        setSuccessMsg(`Đã cập nhật hàng hóa "${updated.name}" thành công!`)
        return true
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Có lỗi xảy ra.')
        return false
      }
    },
    [updateMutation]
  )

  const deleteHangHoa = useCallback(
    async (id: string) => {
      setDeleting(id)
      setError(null)
      setSuccessMsg(null)
      try {
        await deleteMutation.mutateAsync(id)
        await queryClient.invalidateQueries({ queryKey: HANG_HOA_KEY })
        setSuccessMsg('Đã xóa hàng hóa thành công!')
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Có lỗi xảy ra.')
      } finally {
        setDeleting(null)
      }
    },
    [deleteMutation, queryClient]
  )

  const clearMessages = useCallback(() => {
    setError(null)
    setSuccessMsg(null)
  }, [])

  return {
    saving: createMutation.isPending || updateMutation.isPending,
    deleting,
    error,
    successMsg,
    createHangHoa,
    updateHangHoa,
    deleteHangHoa,
    clearMessages,
  }
}
