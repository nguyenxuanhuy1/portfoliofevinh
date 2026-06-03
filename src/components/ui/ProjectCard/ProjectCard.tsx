import { GithubOutlined, LinkOutlined } from '@ant-design/icons'
import type { Project } from '../../../features/portfolio/types/Project'

export interface ProjectCardProps {
  project: Project
  gitLabel?: string
  demoLabel?: string
}

export function ProjectCard({
  project,
  gitLabel = 'GitHub',
  demoLabel = 'Demo',
}: ProjectCardProps) {
  return (
    <div className="ui-project-card">
      <div className="ui-project-card__cover">
        {project.image ? (
          <img src={project.image} alt={project.name} className="ui-project-card__img" />
        ) : (
          <div className="ui-project-card__fallback">
            No Preview Image
          </div>
        )}
      </div>

      <div className="ui-project-card__content">
        <h3 className="ui-project-card__title">{project.name}</h3>
        <p className="ui-project-card__description">{project.description}</p>

        {(project.githubLink || project.productLink) && (
          <div className="ui-project-card__actions">
            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="ui-project-card__link"
              >
                <GithubOutlined />
                <span>{gitLabel}</span>
              </a>
            )}

            {project.productLink && (
              <a
                href={project.productLink}
                target="_blank"
                rel="noopener noreferrer"
                className="ui-project-card__link ui-project-card__link--primary"
              >
                <LinkOutlined />
                <span>{demoLabel}</span>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
export default ProjectCard
