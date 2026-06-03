/**
 * Slices a data list locally for client-side pagination
 */
export function paginateData<T>(data: T[], page: number, pageSize: number): T[] {
  if (!Array.isArray(data)) return []
  const startIndex = (page - 1) * pageSize
  return data.slice(startIndex, startIndex + pageSize)
}

/**
 * Counts the total number of projects in the list
 */
export function countProjects<T>(projects: T[]): number {
  if (!Array.isArray(projects)) return 0
  return projects.length
}
