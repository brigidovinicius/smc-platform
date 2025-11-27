'use client';

interface ReadinessCardProps {
  score: number;
  status: string;
  trend?: string;
  editable?: boolean;
  onEdit?: () => void;
}

export default function ReadinessCard({ 
  score, 
  status, 
  trend,
  editable = false,
  onEdit 
}: ReadinessCardProps) {
  return (
    <div className="rounded-2xl bg-card border border-border p-6">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Readiness score</h3>
        {editable && onEdit && (
          <button
            onClick={onEdit}
            className="text-xs text-primary hover:text-primary/80"
            aria-label="Edit readiness score"
          >
            Edit
          </button>
        )}
      </div>
      
      <div className="mb-4">
        <div className="text-4xl font-bold text-foreground mb-2">{score}%</div>
        <p className="text-sm text-muted-foreground">{status}</p>
      </div>
      
      {trend && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-emerald-400">{trend}</span>
        </div>
      )}
    </div>
  );
}

