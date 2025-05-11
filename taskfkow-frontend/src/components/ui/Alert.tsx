import React from 'react';
import clsx from 'clsx';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  onDismiss?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  message,
  onDismiss,
  className,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'bg-success-50 border-success-500 text-success-700';
      case 'warning':
        return 'bg-warning-50 border-warning-500 text-warning-700';
      case 'error':
        return 'bg-error-50 border-error-500 text-error-700';
      case 'info':
      default:
        return 'bg-primary-50 border-primary-500 text-primary-700';
    }
  };

  const getIcon = () => {
    switch (variant) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-success-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-warning-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-error-500" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-primary-500" />;
    }
  };

  return (
    <div
      className={clsx(
        'p-4 border-l-4 rounded-md animate-fadeIn',
        getVariantStyles(),
        className
      )}
      role="alert"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">{getIcon()}</div>
        <div className="flex-1">
          {title && <p className="font-medium">{title}</p>}
          <p className={title ? 'mt-1 text-sm' : ''}>{message}</p>
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="ml-auto -mx-1.5 -my-1.5 p-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <span className="sr-only">Dismiss</span>
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};