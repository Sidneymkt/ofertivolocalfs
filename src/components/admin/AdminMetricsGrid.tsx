
import React from 'react';
import AdminMetricCard from './AdminMetricCard';
import type { AdminMetricItem } from '@/types';

interface AdminMetricsGridProps {
  metrics: AdminMetricItem[];
}

const AdminMetricsGrid: React.FC<AdminMetricsGridProps> = ({ metrics }) => {
  if (!metrics || metrics.length === 0) {
    return <p className="text-muted-foreground">Nenhuma métrica disponível.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6">
      {metrics.map((metric, index) => (
        <AdminMetricCard key={index} {...metric} />
      ))}
    </div>
  );
};

export default AdminMetricsGrid;
