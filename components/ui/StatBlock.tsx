import Link from 'next/link';

interface StatBlockProps {
  label: string;
  value: string;
  sublabel?: string;
  trend?: string;
  href?: string;
}

const StatBlock = ({ label, value, sublabel, trend, href }: StatBlockProps) => {
  const content = (
    <div 
      className="rounded-2xl bg-card border border-border p-4 flex flex-col gap-1"
      role="region"
      aria-label={`Estatística: ${label}`}
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
        <p className={`text-xs ${href ? 'text-emerald-400 hover:text-emerald-300 cursor-pointer transition-colors' : 'text-emerald-400'}`} aria-label={`Tendência: ${trend}`}>
          {trend}
        </p>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
};

export default StatBlock;

