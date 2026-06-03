import { useState, useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Skill, SkillFormData } from '../../../../../portfolio/types/Skill'
import skillService from '../service/skillService'
import { SKILLS_KEY } from '../../../../../portfolio/hooks/useSkillsQuery'

interface UseSkillsReturn {
  saving: boolean
  deleting: string | null
  error: string | null
  successMsg: string | null
  createSkill: (data: SkillFormData) => Promise<boolean>
  updateSkill: (id: string, data: SkillFormData) => Promise<boolean>
  deleteSkill: (id: string) => Promise<void>
  clearMessages: () => void
}

export function useSkills(): UseSkillsReturn {
  const queryClient = useQueryClient()

  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const createMutation = useMutation({
    mutationFn: (data: SkillFormData) => skillService.create(data),

    onSuccess: (created) => {
      queryClient.setQueryData<Skill[]>(SKILLS_KEY, (old = []) => [
        created,
        ...old,
      ])
      queryClient.invalidateQueries({ queryKey: SKILLS_KEY })

      setSuccessMsg(`Đã thêm skill "${created.name}" thành công!`)
    },

    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Có lỗi xảy ra.'
      setError(msg)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: SkillFormData }) =>
      skillService.update(id, data),

    onSuccess: (updated) => {
      queryClient.setQueryData<Skill[]>(SKILLS_KEY, (old = []) =>
        old.map((skill) => (skill.id === updated.id ? updated : skill))
      )
      queryClient.invalidateQueries({ queryKey: SKILLS_KEY })

      setSuccessMsg(`Đã cập nhật skill "${updated.name}" thành công!`)
    },

    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Có lỗi xảy ra.'
      setError(msg)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => skillService.delete(id),

    onSuccess: (_, id) => {
      queryClient.setQueryData<Skill[]>(SKILLS_KEY, (old = []) =>
        old.filter((skill) => skill.id !== id)
      )

      setSuccessMsg('Đã xóa skill thành công!')
    },

    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Có lỗi xảy ra.'
      setError(msg)
    },

    onSettled: () => {
      setDeleting(null)
    },
  })

  const createSkill = useCallback(
    async (data: SkillFormData): Promise<boolean> => {
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

  const updateSkill = useCallback(
    async (id: string, data: SkillFormData): Promise<boolean> => {
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

  const deleteSkill = useCallback(
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
    createSkill,
    updateSkill,
    deleteSkill,
    clearMessages,
  }
}