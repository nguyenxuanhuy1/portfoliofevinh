export type WorkStatus = 'READY' | 'NOT_READY'

export interface AdminProfile {
  id: string
  name: string
  position: string
  bio: string
  skills: string[]
  workStatus: WorkStatus
  createdAt?: string
  updatedAt?: string
}

export interface AdminProfileFormData {
  name: string
  position: string
  bio: string
  skills: string[]
  workStatus: WorkStatus
}
