export interface Project {
  id: string
  name: string
  description: string
  image: string | null
  productLink: string | null
  githubLink: string | null
  createdAt?: string
  updatedAt?: string
}

export interface ProjectFormData {
  name: string
  description: string
  image?: File | string | null
  productLink?: string | null
  githubLink?: string | null
}
