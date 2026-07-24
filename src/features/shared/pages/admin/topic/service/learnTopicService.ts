import apiClient from '../../../../../../services/apiClient'
import type { LearnTopic, GradingResult } from '../../../../../learnEnglish/types/LearnEnglish'

import axiosInstance from '../../../../../../services/axiosInstance'

export const LEARN_TOPICS_KEY = ['learn-topics']

const learnTopicService = {
  async getAll(): Promise<LearnTopic[]> {
    return apiClient.get<LearnTopic[]>('/api/learn-topics')
  },

  async getById(id: string): Promise<LearnTopic> {
    return apiClient.get<LearnTopic>(`/api/learn-topics/${id}`)
  },

  async create(data: { name: string; data: any }): Promise<LearnTopic> {
    return apiClient.post<LearnTopic>('/api/learn-topics', data)
  },

  async update(id: string, data: { name: string; data: any }): Promise<LearnTopic> {
    return apiClient.put<LearnTopic>(`/api/learn-topics/${id}`, data)
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/learn-topics/${id}`)
  },

  async grade(id: string, userAnswers: any[]): Promise<GradingResult> {
    const tokens = JSON.parse(localStorage.getItem('learn_tokens') || '[]')
    const activeToken = tokens[0]?.value || ''
    
    // Sử dụng trực tiếp axiosInstance để truyền cấu hình timeout 60s
    return axiosInstance.post<any, any>(`/api/learn-topics/${id}/grade`, { 
      userAnswers,
      apiKey: activeToken 
    }, {
      timeout: 60000 // 60 giây cho AI chấm bài tập
    }).then(res => (res as any).data?.data || res) // Xử lý bóc tách an toàn nếu gọi trực tiếp
  }
}

export default learnTopicService
export type { LearnTopic, GradingResult }
