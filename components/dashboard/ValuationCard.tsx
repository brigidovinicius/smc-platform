'use client';

interface ValuationCardProps {
  value: string;
  description: string;
  updated?: string;
  editable?: boolean;
  onEdit?: () => void;
}

export default function ValuationCard({ 
  value, 
  description, 
  updated = 'Updated daily',
  editable = false,
  onEdit 
}: ValuationCardProps) {
  return (
    <div className="rounded-2xl bg-card border border-border p-6">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Suggested Valuation</h3>
        {editable && onEdit && (
          <button
            onClick={onEdit}
            className="text-xs text-primary hover:text-primary/80"
            aria-label="Edit valuation"
          >
            Edit
          </button>
        )}
      </div>
      
      <div className="mb-4">
        <div className="text-4xl font-bold text-foreground mb-2">{value}</div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      
      <span className="text-xs text-muted-foreground">{updated}</span>
    </div>
  );
}

