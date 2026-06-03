import apiClient from '../../../../../../services/apiClient'
import type { Project, ProjectFormData } from '../../../../../portfolio/types/Project'

const projectService = {
  async getAll(): Promise<Project[]> {
    return apiClient.get<Project[]>('/api/get-all-project')
  },

  async create(data: ProjectFormData): Promise<Project> {
    const form = new FormData()
    form.append('name', String(data.name))
    form.append('description', String(data.description))
    
    if (data.productLink) form.append('productLink', data.productLink)
    if (data.githubLink) form.append('githubLink', data.githubLink)
    
    if (data.image instanceof File) {
      form.append('image', data.image)
    } else if (typeof data.image === 'string') {
      form.append('image', data.image)
    }

    return apiClient.post<Project>('/api/create-project', form)
  },

  async update(id: string, data: ProjectFormData): Promise<Project> {
    const form = new FormData()
    form.append('name', String(data.name))
    form.append('description', String(data.description))
    
    if (data.productLink !== undefined) {
      form.append('productLink', data.productLink || '')
    }
    if (data.githubLink !== undefined) {
      form.append('githubLink', data.githubLink || '')
    }
    
    if (data.image instanceof File) {
      form.append('image', data.image)
    } else if (typeof data.image === 'string') {
      form.append('image', data.image)
    }

    return apiClient.post<Project>(`/api/update-project/${id}`, form)
  },

  async getByName(name: string): Promise<Project> {
    return apiClient.get<Project>(`/api/get-project/${encodeURIComponent(name)}`)
  },

  async delete(id: string): Promise<void> {
    await apiClient.get(`/api/delete-project/${id}`)
  },
}

export default projectService
