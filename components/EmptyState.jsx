const EmptyState = ({ title = 'Nothing here', description = 'Add an asset or update filters.' }) => (
  <div 
    className="border border-dashed border-border rounded-2xl p-6 text-center text-muted-foreground"
    role="status"
    aria-live="polite"
    aria-label={`Empty state: ${title}`}
  >
    <p className="text-lg text-foreground">{title}</p>
    <p className="text-sm mt-2">{description}</p>
  </div>
);

export default EmptyState;
