import React from 'react';
import { EmptyState } from './EmptyState';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an error loading this content. Please check your connection and try again.',
  onRetry,
}) => {
  return (
    <EmptyState
      icon="alert-circle-outline"
      title={title}
      message={message}
      actionLabel={onRetry ? "Try Again" : undefined}
      onAction={onRetry}
    />
  );
};
