import apiClient from '../../../../../../services/apiClient'
import type { Skill } from '../../../../../portfolio/types/Skill'

const skillService = {
  async getAll(): Promise<Skill[]> {
    return apiClient.get<Skill[]>('/api/get-all-skill')
  },

  async create(data: { name: string; image?: File | null }): Promise<Skill> {
    const form = new FormData()
    form.append('name', String(data.name))
    if (data.image) form.append('image', data.image)

    return apiClient.post<Skill>('/api/create-skill', form)
  },

  async update(id: string, data: { name?: string; image?: File | null }): Promise<Skill> {
    const form = new FormData()
    if (data.name !== undefined) form.append('name', String(data.name))
    if (data.image) form.append('image', data.image)

    return apiClient.post<Skill>(`/api/update-skill/${id}`, form)
  },

  async delete(id: string): Promise<void> {
    await apiClient.get(`/api/delete-skill/${id}`)
  },
}

export default skillService