// Compatibility wrapper for Card component
// Provides the old API (title, description, actions) while using shadcn Card internally
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './card';

export default function CardWrapper({ title, description, actions, children, className, ...props } = {}) {
  return (
    <Card className={className} {...props}>
      {(title || description || actions) && (
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              {title && <CardTitle className="text-xl sm:text-2xl">{title}</CardTitle>}
              {description && <CardDescription className="text-sm mt-1">{description}</CardDescription>}
            </div>
            {actions && (
              <div className="flex gap-2 flex-shrink-0 flex-wrap">
                {actions}
              </div>
            )}
          </div>
        </CardHeader>
      )}
      {children && <CardContent className="pt-0">{children}</CardContent>}
    </Card>
  );
}

