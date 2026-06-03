import apiClient from '../../../../../../services/apiClient'
import type { Experience, ExperienceFormData } from '../../../../../portfolio/types/Experience'

export const EXPERIENCES_KEY = ['experiences']

const experienceService = {
  async getAll(): Promise<Experience[]> {
    return apiClient.get<Experience[]>('/api/get-all-experience')
  },

  async create(data: ExperienceFormData): Promise<Experience> {
    return apiClient.post<Experience>('/api/create-experience', data)
  },

  async update(id: string, data: ExperienceFormData): Promise<Experience> {
    return apiClient.post<Experience>(`/api/update-experience/${id}`, data)
  },

  async delete(id: string): Promise<void> {
    await apiClient.get(`/api/delete-experience/${id}`)
  },
}

export default experienceService
