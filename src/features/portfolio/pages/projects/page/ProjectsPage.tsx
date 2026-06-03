import { useState, useEffect } from 'react'
import { SearchOutlined, AppstoreOutlined } from '@ant-design/icons'
import { useProjectQuery } from '../../../hooks/useProjectQuery'
import { useTranslation } from '../../../i18n/useTranslation'
import projectService from '../../../../shared/pages/admin/project/service/projectService'
import ProjectCard from '../../../components/ui/ProjectCard'
import Pagination from '../../../components/ui/Pagination'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Skeleton from '../../../components/ui/Skeleton'
import { paginateData, countProjects } from '../../../utils/projectHelpers'
import type { Project } from '../../../types/Project'
import '../style/ProjectsPage.scss'

const ProjectsPage = () => {
  const { projects = [], loading } = useProjectQuery()
  const { t } = useTranslation()

  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 6

  const [searchedProject, setSearchedProject] = useState<Project | null>(null)
  const [localMatches, setLocalMatches] = useState<Project[] | null>(null)
  const [searchLoading, setSearchLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchedProject(null)
      setLocalMatches(null)
      setHasSearched(false)
      setCurrentPage(1)
    }
  }, [searchQuery])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    const query = searchQuery.trim()
    if (!query) {
      setSearchedProject(null)
      setLocalMatches(null)
      setHasSearched(false)
      return
    }

    setSearchLoading(true)
    setHasSearched(true)
    setCurrentPage(1)

    try {
      const exactProject = await projectService.getByName(query)
      if (exactProject) {
        setSearchedProject(exactProject)
        setLocalMatches(null)
      } else {
        triggerLocalFallback(query)
      }
    } catch {
      triggerLocalFallback(query)
    } finally {
      setSearchLoading(false)
    }
  }

  const triggerLocalFallback = (query: string) => {
    setSearchedProject(null)
    const lowerQuery = query.toLowerCase()
    const filtered = projects.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery)
    )
    setLocalMatches(filtered)
  }

  const getDisplayList = (): Project[] => {
    if (!hasSearched) return projects
    if (searchedProject) return [searchedProject]
    return localMatches || []
  }

  const displayList = getDisplayList()
  const totalCount = countProjects(displayList)
  const paginatedProjects = paginateData(displayList, currentPage, pageSize)

  return (
    <div className="projects-page">
      <div className="projects-page__container">

        {/* Search controls */}
        <form className="projects-page__search-box" onSubmit={handleSearch}>
          <div className="projects-page__search-input-wrap">
            <SearchOutlined className="projects-page__search-icon" />
            <Input
              className="projects-page__search-input"
              placeholder={t('searchPlaceholder') || 'Tìm kiếm tên dự án hoặc mô tả...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Desktop button */}
          <Button
            type="submit"
            variant="primary"
            className="projects-page__search-btn"
            disabled={searchLoading}
            icon={searchLoading ? <span className="projects-page__spinner" /> : <SearchOutlined />}
          >
            {t('searchBtn') || 'Tìm kiếm'}
          </Button>

          {/* Mobile button — icon tròn */}
          <Button
            type="submit"
            variant="primary"
            className="projects-page__search-btn-mobile"
            disabled={searchLoading}
            icon={searchLoading ? <span className="projects-page__spinner" /> : <SearchOutlined />}
            borderRadius="50%"
            style={{ width: '48px', height: '48px', padding: 0 }}
          />
        </form>

        {loading ? (
          <div className="projects-page__grid">
            {Array.from({ length: pageSize }).map((_, idx) => (
              <Skeleton.Card key={idx} />
            ))}
          </div>
        ) : paginatedProjects.length === 0 ? (
          <div className="projects-page__empty">
            <AppstoreOutlined />
            <p>{t('noProjects')}</p>
          </div>
        ) : (
          <>
            <div className="projects-page__grid">
              {paginatedProjects.map((proj) => (
                <ProjectCard key={proj.id} project={proj} />
              ))}
            </div>

            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalCount}
              onChange={(page) => setCurrentPage(page)}
            />
          </>
        )}

      </div>
    </div>
  )
}

export default ProjectsPage