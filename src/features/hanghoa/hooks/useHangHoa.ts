import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import hangHoaService from '../services/hangHoaService'
import type { HangHoa, HangHoaFormData } from '../types'

export const HANG_HOA_KEY = ['hanghoa']

export function useGetHangHoaList(category?: string) {
  return useQuery<HangHoa[]>({
    queryKey: [...HANG_HOA_KEY, category ?? 'all'],
    queryFn: () => hangHoaService.getAll(category),
  })
}

export function useGetHangHoaById(id?: string) {
  return useQuery<HangHoa>({
    queryKey: [...HANG_HOA_KEY, 'detail', id],
    queryFn: () => {
      if (!id) throw new Error('Hang hoa ID is required')
      return hangHoaService.getById(id)
    },
    enabled: !!id,
  })
}

export function useHangHoaMutations() {
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: (data: HangHoaFormData) => hangHoaService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HANG_HOA_KEY })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<HangHoaFormData> }) =>
      hangHoaService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HANG_HOA_KEY })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => hangHoaService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HANG_HOA_KEY })
    },
  })

  return { createMutation, updateMutation, deleteMutation }
}
