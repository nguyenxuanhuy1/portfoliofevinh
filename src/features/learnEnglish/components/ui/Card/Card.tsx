import React from 'react'
import './Card.scss'
import { LE_COLORS } from '../../../styles/colors'

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'div' | 'button' | 'a';
  shadowOffset?: number;
  borderWidth?: number;
  bgColor?: string;
  inkColor?: string;
  hoverable?: boolean;
  clickable?: boolean;
  disabled?: boolean;
}

export default function Card({
  as: Component = 'div',
  children,
  shadowOffset = 8,
  borderWidth = 3,
  bgColor = LE_COLORS.white,
  inkColor = LE_COLORS.ink,
  hoverable = true,
  clickable = true,
  className = '',
  style,
  ...props
}: CardProps) {
  const cardStyle = {
    '--card-shadow-offset': `${shadowOffset}px`,
    '--card-border-width': `${borderWidth}px`,
    '--card-bg-color': bgColor,
    '--card-ink-color': inkColor,
    ...style,
  } as React.CSSProperties;

  const classes = [
    'nb-card',
    hoverable ? 'nb-card--hoverable' : '',
    clickable ? 'nb-card--clickable' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <Component className={classes} style={cardStyle} {...props}>
      {children}
    </Component>
  )
}
