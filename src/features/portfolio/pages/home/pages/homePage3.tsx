import Steps from '../../../components/ui/Steps'
import { CalendarOutlined, TrophyOutlined } from '@ant-design/icons'
import { useExperienceQuery } from '../../../hooks/useExperienceQuery'
import { useTranslation } from '../../../i18n/useTranslation'
import Skeleton from '../../../components/ui/Skeleton'

export default function HomePage3() {
  const { experiences = [], loading } = useExperienceQuery()
  const { t } = useTranslation()

  // Sort experiences to show latest first or chronological depending on dates
  const sortedExperiences = [...experiences].reverse()

  const stepItems = sortedExperiences.map((exp) => ({
    title: (
      <div className="home-page-3__step-header">
        <h3 className="home-page-3__job-title">{exp.name}</h3>
        <span className="home-page-3__date">
          <CalendarOutlined /> {exp.startDate} — {exp.endDate || t('present')}
        </span>
      </div>
    ),
    description: (
      <div className="home-page-3__step-body">
        <p className="home-page-3__job-description">{exp.description}</p>
      </div>
    ),
    icon: (
      <div className="home-page-3__marker-circle">
        <TrophyOutlined />
      </div>
    ),
  }))

  return (
    <div className="home-page-3">
      <div className="home-page-3__content">
        <span className="home-page-3__badge">
          {t('expBadge')}
        </span>

        <h2 className="home-page-3__title">
          {t('expTitle')}
        </h2>
        <p className="home-page-3__subtitle">
          {t('expSubtitle')}
        </p>

        {loading ? (
          <Skeleton.Timeline itemsCount={2} />
        ) : sortedExperiences.length === 0 ? (
          <div className="home-page-3__empty">
            <CalendarOutlined />
            <p>{t('noExp')}</p>
          </div>
        ) : (
          <div className="home-page-3__timeline-container">
            <Steps
              direction="vertical"
              current={sortedExperiences.length}
              items={stepItems}
              className="home-page-3__steps"
            />
          </div>
        )}
      </div>
    </div>
  )
}
