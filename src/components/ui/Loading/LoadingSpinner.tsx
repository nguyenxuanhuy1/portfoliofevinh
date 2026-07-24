import { LoadingOutlined } from '@ant-design/icons';
import './LoadingSpinner.scss';

export interface LoadingSpinnerProps {
  fullScreen?: boolean;
}

export const LoadingSpinner = ({ fullScreen }: LoadingSpinnerProps) => {
  return (
    <div className={`loading-spinner ${fullScreen ? 'loading-spinner--fullscreen' : ''}`}>
      <LoadingOutlined className="loading-spinner__icon" spin />
    </div>
  );
};