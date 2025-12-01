/**
 * Skeleton component - Loading state visual
 * Usado para mostrar placeholders durante carregamento
 */
const Skeleton = ({ 
  variant = 'text',
  width,
  height,
  className = '',
  ...props 
}) => {
  const baseStyles = 'animate-pulse bg-slate-200 dark:bg-slate-700 rounded';
  
  const variants = {
    text: 'h-4 w-full',
    title: 'h-6 w-3/4',
    avatar: 'h-12 w-12 rounded-full',
    button: 'h-10 w-24 rounded-md',
    card: 'h-32 w-full rounded-xl',
    image: 'h-48 w-full rounded-lg'
  };

  const variantClass = variants[variant] || variants.text;
  const customStyles = width || height 
    ? { width: width || '100%', height: height || '1rem' }
    : {};

  return (
    <div
      className={`${baseStyles} ${variantClass} ${className}`}
      style={customStyles}
      {...props}
      aria-hidden="true"
    />
  );
};

/**
 * SkeletonGroup - Grupo de skeletons para layouts complexos
 */
export const SkeletonGroup = ({ count = 3, variant = 'text', className = '' }) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} variant={variant} />
      ))}
    </div>
  );
};

export default Skeleton;







