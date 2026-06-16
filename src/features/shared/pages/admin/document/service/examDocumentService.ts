import apiClient from '../../../../../../services/apiClient'

const examDocumentService = {
  async getAll(): Promise<any[]> {
    return apiClient.get<any[]>('/api/congdongonthi')
  },

  async upload(file: File, metadata: {
    title: string
    description: string
    subject: string
    tags: string[]
    level: number
  }): Promise<any> {
    const form = new FormData()
    form.append('document', file)
    form.append('title', metadata.title)
    form.append('description', metadata.description)
    form.append('subject', metadata.subject)
    form.append('tags', JSON.stringify(metadata.tags))
    form.append('level', String(metadata.level))

    return apiClient.post<any>('/api/congdongonthi/upload', form)
  },

  async update(id: string, metadata: {
    title?: string
    description?: string
    subject?: string
    tags?: string[]
    level?: number
  }): Promise<any> {
    return apiClient.post<any>(`/api/congdongonthi/${id}`, metadata)
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/congdongonthi/${id}`)
  }
}

export default examDocumentService
