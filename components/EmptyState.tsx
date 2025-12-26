import { ReactNode, ElementType, isValidElement, createElement } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FileQuestion, LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  icon?: LucideIcon | ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  action,
  className
}: EmptyStateProps) {
  // Render icon - check if it's a component or element
  const renderIcon = () => {
    if (!icon) {
      return <FileQuestion className="w-10 h-10 text-primary/50" />;
    }

    // If icon is already a valid React element, render it
    if (isValidElement(icon)) {
      return icon;
    }

    // If icon is a component constructor/function, create an element from it
    if (typeof icon === 'function') {
      return createElement(icon as any, { className: "w-10 h-10 text-primary/50" });
    }

    // Fallback to default icon
    return <FileQuestion className="w-10 h-10 text-primary/50" />;
  };

  return (
    <div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        {renderIcon()}
      </div>
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      <p className="text-muted-foreground max-w-md mb-6">{description}</p>
      {action ? (
        action
      ) : actionLabel && actionHref ? (
        <Button asChild className="gradient-primary">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      ) : actionLabel && onAction ? (
        <Button className="gradient-primary" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
