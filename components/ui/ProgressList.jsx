const statusColors = {
  done: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
  inProgress: 'text-blue-300 border-blue-500/40 bg-blue-500/10',
  pending: 'text-slate-300 border-white/10 bg-white/5'
};

const ProgressList = ({ items }) => (
  <ul className="space-y-3">
    {items.map((item) => (
      <li
        key={item.id}
        className={`border rounded-2xl px-4 py-3 flex items-center justify-between ${statusColors[item.status] || statusColors.pending}`}
      >
        <div>
          <p className="text-white font-semibold">{item.title}</p>
          <p className="text-xs text-slate-200">{item.description}</p>
        </div>
        <span className="text-xs uppercase tracking-wide">{item.statusLabel}</span>
      </li>
    ))}
  </ul>
);

export default ProgressList;
