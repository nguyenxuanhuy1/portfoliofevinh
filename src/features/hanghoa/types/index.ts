export interface HangHoa {
  id: string
  category: string
  name: string
  image: string | null
  recommendedPrice: string | number
  platformImage: string | null
  htmlContent: string | null
  productLink: string | null
  isSpecial: boolean
  salePrice: string | number | null
  quantity: number
  createdAt: string
  updatedAt?: string
  // Optional display-only fields (chỉ render khi BE trả về)
  oldPrice?: string | number | null
  seller?: string | null
}

export interface HangHoaFormData {
  category: string
  name: string
  recommendedPrice: number | string
  htmlContent?: string | null
  productLink?: string | null
  image?: File | null
  platformImage?: File | null
  isSpecial?: boolean
  salePrice?: number | string | null
  quantity?: number | string
}
