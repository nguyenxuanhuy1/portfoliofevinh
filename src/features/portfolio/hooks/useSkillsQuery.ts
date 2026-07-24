// hooks/useSkillsQuery.ts
import { useQuery } from '@tanstack/react-query'
import type { Skill } from '../types/Skill'
import skillService from '../../shared/pages/admin/skills/service/skillService'

export const SKILLS_KEY = ['skills']

export function useSkillsQuery() {
  const {
    data = [],
    isLoading,
    isFetching,
    refetch,
  } = useQuery<Skill[]>({
    queryKey: SKILLS_KEY,
    queryFn: skillService.getAll,
  })

  return {
    skills: data,
    loading: isLoading,
    fetching: isFetching,
    refetch,
  }
}