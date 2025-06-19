
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { AdminMetricItem } from '@/types'; // Assuming AdminMetricItem is defined in types
import { TrendingUp, TrendingDown } from 'lucide-react';

const AdminMetricCard: React.FC<AdminMetricItem> = ({ title, value, icon: Icon, change, bgColorClass }) => {
  const isPositiveChange = change?.includes('+');
  const isNegativeChange = change?.includes('-');

  return (
    <Card className={cn("shadow-lg hover:shadow-xl transition-shadow duration-300", bgColorClass?.replace('bg-', 'border-').replace('/10', '/20'))}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={cn("p-1.5 rounded-md", bgColorClass || 'bg-primary/10')}>
          <Icon className={cn("h-5 w-5", bgColorClass ? 'text-current' : 'text-primary')} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">{value}</div>
        {change && (
          <p className={cn(
            "text-xs text-muted-foreground flex items-center",
            isPositiveChange && "text-green-600",
            isNegativeChange && "text-red-600"
          )}>
            {isPositiveChange && <TrendingUp className="h-3.5 w-3.5 mr-1" />}
            {isNegativeChange && <TrendingDown className="h-3.5 w-3.5 mr-1" />}
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminMetricCard;
