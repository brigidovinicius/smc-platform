'use client';

import StatBlock from '@/components/ui/StatBlock';

interface Metric {
  id: string;
  label: string;
  value: string;
  sublabel: string;
  trend: string;
}

interface MetricsSectionProps {
  metrics: Metric[];
  editable?: boolean;
  isAdmin?: boolean;
}

export default function MetricsSection({ 
  metrics, 
  editable = false,
  isAdmin = false 
}: MetricsSectionProps) {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-xl font-semibold text-foreground">Valuations & Metrics</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Summary of automated analyses based on MRR, churn, and CAC.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <StatBlock
            key={metric.id}
            label={metric.label}
            value={metric.value}
            sublabel={metric.sublabel}
            trend={metric.trend}
          />
        ))}
      </div>
    </section>
  );
}

