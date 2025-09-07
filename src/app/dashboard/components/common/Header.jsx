'use client';

import { signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Header({ user }) {
    const handleSignOut = () => {
        signOut({ callbackUrl: '/auth/login' });
    };

    return (
        <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
            <h1 className="text-xl font-semibold text-gray-800">
                RentHub Dashboard
            </h1>
            <div className="flex items-center space-x-4">
                {user.image && (
                    <img
                        src={user.image}
                        alt={user.name || 'User'}
                        className="w-8 h-8 rounded-full"
                    />
                )}
                <span className="text-sm text-gray-600 hidden md:block">
                    {user.name || user.email}
                </span>
                <button
                    onClick={handleSignOut}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                >
                    Sign Out
                </button>
            </div>
        </header>
    );
}
