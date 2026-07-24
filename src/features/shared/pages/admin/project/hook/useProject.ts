import { useState, useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Project, ProjectFormData } from '../../../../../portfolio/types/Project'
import projectService from '../service/projectService'
import { PROJECTS_KEY } from '../../../../../portfolio/hooks/useProjectQuery'

interface UseProjectReturn {
  saving: boolean
  deleting: string | null
  error: string | null
  successMsg: string | null
  createProject: (data: ProjectFormData) => Promise<boolean>
  updateProject: (id: string, data: ProjectFormData) => Promise<boolean>
  deleteProject: (id: string) => Promise<void>
  clearMessages: () => void
}

export function useProject(): UseProjectReturn {
  const queryClient = useQueryClient()

  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const createMutation = useMutation({
    mutationFn: (data: ProjectFormData) => projectService.create(data),

    onSuccess: (created) => {
      queryClient.setQueryData<Project[]>(PROJECTS_KEY, (old = []) => [
        created,
        ...old,
      ])
      queryClient.invalidateQueries({ queryKey: PROJECTS_KEY })

      setSuccessMsg(`Đã tạo dự án "${created.name}" thành công!`)
    },

    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Có lỗi xảy ra.'
      setError(msg)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProjectFormData }) =>
      projectService.update(id, data),

    onSuccess: (updated) => {
      queryClient.setQueryData<Project[]>(PROJECTS_KEY, (old = []) =>
        old.map((proj) => (proj.id === updated.id ? updated : proj))
      )
      queryClient.invalidateQueries({ queryKey: PROJECTS_KEY })

      setSuccessMsg(`Đã cập nhật dự án "${updated.name}" thành công!`)
    },

    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Có lỗi xảy ra.'
      setError(msg)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => projectService.delete(id),

    onSuccess: (_, id) => {
      queryClient.setQueryData<Project[]>(PROJECTS_KEY, (old = []) =>
        old.filter((proj) => proj.id !== id)
      )

      setSuccessMsg('Đã xóa dự án thành công!')
    },

    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Có lỗi xảy ra.'
      setError(msg)
    },

    onSettled: () => {
      setDeleting(null)
    },
  })

  const createProject = useCallback(
    async (data: ProjectFormData): Promise<boolean> => {
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

  const updateProject = useCallback(
    async (id: string, data: ProjectFormData): Promise<boolean> => {
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

  const deleteProject = useCallback(
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
    createProject,
    updateProject,
    deleteProject,
    clearMessages,
  }
}
