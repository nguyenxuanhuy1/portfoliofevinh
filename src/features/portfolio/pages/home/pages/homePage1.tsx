import { Link } from 'react-router-dom'
import Skeleton from '../../../components/ui/Skeleton'
import { BirdsBackground } from '../ui/BirdsBackground'
import { useAdminProfile } from '../../../../shared/pages/admin/adminProfile/hook/useAdminProfile'
import { useProjectQuery } from '../../../hooks/useProjectQuery'
import { useTranslation } from '../../../i18n/useTranslation'
import Button from '../../../components/ui/Button'

export default function HomePage1() {
  const { profile, loading } = useAdminProfile()
  const { projects = [] } = useProjectQuery()
  const { t } = useTranslation()

  return (
    <div className="home-page">
      <div className="home-page__birds-zone">
        <BirdsBackground />
      </div>

      <div className="home-page__content">

        {/* Badge */}
        {loading
          ? <Skeleton.Button active size="small" shape="round" style={{ width: 140, marginBottom: 12 }} />
          : <span className="home-page__badge">
            {profile?.workStatus === 'READY' ? t('available') : t('unavailable')}
          </span>
        }

        {/* Name */}
        {loading
          ? <Skeleton.Input active style={{ height: 48, borderRadius: 8, width: 260, marginBottom: 8 }} />
          : <h1 className="home-page__title">{profile?.name ?? t('defaultName')}</h1>
        }

        {/* Position */}
        {loading
          ? <Skeleton.Input active style={{ height: 28, borderRadius: 8, width: 320, marginBottom: 16 }} />
          : <h2 className="home-page__role">{profile?.position ?? t('defaultPosition')}</h2>
        }

        <div className="home-page__divider" />

        {/* Bio */}
        {loading
          ? <Skeleton active paragraph={{ rows: 2, width: [320, 300] }} title={{ width: 320 }} style={{ marginBottom: 16 }} />
          : <p className="home-page__description">{profile?.bio ?? t('defaultBio')}</p>
        }

        {/* Skills chips */}
        <div className="home-page__chips">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton.Button key={i} active size="small" shape="round" style={{ width: 72 }} />
            ))
            : profile?.skills?.map((skill, index) => (
              <span key={index} className="home-page__chip">{skill}</span>
            ))
          }
        </div>

        {/* Project count */}
        {!loading && projects.length > 0 && (
          <div className="home-page__stats">
            <span className="home-page__projects-count">
              {t('projectsCompleted').replace('{count}', String(projects.length))}
            </span>
          </div>
        )}

        {/* CTA */}
        <div className="home-page__cta">
          <Link to="/projects">
            <Button variant="primary" size="lg" borderRadius="var(--radius-full)" style={{ padding: '15px 30px' }}>
              {t('viewProjects')}
            </Button>
          </Link>
        </div>

      </div>
    </div>
  )
}