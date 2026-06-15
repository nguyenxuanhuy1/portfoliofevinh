export function formatRelativeTime(dateString: string | Date): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()

  if (diffMs < 0) return 'vừa xong'

  const diffMins = Math.floor(diffMs / (60 * 1000))
  if (diffMins < 60) {
    return diffMins <= 0 ? 'vừa xong' : `${diffMins} phút trước`
  }

  const diffHours = Math.floor(diffMs / (60 * 60 * 1000))
  if (diffHours < 24) {
    return `${diffHours} giờ trước`
  }

  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000))
  return `${diffDays} ngày trước`
}
