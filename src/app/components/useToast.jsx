'use client';

import { useEffect, useState } from 'react';
import { Toaster, toast as hotToast } from 'react-hot-toast';

export function useToast() {
    return {
        toast: ({ title, description, variant = 'default' }) => {
            hotToast.custom(
                (t) => (
                    <div
                        className={`${
                            t.visible ? 'animate-enter' : 'animate-leave'
                        } max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
                    >
                        <div className="flex-1 w-0 p-4">
                            <div className="flex items-start">
                                <div className="ml-3 flex-1">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {title}
                                    </p>
                                    {description && (
                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                            {description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex border-l border-gray-200">
                            <button
                                onClick={() => hotToast.dismiss(t.id)}
                                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                ),
                {
                    duration: 3000,
                    style: {
                        background:
                            variant === 'destructive' ? '#fee2e2' : '#ffffff',
                        border:
                            variant === 'destructive'
                                ? '1px solid #ef4444'
                                : '1px solid #e5e7eb',
                    },
                },
            );
        },
    };
}

export function ToasterWrapper() {
    return <Toaster position="top-right" />;
}
