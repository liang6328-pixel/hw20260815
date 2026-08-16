import React, { type ReactNode } from 'react';
import { cn } from '../../utils/helpers';

export interface ModalProps {
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  onClose,
  children,
  size = 'md',
  closeButton = true,
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={cn('bg-white rounded-lg shadow-lg p-6 max-h-[90vh] overflow-y-auto', sizeClasses[size])}>
        <div className="flex items-center justify-between mb-4">
          {title && <h2 className="text-2xl font-semibold">{title}</h2>}
          {closeButton && (
            <button
              onClick={onClose}
              className="ml-auto text-gray-500 hover:text-gray-700 text-2xl leading-none"
            >
              ×
            </button>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
