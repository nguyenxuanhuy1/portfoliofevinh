import apiClient from '../../../services/apiClient'
import axios from 'axios'

export interface ApiDocument {
  id: string
  title: string
  description?: string
  subject: string
  fileType?: string
  fileSize?: string
  downloadUrl: string | string[]
  mdDownloadUrl?: string
  downloads?: number
  views?: number
  author?: string
  tags?: string[]
  createdAt: string
  level?: number
}

export const congDongOnThiService = {
  /**
   * Fetches all exam documents from the backend API.
   */
  async getDocuments(): Promise<ApiDocument[]> {
    const data = await apiClient.get<ApiDocument[]>('/api/congdongonthi')
    return data || []
  },

  /**
   * Fetches a single document's metadata by ID.
   */
  async getDocumentById(id: string): Promise<ApiDocument> {
    const data = await apiClient.get<ApiDocument>(`/api/congdongonthi/${id}`)
    return data
  },

  /**
   * Fetches the subjects list.
   */
  async getSubjects(): Promise<string[]> {
    const data = await apiClient.get<string[]>('/api/congdongonthi/subjects')
    return data || []
  },

  /**
   * Increments the download counter for a document in the backend.
   */
  async incrementDownload(id: string): Promise<void> {
    await apiClient.get(`/api/congdongonthi/${id}/download`)
  },

  /**
   * Downloads a binary file as an ArrayBuffer.
   */
  async fetchFileArrayBuffer(url: string): Promise<ArrayBuffer> {
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    return response.data
  },

  /**
   * Fetches text content from a Cloudinary Markdown URL.
   */
  async fetchMarkdownContent(url: string): Promise<string> {
    const response = await axios.get(url)
    return typeof response.data === 'string' ? response.data : ''
  }
}
