import React from 'react'
import GlobalProjectCard from '../../../../../components/ui/ProjectCard/ProjectCard'
import './ProjectCard.scss'

export interface ProjectCardProps extends React.ComponentProps<typeof GlobalProjectCard> {}

export default function ProjectCard(props: ProjectCardProps) {
  return <GlobalProjectCard {...props} />
}