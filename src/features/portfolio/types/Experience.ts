export interface Experience {
  id: string
  name: string
  description: string
  startDate: string
  endDate?: string | null
  createdAt?: string
  updatedAt?: string
}

export interface ExperienceFormData {
  name: string
  description: string
  startDate: string
  endDate?: string | null
}
