
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface GenericDashboardSectionProps {
  title: string;
  icon?: React.ElementType;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

const GenericDashboardSection: React.FC<GenericDashboardSectionProps> = ({ title, icon: Icon, description, children, className }) => {
  return (
    <Card className={`shadow-lg ${className || ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
          {Icon && <Icon className="h-6 w-6 text-primary" />}
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

export default GenericDashboardSection;
