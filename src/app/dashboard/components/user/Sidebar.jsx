'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function UserSidebar() {
    const pathname = usePathname();
    const links = [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/dashboard/rentals', label: 'Browse Rentals' },
        { href: '/dashboard/favorites', label: 'Favorites' },
    ];

    return (
        <div className="w-64 bg-white shadow-md h-screen flex flex-col">
            <div className="p-4 border-b">
                <h2 className="text-xl font-bold text-blue-600">User Panel</h2>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                {links.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`block p-3 rounded-md ${
                            pathname === link.href
                                ? 'bg-blue-100 text-blue-700'
                                : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        {link.label}
                    </Link>
                ))}
            </nav>
        </div>
    );
}
