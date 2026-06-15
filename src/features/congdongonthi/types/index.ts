export interface ExamDocument {
  id: string
  title: string
  description: string
  subject: string
  fileType: 'PDF' | 'DOCX' | 'ZIP' | 'XLSX' | 'PPTX'
  fileSize: string
  downloadUrl: string
  mdDownloadUrl?: string
  downloads: number
  views: number
  author: string
  tags: string[]
  pages: string[]
  createdAt: string
  level?: number
}

export interface Subject {
  id: string
  name: {
    vi: string
    en: string
  }
  iconName: string
}
