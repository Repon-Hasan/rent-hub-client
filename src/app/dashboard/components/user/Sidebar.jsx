'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function UserSidebar() {
    const pathname = usePathname();
    const links = [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/dashboard/renter/my-orders', label: 'My Orders' },
        { href: '/dashboard/renter/my-favorites', label: 'Favorites List' },
        { href: '/dashboard/renter/review', label: 'Reviews' },
        { href: '/dashboard/renter/my-profile', label: 'Profile' },
    ];

    return (
    <div className="w-64 bg-base-200 shadow-md h-screen flex flex-col text-base-content">
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
