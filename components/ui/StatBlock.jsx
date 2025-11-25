const StatBlock = ({ label, value, sublabel, trend }) => (
  <div 
    className="rounded-2xl bg-card border border-border p-4 flex flex-col gap-1"
    role="region"
    aria-label={`Statistic: ${label}`}
  >
    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{label}</p>
    <strong className="text-2xl text-foreground" aria-label={`${label}: ${value}`}>
      {value}
    </strong>
    {sublabel && (
      <p className="text-muted-foreground text-sm" aria-label={`Informação adicional: ${sublabel}`}>
        {sublabel}
      </p>
    )}
    {trend && (
      <p className="text-xs text-emerald-400" aria-label={`Tendência: ${trend}`}>
        {trend}
      </p>
    )}
  </div>
);

export default StatBlock;
