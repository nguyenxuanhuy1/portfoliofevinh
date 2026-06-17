import type { LearnTopic } from '../types/LearnEnglish'

/**
 * Parses a topic's data to calculate the number of vocabulary items and exercises.
 * Handles both parsed object data and raw stringified JSON data.
 */
export function parseTopicStats(topic: LearnTopic) {
  if (!topic || !topic.data) {
    return { vocabCount: 0, exerciseCount: 0 }
  }

  let parsedData = topic.data
  if (typeof topic.data === 'string') {
    try {
      parsedData = JSON.parse(topic.data)
    } catch {
      return { vocabCount: 0, exerciseCount: 0 }
    }
  }

  const vocabCount = parsedData.vocabulary?.length || 0
  const exerciseCount = parsedData.exercises?.length || 0

  return {
    vocabCount,
    exerciseCount
  }
}
