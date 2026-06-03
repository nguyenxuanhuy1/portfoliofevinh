export interface Contact {
  id: string
  name: string
  link: string
  createdAt?: string
  updatedAt?: string
}

export interface ContactFormData {
  name: string
  link: string
}
