import { useQuery } from '@tanstack/react-query'
import learnTopicService, { LEARN_TOPICS_KEY } from '../features/admin/topic/service/learnTopicService'
import type { LearnTopic } from '../types/LearnEnglish'

export function useLearnTopicsQuery() {
  const {
    data = [],
    isLoading,
    isFetching,
    refetch,
  } = useQuery<LearnTopic[]>({
    queryKey: LEARN_TOPICS_KEY,
    queryFn: learnTopicService.getAll,
  })

  return {
    topics: data,
    loading: isLoading,
    fetching: isFetching,
    refetch,
  }
}

export function useLearnTopicByIdQuery(id: string | undefined) {
  const {
    data,
    isLoading,
    isFetching,
    refetch,
  } = useQuery<LearnTopic>({
    queryKey: [...LEARN_TOPICS_KEY, id],
    queryFn: () => learnTopicService.getById(id || ''),
    enabled: !!id,
  })

  return {
    topic: data,
    loading: isLoading,
    fetching: isFetching,
    refetch,
  }
}
