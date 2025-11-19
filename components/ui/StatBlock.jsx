const StatBlock = ({ label, value, sublabel, trend }) => (
  <div className="rounded-2xl bg-[#060c1a] border border-white/5 p-4 flex flex-col gap-1">
    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{label}</p>
    <strong className="text-2xl text-white">{value}</strong>
    {sublabel && <p className="text-slate-400 text-sm">{sublabel}</p>}
    {trend && <p className="text-xs text-emerald-400">{trend}</p>}
  </div>
);

export default StatBlock;
