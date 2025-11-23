const StatBlock = ({ label, value, sublabel, trend }) => (
  <div className="rounded-2xl bg-card border border-border p-4 flex flex-col gap-1">
    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{label}</p>
    <strong className="text-2xl text-foreground">{value}</strong>
    {sublabel && <p className="text-muted-foreground text-sm">{sublabel}</p>}
    {trend && <p className="text-xs text-emerald-400">{trend}</p>}
  </div>
);

export default StatBlock;
