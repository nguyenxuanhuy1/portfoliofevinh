export interface Skill {
  id: string
  name: string
  image: string | null
  createdAt?: string
  updatedAt?: string
}

export interface SkillFormData {
  name: string
  image?: File | null
}
