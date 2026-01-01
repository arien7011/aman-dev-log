import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full font-medium transition-colors',
  {
    variants: {
      variant: {
        default:
          'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
        secondary:
          'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
        success:
          'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        warning:
          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
        error:
          'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
        outline:
          'border border-gray-300 bg-transparent text-gray-700 dark:border-gray-600 dark:text-gray-300',
      },
      size: {
        default: 'px-3 py-1 text-xs',
        sm: 'px-2 py-0.5 text-[10px]',
        lg: 'px-4 py-1.5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
