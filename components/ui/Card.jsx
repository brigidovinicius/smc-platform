const Card = ({ title, description, children, actions, className = '' }) => (
  <section className={`bg-[#0b1230] border border-white/5 rounded-3xl p-6 shadow-2xl shadow-black/40 ${className}`}>
    {(title || description || actions) && (
      <header className="flex items-start justify-between gap-4 mb-4">
        <div>
          {title && <h2 className="text-xl font-semibold text-white">{title}</h2>}
          {description && <p className="text-slate-400 text-sm mt-1">{description}</p>}
        </div>
        {actions && <div className="flex gap-2">{actions}</div>}
      </header>
    )}
    {children}
  </section>
);

export default Card;
