
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  color?: string;
  bgColor?: string;
  borderColor?: string;
  borderRadius?: string;
  width?: string;
}

const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  children,
  disabled,
  className = '',
  color = '#fff',
  bgColor,
  borderColor,
  borderRadius,
  width,
  style,
  ...rest
}: ButtonProps) => {
  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    loading ? 'btn--loading' : '',
    className,
  ].filter(Boolean).join(' ');

  const customStyle: React.CSSProperties = {
    ...(color && { color }),
    ...(bgColor && { background: bgColor }),
    ...(borderColor && { borderColor }),
    ...(borderRadius && { borderRadius }),
    ...(width && { width }),
    ...style,
  };

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      style={customStyle}
      {...rest}
    >
      {loading && <span className="btn__spinner" aria-hidden="true" />}
      {!loading && icon && iconPosition === 'left' && (
        <span className="btn__icon">{icon}</span>
      )}
      {children && <span className="btn__label">{children}</span>}
      {!loading && icon && iconPosition === 'right' && (
        <span className="btn__icon">{icon}</span>
      )}
    </button>
  );
};

export default Button;