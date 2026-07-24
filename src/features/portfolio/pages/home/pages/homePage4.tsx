import { Link } from 'react-router-dom'
import { AppstoreOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { useProjectQuery } from '../../../hooks/useProjectQuery'
import { useTranslation } from '../../../i18n/useTranslation'
import ProjectCard from '../../../components/ui/ProjectCard'
import Button from '../../../components/ui/Button'
import Skeleton from '../../../components/ui/Skeleton'

const HomePage4 = () => {
  const { projects = [], loading } = useProjectQuery()
  const { t } = useTranslation()

  // Display only the first 3 projects on the home slide
  const displayProjects = projects.slice(0, 3)

  return (
    <div className="home-page-4">
      <div className="home-page-4__content">
        <span className="home-page-4__badge">
          {t('projectsBadge')}
        </span>

        <h2 className="home-page-4__title">
          {t('projectsTitle')}
        </h2>
        <p className="home-page-4__subtitle">
          {t('projectsSubtitle')}
        </p>

        {loading ? (
          <div className="home-page-4__grid">
            {Array.from({ length: 3 }).map((_, idx) => (
              <Skeleton.Card key={idx} />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="home-page-4__empty">
            <AppstoreOutlined />
            <p>{t('noProjects')}</p>
          </div>
        ) : (
          <>
            <div className="home-page-4__grid">
              {displayProjects.map((proj) => (
                <ProjectCard key={proj.id} project={proj} />
              ))}
            </div>

            {/* View More CTA */}
            <div className="home-page-4__cta">
              <Link to="/projects">
                <Button variant="primary" size="lg" borderRadius="var(--radius-full)" style={{ padding: '12px 28px' }}>
                  {t('viewMoreProjects')} <ArrowRightOutlined style={{ marginLeft: "5px" }} />
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
export default HomePage4
