import { useQuery } from '@tanstack/react-query'
import type { Project } from '../types/Project'
import projectService from '../../shared/pages/admin/project/service/projectService'

export const PROJECTS_KEY = ['projects']

export function useProjectQuery() {
  const {
    data = [],
    isLoading,
    isFetching,
    refetch,
  } = useQuery<Project[]>({
    queryKey: PROJECTS_KEY,
    queryFn: projectService.getAll,
  })

  return {
    projects: data,
    loading: isLoading,
    fetching: isFetching,
    refetch,
  }
}
