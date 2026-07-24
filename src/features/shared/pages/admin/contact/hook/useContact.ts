import { useState, useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Contact, ContactFormData } from '../../../../../portfolio/types/Contact'
import contactService, { CONTACTS_KEY } from '../service/contactService'

interface UseContactReturn {
  saving: boolean
  deleting: string | null
  error: string | null
  successMsg: string | null
  createContact: (data: ContactFormData) => Promise<boolean>
  updateContact: (id: string, data: ContactFormData) => Promise<boolean>
  deleteContact: (id: string) => Promise<void>
  clearMessages: () => void
}

export function useContact(): UseContactReturn {
  const queryClient = useQueryClient()

  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const createMutation = useMutation({
    mutationFn: (data: ContactFormData) => contactService.create(data),

    onSuccess: (created) => {
      queryClient.setQueryData<Contact[]>(CONTACTS_KEY, (old = []) => [
        created,
        ...old,
      ])
      queryClient.invalidateQueries({ queryKey: CONTACTS_KEY })

      setSuccessMsg(`Đã thêm liên hệ "${created.name}" thành công!`)
    },

    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Có lỗi xảy ra.'
      setError(msg)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ContactFormData }) =>
      contactService.update(id, data),

    onSuccess: (updated) => {
      queryClient.setQueryData<Contact[]>(CONTACTS_KEY, (old = []) =>
        old.map((c) => (c.id === updated.id ? updated : c))
      )
      queryClient.invalidateQueries({ queryKey: CONTACTS_KEY })

      setSuccessMsg(`Đã cập nhật liên hệ "${updated.name}" thành công!`)
    },

    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Có lỗi xảy ra.'
      setError(msg)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => contactService.delete(id),

    onSuccess: (_, id) => {
      queryClient.setQueryData<Contact[]>(CONTACTS_KEY, (old = []) =>
        old.filter((c) => c.id !== id)
      )
      queryClient.invalidateQueries({ queryKey: CONTACTS_KEY })

      setSuccessMsg('Đã xóa liên hệ thành công!')
    },

    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Có lỗi xảy ra.'
      setError(msg)
    },

    onSettled: () => {
      setDeleting(null)
    },
  })

  const createContact = useCallback(
    async (data: ContactFormData): Promise<boolean> => {
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

  const updateContact = useCallback(
    async (id: string, data: ContactFormData): Promise<boolean> => {
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

  const deleteContact = useCallback(
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
    createContact,
    updateContact,
    deleteContact,
    clearMessages,
  }
}
