import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { ExamDocument } from '../types'
import { congDongOnThiService } from '../services/congDongOnThiService'
import { splitMarkdownToPages } from '../utils/markdown'

export const EXAM_DOCUMENTS_QUERY_KEY = ['exam-documents']

// Query Hook for all documents
export function useGetDocuments(search?: string, subject?: string) {
  return useQuery<ExamDocument[]>({
    queryKey: [...EXAM_DOCUMENTS_QUERY_KEY, search, subject],
    queryFn: async () => {
      const docs = await congDongOnThiService.getDocuments()
      
      const mappedDocs: ExamDocument[] = docs.map((doc) => ({
        id: doc.id,
        title: doc.title,
        description: doc.description || '',
        subject: doc.subject,
        fileType: (doc.fileType || 'PDF') as any,
        fileSize: doc.fileSize || '1.0 MB',
        downloadUrl: doc.downloadUrl || '#',
        downloads: doc.downloads || 0,
        views: doc.views || 0,
        author: doc.author || 'Hệ thống',
        tags: doc.tags || [],
        pages: [],
        createdAt: doc.createdAt,
        level: doc.level || 0,
      }))

      let filteredDocs = mappedDocs

      if (subject && subject !== 'all') {
        filteredDocs = filteredDocs.filter((doc) => doc.subject === subject)
      }

      if (search) {
        const query = search.toLowerCase()
        filteredDocs = filteredDocs.filter(
          (doc) =>
            doc.title.toLowerCase().includes(query) ||
            doc.description.toLowerCase().includes(query) ||
            doc.author.toLowerCase().includes(query) ||
            doc.subject.toLowerCase().includes(query) ||
            doc.tags.some((tag) => tag.toLowerCase().includes(query))
        )
      }

      // Sort by newest first
      return [...filteredDocs].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    },
  })
}

// Query Hook for single document by ID
export function useGetDocumentById(id?: string) {
  return useQuery<ExamDocument>({
    queryKey: ['exam-document', id],
    queryFn: async () => {
      if (!id) throw new Error('Document ID is required')
      const doc = await congDongOnThiService.getDocumentById(id)
      
      let pages: string[] = []
      if (doc.mdDownloadUrl) {
        try {
          const mdContent = await congDongOnThiService.fetchMarkdownContent(doc.mdDownloadUrl)
          if (mdContent) {
            pages = splitMarkdownToPages(mdContent)
          }
        } catch (err) {
          console.error('Failed to fetch markdown content:', err)
        }
      }

      return {
        id: doc.id,
        title: doc.title,
        description: doc.description || '',
        subject: doc.subject,
        fileType: (doc.fileType || 'PDF') as any,
        fileSize: doc.fileSize || '1.0 MB',
        downloadUrl: doc.downloadUrl || '#',
        mdDownloadUrl: doc.mdDownloadUrl || '#',
        downloads: doc.downloads || 0,
        views: doc.views || 0,
        author: doc.author || 'Hệ thống',
        tags: doc.tags || [],
        pages: pages,
        createdAt: doc.createdAt,
        level: doc.level || 0,
      }
    },
    enabled: !!id,
  })
}

// Query Hook for unique subject list
export function useGetSubjects() {
  return useQuery<string[]>({
    queryKey: ['exam-subjects'],
    queryFn: async () => {
      return await congDongOnThiService.getSubjects()
    }
  })
}

// Mutation Hook for Mock Contribution (retaining if needed)
export function useUploadDocument() {
  const queryClient = useQueryClient()

  return useMutation<ExamDocument, Error, Omit<ExamDocument, 'id' | 'downloads' | 'views' | 'tags' | 'pages' | 'createdAt'>>({
    mutationFn: async (newDoc) => {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const createdDoc: ExamDocument = {
        ...newDoc,
        id: `doc-${Date.now()}`,
        downloads: 0,
        views: 0,
        tags: ['Mới', 'Đóng Góp'],
        pages: [
          `Tài liệu: ${newDoc.title}\n\n[Trang 1]\nĐây là nội dung tài liệu do người dùng đóng góp.\nTác giả: ${newDoc.author}\nMô tả: ${newDoc.description}\n\nCảm ơn bạn đã đóng góp tài liệu này cho cộng đồng!`,
          `[Trang 2]\nNội dung chi tiết của trang 2 sẽ được ban quản trị xét duyệt và số hóa hoàn chỉnh sớm nhất có thể.\n\nTrân trọng cảm ơn.`
        ],
        createdAt: new Date().toISOString(),
      }

      return createdDoc
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXAM_DOCUMENTS_QUERY_KEY })
    },
  })
}
