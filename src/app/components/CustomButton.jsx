import * as React from 'react';
import { cn } from '@/lib/utils';

const CustomButton = React.forwardRef(
    ({ className, variant = 'default', size = 'default', ...props }, ref) => {
        const variants = {
            default: 'bg-blue-600 text-white hover:bg-blue-700',
            destructive: 'bg-red-600 text-white hover:bg-red-700',
            outline:
                'border border-gray-300 bg-white text-gray-900 hover:bg-gray-100',
            ghost: 'text-gray-900 hover:bg-gray-100',
        };

        const sizes = {
            default: 'h-10 px-4 py-2',
            sm: 'h-9 px-3',
            lg: 'h-11 px-8',
        };

        return (
            <button
                className={cn(
                    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed',
                    variants[variant],
                    sizes[size],
                    className,
                )}
                ref={ref}
                {...props}
            />
        );
    },
);
CustomButton.displayName = 'Button';

export {CustomButton };
