const colors = {
  success: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
  warning: 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
  info: 'bg-blue-500/20 text-blue-200 border border-blue-500/40',
  default: 'bg-white/5 text-slate-200 border border-white/10'
};

const Badge = ({ children, variant = 'default' }) => (
  <span className={`px-3 py-1 rounded-full text-xs uppercase tracking-wide ${colors[variant] || colors.default}`}>
    {children}
  </span>
);

export default Badge;
