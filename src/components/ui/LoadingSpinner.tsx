import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = '#7c3aed',
  className = ''
}) => {
  const sizeMap = {
    small: '1rem',
    medium: '2rem',
    large: '3rem'
  };

  return (
    <div 
      className={`loading-spinner ${className}`} 
      style={{
        width: sizeMap[size],
        height: sizeMap[size],
        '--spinner-color': color
      } as React.CSSProperties}
    >
      <div className="loading-spinner__inner"></div>
    </div>
  );
};

export default LoadingSpinner;
