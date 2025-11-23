// Compatibility wrapper for Card component
// Provides the old API (title, description, actions) while using shadcn Card internally
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './card';

export default function CardWrapper({ title, description, actions, children, className, ...props }) {
  return (
    <Card className={className} {...props}>
      {(title || description || actions) && (
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {title && <CardTitle>{title}</CardTitle>}
              {description && <CardDescription>{description}</CardDescription>}
            </div>
            {actions && (
              <div className="flex gap-2 flex-shrink-0">
                {actions}
              </div>
            )}
          </div>
        </CardHeader>
      )}
      {children && <CardContent>{children}</CardContent>}
    </Card>
  );
}

