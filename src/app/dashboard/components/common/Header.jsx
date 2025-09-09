
'use client';

import { signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header({ user }) {
    const handleSignOut = () => {
        signOut({ callbackUrl: '/auth/login' });
    };

    return (
    <header className="bg-base-100 shadow-sm p-4 flex justify-between items-center sticky top-0 z-10 text-base-content">
            <h1 className="text-xl font-semibold text-base-content">
                RentHub Dashboard
            </h1>
            <div className="flex items-center space-x-4">
                <Image
                    src={user.image || '/default-avatar.png'}
                    alt={user.name || user.email || 'User'}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover"
                    priority
                />
                <span className="text-sm text-base-content hidden md:block">
                    {user.name || user.email}
                </span>
                <button
                    onClick={handleSignOut}
                    className="bg-red-500 text-base-content px-4 py-2 rounded-md hover:bg-red-600 transition"
                >
                    Sign Out
                </button>
            </div>
        </header>
    );
}
