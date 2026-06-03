import React from 'react';

export type SkeletonVariant = 'text' | 'rect' | 'circle';
export type SkeletonAnimation = 'shimmer' | 'pulse' | 'none';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  animation?: SkeletonAnimation;
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  active?: boolean; // Convenience prop to enable shimmer animation (Antd style)
}

const Skeleton = ({
  variant = 'text',
  animation,
  width,
  height,
  borderRadius,
  active = true,
  className = '',
  style,
  children,
  ...rest
}: SkeletonProps) => {
  // If active is true and no animation is specified, default to shimmer
  const selectedAnimation = animation || (active ? 'shimmer' : 'none');

  const classes = [
    'skeleton',
    `skeleton--${variant}`,
    selectedAnimation !== 'none' ? `skeleton--${selectedAnimation}` : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const customStyle: React.CSSProperties = {
    ...(width !== undefined && { width }),
    ...(height !== undefined && { height }),
    ...(borderRadius !== undefined && { borderRadius }),
    ...style,
  };

  return (
    <div className={classes} style={customStyle} {...rest}>
      {children}
    </div>
  );
};

// ─── Sub-components for compatibility/convenience ────────────

export interface SkeletonButtonProps extends Omit<SkeletonProps, 'variant'> {
  shape?: 'circle' | 'square' | 'round';
  size?: 'small' | 'default' | 'large';
}

const SkeletonButton = ({
  shape = 'square',
  size = 'default',
  style,
  borderRadius,
  width,
  height,
  ...rest
}: SkeletonButtonProps) => {
  // Set default dimensions based on size
  const defaultHeight = size === 'small' ? '24px' : size === 'large' ? '40px' : '32px';
  const defaultWidth = size === 'small' ? '64px' : size === 'large' ? '120px' : '88px';

  // Set border radius based on shape
  let resolvedBorderRadius = borderRadius;
  if (borderRadius === undefined) {
    if (shape === 'round') {
      resolvedBorderRadius = '999px';
    } else if (shape === 'circle') {
      resolvedBorderRadius = '50%';
    } else {
      resolvedBorderRadius = 'var(--radius-sm, 6px)';
    }
  }

  return (
    <Skeleton
      variant={shape === 'circle' ? 'circle' : 'rect'}
      width={width ?? defaultWidth}
      height={height ?? defaultHeight}
      borderRadius={resolvedBorderRadius}
      style={style}
      {...rest}
    />
  );
};

export interface SkeletonInputProps extends Omit<SkeletonProps, 'variant'> {
  size?: 'small' | 'default' | 'large';
}

const SkeletonInput = ({
  size = 'default',
  style,
  width,
  height,
  borderRadius = 'var(--radius-sm, 6px)',
  ...rest
}: SkeletonInputProps) => {
  const defaultHeight = size === 'small' ? '24px' : size === 'large' ? '40px' : '32px';
  const defaultWidth = '160px';

  return (
    <Skeleton
      variant="rect"
      width={width ?? defaultWidth}
      height={height ?? defaultHeight}
      borderRadius={borderRadius}
      style={style}
      {...rest}
    />
  );
};

export interface SkeletonCardProps extends Omit<SkeletonProps, 'variant'> { }

const SkeletonCard = ({
  active = true,
  style,
  className = '',
  ...rest
}: SkeletonCardProps) => {
  return (
    <div className={`ui-project-card skeleton-card-loading ${className}`} style={style} {...rest}>
      <div className="ui-project-card__cover">
        <Skeleton variant="rect" height="100%" active={active} style={{ borderRadius: '0px' }} />
      </div>
      <div className="ui-project-card__content" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Skeleton variant="text" width="60%" height="20px" active={active} style={{ borderRadius: '4px', marginBottom: '4px' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '8px' }}>
          <Skeleton variant="text" width="100%" height="12px" active={active} style={{ borderRadius: '3px' }} />
          <Skeleton variant="text" width="85%" height="12px" active={active} style={{ borderRadius: '3px' }} />
        </div>
        <div className="ui-project-card__actions" style={{ display: 'flex', gap: '8px', marginTop: 'auto', width: '100%' }}>
          <SkeletonButton active={active} size="small" shape="round" style={{ flex: 1, height: '32px' }} />
          <SkeletonButton active={active} size="small" shape="round" style={{ flex: 1, height: '32px' }} />
        </div>
      </div>
    </div>
  );
};

export interface SkeletonSkillProps extends Omit<SkeletonProps, 'variant'> {
  index?: number;
}

const SkeletonSkill = ({
  active = true,
  index = 0,
  style,
  className = '',
  ...rest
}: SkeletonSkillProps) => {
  return (
    <div
      className={`home-page-2__skill-card skeleton-skill-loading ${className}`}
      style={{ '--skill-index': index, ...style } as React.CSSProperties}
      {...rest}
    >
      <div className="home-page-2__skill-icon-wrap">
        <Skeleton variant="circle" width="100%" height="100%" active={active} />
      </div>
      <Skeleton variant="text" width="60%" height="13px" active={active} style={{ borderRadius: '3px' }} />
    </div>
  );
};

export interface SkeletonTimelineProps extends Omit<SkeletonProps, 'variant'> {
  itemsCount?: number;
}

const SkeletonTimeline = ({
  active = true,
  itemsCount = 3,
  style,
  className = '',
  ...rest
}: SkeletonTimelineProps) => {
  return (
    <div
      className={`home-page-3__timeline-container ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '100%',
        position: 'relative',
        paddingLeft: '24px',
        borderLeft: '2px solid var(--color-card-border, rgba(255, 255, 255, 0.08))',
        ...style
      }}
      {...rest}
    >
      {Array.from({ length: itemsCount }).map((_, idx) => (
        <div key={idx} style={{ position: 'relative', width: '100%' }}>
          {/* Dot */}
          <div
            style={{
              position: 'absolute',
              left: '-33px',
              top: '4px',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-primary)',
              border: '4px solid var(--color-background)',
              boxShadow: '0 0 10px rgba(129, 140, 248, 0.3)'
            }}
          />

          {/* Header */}
          <div className="home-page-3__step-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Skeleton variant="text" width="40%" height="20px" active={active} style={{ borderRadius: '4px' }} />
            <Skeleton variant="text" width="20%" height="14px" active={active} style={{ borderRadius: '3px' }} />
          </div>

          {/* Description Card */}
          <div className="home-page-3__step-body" style={{ marginTop: '12px', width: '100%', pointerEvents: 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Skeleton variant="text" width="100%" height="14px" active={active} style={{ borderRadius: '3px' }} />
              <Skeleton variant="text" width="95%" height="14px" active={active} style={{ borderRadius: '3px' }} />
              <Skeleton variant="text" width="70%" height="14px" active={active} style={{ borderRadius: '3px' }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export interface SkeletonContactProps extends Omit<SkeletonProps, 'variant'> { }

const SkeletonContact = ({
  active = true,
  style,
  className = '',
  ...rest
}: SkeletonContactProps) => {
  return (
    <div
      className={`home-page-5__card skeleton-contact-loading ${className}`}
      style={{ pointerEvents: 'none', ...style }}
      {...rest}
    >
      <div className="home-page-5__icon-wrap">
        <Skeleton variant="rect" width="100%" height="100%" borderRadius="12px" active={active} />
      </div>
      <div className="home-page-5__info" style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
        <Skeleton variant="text" width="50%" height="14px" active={active} style={{ borderRadius: '3px' }} />
        <Skeleton variant="text" width="80%" height="12px" active={active} style={{ borderRadius: '3px' }} />
      </div>
    </div>
  );
};

// ─── High-level Ant-design compatible list layout ─────────────

export interface SkeletonParagraphProps {
  rows?: number;
  width?: string | number | Array<string | number>;
}

export interface SkeletonTitleProps {
  width?: string | number;
}

export interface SkeletonContainerProps extends Omit<SkeletonProps, 'title'> {
  paragraph?: boolean | SkeletonParagraphProps;
  title?: boolean | SkeletonTitleProps;
}

const SkeletonContainer = ({
  paragraph = true,
  title = true,
  active = true,
  style,
  className = '',
  ...rest
}: SkeletonContainerProps) => {
  // If rendering children directly instead of generating placeholder lines
  const hasConfig = paragraph !== false || title !== false;

  if (!hasConfig) {
    return <Skeleton active={active} style={style} className={className} {...rest} />;
  }

  // Generate Title Element
  let titleEl: React.ReactNode = null;
  if (title !== false) {
    const titleConfig = typeof title === 'object' ? title : {};
    const titleWidth = titleConfig.width ?? '38%';
    titleEl = (
      <Skeleton
        variant="text"
        active={active}
        width={titleWidth}
        height="18px"
        style={{ marginBottom: '16px', borderRadius: '4px' }}
      />
    );
  }

  // Generate Paragraph Element
  let paragraphEl: React.ReactNode = null;
  if (paragraph !== false) {
    const paraConfig = typeof paragraph === 'object' ? paragraph : {};
    const rowsCount = paraConfig.rows ?? 3;
    const widths = paraConfig.width;

    paragraphEl = (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
        {Array.from({ length: rowsCount }).map((_, i) => {
          let rowWidth: string | number = '100%';
          if (widths !== undefined) {
            if (Array.isArray(widths)) {
              rowWidth = widths[i] ?? '100%';
            } else {
              rowWidth = widths;
            }
          } else {
            // Default elegant staggered widths
            if (i === rowsCount - 1) rowWidth = '60%';
            else if (i % 2 === 1) rowWidth = '90%';
          }

          return (
            <Skeleton
              key={i}
              variant="text"
              active={active}
              width={rowWidth}
              height="14px"
              style={{ borderRadius: '4px' }}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={`skeleton-container ${className}`}
      style={{ width: '100%', ...style }}
      {...rest}
    >
      {titleEl}
      {paragraphEl}
    </div>
  );
};

// Bind subcomponents to Skeleton component function object
type SkeletonComponentType = typeof SkeletonContainer & {
  Button: typeof SkeletonButton;
  Input: typeof SkeletonInput;
  Card: typeof SkeletonCard;
  Skill: typeof SkeletonSkill;
  Timeline: typeof SkeletonTimeline;
  Contact: typeof SkeletonContact;
};

const ExportedSkeleton = SkeletonContainer as SkeletonComponentType;
ExportedSkeleton.Button = SkeletonButton;
ExportedSkeleton.Input = SkeletonInput;
ExportedSkeleton.Card = SkeletonCard;
ExportedSkeleton.Skill = SkeletonSkill;
ExportedSkeleton.Timeline = SkeletonTimeline;
ExportedSkeleton.Contact = SkeletonContact;

export default ExportedSkeleton;
