
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminModuleCardProps {
  title: string;
  icon: React.ElementType;
  description: string;
  actionText?: string;
  onActionClick?: () => void;
  children?: React.ReactNode;
  bgColorClass?: string;
}

const AdminModuleCard: React.FC<AdminModuleCardProps> = ({ 
  title, 
  icon: Icon, 
  description, 
  actionText,
  onActionClick,
  children,
  bgColorClass
}) => {
  return (
    <Card className={cn("shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full", bgColorClass)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Icon className="h-6 w-6 text-primary" />
            {title}
          </CardTitle>
          {/* Potential placeholder for a small badge or status */}
        </div>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {children || <p className="text-sm text-muted-foreground">Mais detalhes e funcionalidades em breve.</p>}
      </CardContent>
      {actionText && onActionClick && (
        <CardFooter className="pt-0 mt-auto">
            <Button variant="outline" className="w-full" onClick={onActionClick}>
            {actionText} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default AdminModuleCard;
