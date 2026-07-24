import { useState, useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Experience, ExperienceFormData } from '../../../../../portfolio/types/Experience'
import experienceService, { EXPERIENCES_KEY } from '../service/experienceService'

interface UseExperienceReturn {
  saving: boolean
  deleting: string | null
  error: string | null
  successMsg: string | null
  createExperience: (data: ExperienceFormData) => Promise<boolean>
  updateExperience: (id: string, data: ExperienceFormData) => Promise<boolean>
  deleteExperience: (id: string) => Promise<void>
  clearMessages: () => void
}

export function useExperience(): UseExperienceReturn {
  const queryClient = useQueryClient()

  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const createMutation = useMutation({
    mutationFn: (data: ExperienceFormData) => experienceService.create(data),

    onSuccess: (created) => {
      queryClient.setQueryData<Experience[]>(EXPERIENCES_KEY, (old = []) => [
        created,
        ...old,
      ])
      queryClient.invalidateQueries({ queryKey: EXPERIENCES_KEY })

      setSuccessMsg(`Đã thêm kinh nghiệm "${created.name}" thành công!`)
    },

    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Có lỗi xảy ra.'
      setError(msg)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ExperienceFormData }) =>
      experienceService.update(id, data),

    onSuccess: (updated) => {
      queryClient.setQueryData<Experience[]>(EXPERIENCES_KEY, (old = []) =>
        old.map((exp) => (exp.id === updated.id ? updated : exp))
      )
      queryClient.invalidateQueries({ queryKey: EXPERIENCES_KEY })

      setSuccessMsg(`Đã cập nhật kinh nghiệm "${updated.name}" thành công!`)
    },

    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Có lỗi xảy ra.'
      setError(msg)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => experienceService.delete(id),

    onSuccess: (_, id) => {
      queryClient.setQueryData<Experience[]>(EXPERIENCES_KEY, (old = []) =>
        old.filter((exp) => exp.id !== id)
      )

      setSuccessMsg('Đã xóa kinh nghiệm thành công!')
    },

    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Có lỗi xảy ra.'
      setError(msg)
    },

    onSettled: () => {
      setDeleting(null)
    },
  })

  const createExperience = useCallback(
    async (data: ExperienceFormData): Promise<boolean> => {
      setError(null)
      setSuccessMsg(null)

      try {
        await createMutation.mutateAsync(data)
        return true
      } catch {
        return false
      }
    },
    [createMutation]
  )

  const updateExperience = useCallback(
    async (id: string, data: ExperienceFormData): Promise<boolean> => {
      setError(null)
      setSuccessMsg(null)

      try {
        await updateMutation.mutateAsync({ id, data })
        return true
      } catch {
        return false
      }
    },
    [updateMutation]
  )

  const deleteExperience = useCallback(
    async (id: string) => {
      setDeleting(id)
      setError(null)
      setSuccessMsg(null)

      await deleteMutation.mutateAsync(id)
    },
    [deleteMutation]
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
    createExperience,
    updateExperience,
    deleteExperience,
    clearMessages,
  }
}
