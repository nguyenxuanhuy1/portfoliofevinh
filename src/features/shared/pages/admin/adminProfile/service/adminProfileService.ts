import apiClient from '../../../../../../services/apiClient'
import type { AdminProfile, AdminProfileFormData } from '../../../../types/AdminProfile'

const adminProfileService = {
  get(): Promise<AdminProfile> {
    return apiClient.get<AdminProfile>('/api/get-admin-profile')
  },

  create(data: AdminProfileFormData): Promise<AdminProfile> {
    return apiClient.post<AdminProfile>('/api/create-admin-profile', data)
  },

  update(id: string, data: Partial<AdminProfileFormData>): Promise<AdminProfile> {
    return apiClient.post<AdminProfile>(`/api/update-admin-profile/${id}`, data)
  },
}

export default adminProfileService
