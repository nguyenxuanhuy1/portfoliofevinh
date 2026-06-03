export interface ReadingPassage {
  title: string
  content: string
}

export interface VocabularyItem {
  word: string
  vietnamese: string
  example: string
}

export interface MatchingQuestion {
  id: number
  word: string
  options: string[]
  answer: string
}

export interface MultipleChoiceQuestion {
  id: number
  question: string
  options: Record<string, string>
  answer: string
  explanation?: string
}

export interface FillWithBankQuestion {
  id: number
  sentence: string
  answer: string
}

export interface TranslateToEnglishQuestion {
  id: number
  vietnamese: string
  answer: string
  hint: string
}

export interface DefinitionToWordQuestion {
  id: number
  definition: string
  answer: string
  hint: string
}

export interface ErrorCorrectionQuestion {
  id: number
  wrong_sentence: string
  correct_sentence: string
  explanation: string
}

export interface OpenEndedQuestion {
  id: number
  question: string
  suggested_answer: string
  keywords: string[]
}

export type ExerciseType =
  | 'matching'
  | 'multiple_choice'
  | 'fill_with_bank'
  | 'translate_to_english'
  | 'definition_to_word'
  | 'error_correction'
  | 'open_ended'

export interface Exercise {
  tier: number
  type: ExerciseType
  goal: string
  instruction: string
  word_bank?: string[]
  questions: any[] // Dynamic based on type
}

export interface LearnTopicData {
  topic: string
  reading_passage: ReadingPassage
  vocabulary: VocabularyItem[]
  exercises: Exercise[]
  summary: {
    key_vocabulary: Array<{ english: string; vietnamese: string }>
    grammar_notes: string[]
    common_mistakes: string[]
  }
  improvement_suggestions: Array<{
    method: string
    description: string
    how_to_apply: string
  }>
}

export interface LearnTopic {
  id: string
  name: string
  data: LearnTopicData
  createdAt: string
  updatedAt: string
}

export interface QuestionGrading {
  id: number
  correct: boolean
  user_answer: string
  correct_answer: string
  feedback: string
}

export interface ExerciseGrading {
  type: ExerciseType
  score: number
  feedback: string
  questions: QuestionGrading[]
}

export interface GradingResult {
  total_score: number
  overall_feedback: string
  exercises: ExerciseGrading[]
}

export type TopicProgressStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'

export interface TopicProgress {
  topicId: string
  status: TopicProgressStatus
  answers: Array<{
    type: ExerciseType
    answers: Record<string, string> // maps questionId.toString() to user's answer string
  }>
  score?: number
  gradingResult?: GradingResult
}
