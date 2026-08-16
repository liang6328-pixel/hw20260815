import React, { type ReactNode } from 'react';
import { cn } from '../../utils/helpers';

export interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: ReactNode;
  onClose?: () => void;
  dismissible?: boolean;
}

const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  message,
  onClose,
  dismissible = true,
}) => {
  const [visible, setVisible] = React.useState(true);

  if (!visible) return null;

  const typeClasses = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  };

  const handleClose = () => {
    setVisible(false);
    onClose?.();
  };

  return (
    <div className={cn('border-l-4 p-4 rounded mb-4', typeClasses[type])}>
      <div className="flex items-start">
        <div className="flex-1">
          {title && <h3 className="font-semibold mb-1">{title}</h3>}
          <p>{message}</p>
        </div>
        {dismissible && (
          <button
            onClick={handleClose}
            className="ml-4 text-current opacity-60 hover:opacity-100 text-xl leading-none"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
