import React from 'react';

// FIX: Update CardProps to extend standard HTML attributes for a div, allowing props like onClick to be passed through.
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div className={`bg-brand-mid rounded-lg shadow-lg p-6 ${className}`} {...props}>
      {children}
    </div>
  );
};