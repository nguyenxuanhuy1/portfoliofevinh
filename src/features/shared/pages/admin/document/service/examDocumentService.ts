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
  }, mdFile?: File | null): Promise<any> {
    const form = new FormData()
    form.append('document', file)
    if (mdFile) {
      form.append('mdFile', mdFile)
    }
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
  }, documentFile?: File | null, mdFile?: File | null): Promise<any> {
    const form = new FormData()
    if (documentFile) {
      form.append('document', documentFile)
    }
    if (mdFile) {
      form.append('mdFile', mdFile)
    }
    
    if (metadata.title !== undefined) form.append('title', metadata.title)
    if (metadata.description !== undefined) form.append('description', metadata.description)
    if (metadata.subject !== undefined) form.append('subject', metadata.subject)
    if (metadata.tags !== undefined) form.append('tags', JSON.stringify(metadata.tags))
    if (metadata.level !== undefined) form.append('level', String(metadata.level))

    return apiClient.post<any>(`/api/congdongonthi/${id}`, form)
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/congdongonthi/${id}`)
  }
}

export default examDocumentService
