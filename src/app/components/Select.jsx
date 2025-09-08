'use client';

import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils'; // Shadcn/UI utility for className merging

// Select Component
const Select = ({ value, onValueChange, children, className }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                selectRef.current &&
                !selectRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={cn('relative', className)} ref={selectRef}>
            <SelectTrigger
                onClick={() => setIsOpen(!isOpen)}
                isOpen={isOpen}
                value={value}
            >
                {children.find((child) => child.type === SelectValue)?.props
                    ?.children || 'Select an option'}
            </SelectTrigger>
            {isOpen && (
                <SelectContent>
                    {React.Children.map(children, (child) => {
                        if (child.type === SelectContent) {
                            return React.cloneElement(child, {
                                onValueChange,
                                setIsOpen,
                            });
                        }
                        return null;
                    })}
                </SelectContent>
            )}
        </div>
    );
};

// SelectTrigger Component
const SelectTrigger = ({ children, onClick, isOpen, value, className }) => (
    <button
        type="button"
        className={cn(
            'flex items-center justify-between w-full px-3 py-2 border rounded-md bg-white text-sm',
            isOpen ? 'border-blue-500' : 'border-gray-300',
            className,
        )}
        onClick={onClick}
    >
        {children || value || 'Select an option'}
        <svg
            className={cn('w-4 h-4 ml-2', isOpen ? 'rotate-180' : '')}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
            />
        </svg>
    </button>
);

// SelectContent Component
const SelectContent = ({ children, onValueChange, setIsOpen, className }) => (
    <div
        className={cn(
            'absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg',
            className,
        )}
    >
        {React.Children.map(children, (child) => {
            if (child.type === SelectItem) {
                return React.cloneElement(child, { onValueChange, setIsOpen });
            }
            return null;
        })}
    </div>
);

// SelectItem Component
const SelectItem = ({
    value,
    children,
    onValueChange,
    setIsOpen,
    className,
}) => (
    <div
        className={cn(
            'px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer',
            className,
        )}
        onClick={() => {
            onValueChange(value);
            setIsOpen(false);
        }}
    >
        {children}
    </div>
);

// SelectValue Component
const SelectValue = ({ children, placeholder, className }) => (
    <span className={cn('text-sm', className)}>{children || placeholder}</span>
);

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };
