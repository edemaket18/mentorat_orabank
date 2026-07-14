// 🧾 Card.tsx
import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Card = ({ title, children, className = '' }: CardProps) => {
  return (
    <div className={`kool-card ${className}`}>
      {title && <h3 className="kool-card-title">{title}</h3>}
      <div className="kool-card-body">
        {children}
      </div>
    </div>
  );
};

const CardContent = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  return <div className={`kool-card-content ${className}`}>{children}</div>;
};

const CardHeader = ({ children }: { children: React.ReactNode }) => {
  return <div className="kool-card-header">{children}</div>;
};

const CardTitle = ({ children }: { children: React.ReactNode }) => {
  return <h3 className="kool-card-title">{children}</h3>;
};

export { Card, CardContent, CardHeader, CardTitle };