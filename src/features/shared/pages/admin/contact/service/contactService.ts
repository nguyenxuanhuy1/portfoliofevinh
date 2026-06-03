import apiClient from '../../../../../../services/apiClient'
import type { Contact, ContactFormData } from '../../../../../portfolio/types/Contact'

export const CONTACTS_KEY = ['contacts']

const contactService = {
  async getAll(): Promise<Contact[]> {
    return apiClient.get<Contact[]>('/api/get-all-contact')
  },

  async create(data: ContactFormData): Promise<Contact> {
    return apiClient.post<Contact>('/api/create-contact', data)
  },

  async update(id: string, data: ContactFormData): Promise<Contact> {
    return apiClient.post<Contact>(`/api/update-contact/${id}`, data)
  },

  async delete(id: string): Promise<void> {
    await apiClient.get(`/api/delete-contact/${id}`)
  },
}

export default contactService
