'use client';

export default function Button({
    children,
    variant = 'primary',
    className,
    ...props
}) {
    const baseStyles = 'px-4 py-2 rounded font-medium transition';
    const variantStyles = {
        primary: 'bg-blue-500 text-white hover:bg-blue-600',
        secondary: 'bg-gray-500 text-white hover:bg-gray-600',
        danger: 'bg-red-500 text-white hover:bg-red-600',
    };

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${
                className || ''
            }`}
            {...props}
        >
            {children}
        </button>
    );
}
