import React from 'react'
import GlobalSkeleton from '../../../../../components/ui/Skeleton/Skeleton'
import './Skeleton.scss'

export interface SkeletonProps extends React.ComponentProps<typeof GlobalSkeleton> {}

const Skeleton = (props: SkeletonProps) => {
  return <GlobalSkeleton {...props} />
}

Skeleton.Button = GlobalSkeleton.Button
Skeleton.Input = GlobalSkeleton.Input
Skeleton.Card = GlobalSkeleton.Card
Skeleton.Skill = GlobalSkeleton.Skill
Skeleton.Timeline = GlobalSkeleton.Timeline
Skeleton.Contact = GlobalSkeleton.Contact

export default Skeleton