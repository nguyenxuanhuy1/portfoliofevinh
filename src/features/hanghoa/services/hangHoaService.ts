import apiClient from '../../../services/apiClient'
import type { HangHoa, HangHoaFormData } from '../types'

function appendFormData(data: HangHoaFormData): FormData {
  const form = new FormData()
  form.append('category', String(data.category))
  form.append('name', String(data.name))
  form.append('recommendedPrice', String(data.recommendedPrice))
  form.append('isSpecial', String(Boolean(data.isSpecial)))

  if (data.isSpecial) {
    form.append('salePrice', String(data.salePrice ?? data.recommendedPrice))
    form.append('quantity', String(data.quantity ?? 0))
  } else {
    if (data.htmlContent !== undefined && data.htmlContent !== null) {
      form.append('htmlContent', data.htmlContent)
    }
    if (data.productLink !== undefined && data.productLink !== null) {
      form.append('productLink', data.productLink)
    }
    if (data.platformImage instanceof File) {
      form.append('platformImage', data.platformImage)
    }
  }

  if (data.image instanceof File) {
    form.append('image', data.image)
  }

  return form
}

const hangHoaService = {
  async getAll(category?: string): Promise<HangHoa[]> {
    const query = category ? `?category=${encodeURIComponent(category)}` : ''
    const data = await apiClient.get<HangHoa[]>(`/api/get-all-hanghoa${query}`)
    return data || []
  },

  async getById(id: string): Promise<HangHoa> {
    return apiClient.get<HangHoa>(`/api/get-hanghoa/${id}`)
  },

  async create(data: HangHoaFormData): Promise<HangHoa> {
    return apiClient.post<HangHoa>('/api/create-hanghoa', appendFormData(data))
  },

  async update(id: string, data: Partial<HangHoaFormData>): Promise<HangHoa> {
    const form = new FormData()

    if (data.category !== undefined) form.append('category', String(data.category))
    if (data.name !== undefined) form.append('name', String(data.name))
    if (data.recommendedPrice !== undefined) {
      form.append('recommendedPrice', String(data.recommendedPrice))
    }
    if (data.isSpecial !== undefined) form.append('isSpecial', String(Boolean(data.isSpecial)))
    if (data.salePrice !== undefined && data.salePrice !== null) {
      form.append('salePrice', String(data.salePrice))
    }
    if (data.quantity !== undefined) form.append('quantity', String(data.quantity))
    if (data.htmlContent !== undefined && data.htmlContent !== null) {
      form.append('htmlContent', data.htmlContent)
    }
    if (data.productLink !== undefined) {
      form.append('productLink', data.productLink ?? '')
    }
    if (data.image instanceof File) form.append('image', data.image)
    if (data.platformImage instanceof File) form.append('platformImage', data.platformImage)

    return apiClient.post<HangHoa>(`/api/update-hanghoa/${id}`, form)
  },

  async delete(id: string): Promise<void> {
    await apiClient.get(`/api/delete-hanghoa/${id}`)
  },
}

export default hangHoaService
