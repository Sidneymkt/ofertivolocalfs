
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AdvertiserMetricItem {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string; // e.g., '+10%', '-5%'
  description?: string;
}

const AdvertiserMetricCard: React.FC<AdvertiserMetricItem> = ({ title, value, icon: Icon, trend, description }) => {
  const isPositiveTrend = trend?.startsWith('+');
  const isNegativeTrend = trend?.startsWith('-');

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">{value}</div>
        {trend && (
          <p className={cn(
            "text-xs text-muted-foreground flex items-center",
            isPositiveTrend && "text-green-600",
            isNegativeTrend && "text-red-600"
          )}>
            {isPositiveTrend && <TrendingUp className="h-4 w-4 mr-1" />}
            {isNegativeTrend && <TrendingDown className="h-4 w-4 mr-1" />}
            {trend}
          </p>
        )}
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  );
};

export default AdvertiserMetricCard;
