import { useQuery } from '@tanstack/react-query'
import type { Experience } from '../types/Experience'
import experienceService, { EXPERIENCES_KEY } from '../../shared/pages/admin/experience/service/experienceService'

export function useExperienceQuery() {
  const {
    data = [],
    isLoading,
    isFetching,
    refetch,
  } = useQuery<Experience[]>({
    queryKey: EXPERIENCES_KEY,
    queryFn: experienceService.getAll,
  })

  return {
    experiences: data,
    loading: isLoading,
    fetching: isFetching,
    refetch,
  }
}
