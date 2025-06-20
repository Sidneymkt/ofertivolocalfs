
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { LineChart as LineChartIcon, Eye, MousePointerClick, CheckCircle, TrendingUp } from 'lucide-react'; // Added TrendingUp
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { Button } from '@/components/ui/button';

// Mock data for the last 7 days
const lastSevenDaysData = [
  { date: '23/07', views: 120, clicks: 30, checkins: 5 },
  { date: '24/07', views: 150, clicks: 45, checkins: 8 },
  { date: '25/07', views: 130, clicks: 35, checkins: 6 },
  { date: '26/07', views: 180, clicks: 60, checkins: 12 },
  { date: '27/07', views: 220, clicks: 70, checkins: 15 },
  { date: '28/07', views: 190, clicks: 55, checkins: 10 },
  { date: '29/07', views: 250, clicks: 80, checkins: 18 },
];

const chartConfig = {
  views: {
    label: "Visualizações",
    color: "hsl(var(--chart-1))",
    icon: Eye,
  },
  clicks: {
    label: "Cliques",
    color: "hsl(var(--chart-2))",
    icon: MousePointerClick,
  },
  checkins: {
    label: "Check-ins",
    color: "hsl(var(--chart-3))",
    icon: CheckCircle,
  },
} satisfies ChartConfig;

const OfferPerformanceChart: React.FC = () => {
  return (
    <Card className="shadow-lg col-span-1 lg:col-span-2 flex flex-col h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LineChartIcon className="h-6 w-6 text-primary" />
          Desempenho das Ofertas
        </CardTitle>
        <CardDescription>Visualizações, cliques e check-ins nos últimos 7 dias.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0"> {/* Ensure content can grow */}
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <LineChart
            accessibilityLayer
            data={lastSevenDaysData}
            margin={{
              left: 12,
              right: 12,
              top: 5,
              bottom: 5,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 5)} // Show only day/month
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              // domain={[0, 'dataMax + 50']} // Optional: adjust domain
            />
            <Tooltip
              cursor={true}
              content={<ChartTooltipContent indicator="line" hideLabel />}
            />
            <Legend content={<ChartLegendContent />} />
            <Line
              dataKey="views"
              type="monotone"
              stroke="var(--color-views)"
              strokeWidth={2.5}
              dot={{
                fill: "var(--color-views)",
                r: 4,
              }}
              activeDot={{
                r: 6,
              }}
            />
            <Line
              dataKey="clicks"
              type="monotone"
              stroke="var(--color-clicks)"
              strokeWidth={2.5}
              dot={{
                fill: "var(--color-clicks)",
                r: 4,
              }}
              activeDot={{
                r: 6,
              }}
            />
            <Line
              dataKey="checkins"
              type="monotone"
              stroke="var(--color-checkins)"
              strokeWidth={2.5}
              dot={{
                fill: "var(--color-checkins)",
                r: 4,
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm pt-4">
        <div className="flex gap-2 font-medium leading-none">
          Tendência positiva nos últimos dias.
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Mostrando dados dos últimos 7 dias.
        </div>
         <Button variant="link" size="sm" className="p-0 h-auto text-primary">Ver relatório completo</Button>
      </CardFooter>
    </Card>
  );
};

export default OfferPerformanceChart;
