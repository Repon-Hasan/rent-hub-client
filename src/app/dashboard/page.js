'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import StatsCard from './components/common/StatsCard';
import AdminContent from './components/admin/DashboardConent';
import VendorContent from './components/vendor/DashboardConent';
import UserContent from './components/user/DashboardConent';

export default function Dashboard() {
    const { data: session, status } = useSession();
    const [rentals, setRentals] = useState([]);
    const [stats, setStats] = useState({
        totalRentals: 0,
        totalUsers: 0,
        totalVendors: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRentals = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/api/rent-posts`,
                    {
                        cache: 'no-store',
                    },
                );
                if (!res.ok) throw new Error('Failed to fetch rentals');
                const data = await res.json();
                setRentals(data);
                setStats({
                    totalRentals: data.length,
                    totalUsers: 150, // Mock
                    totalVendors: data.filter((r) => r.type === 'vendor')
                        .length,
                });
            } catch (error) {
                console.error('Error fetching rentals:', error);
            } finally {
                setLoading(false);
            }
        };
        if (session) fetchRentals();
    }, [session]);

    if (status === 'loading' || loading) {
        return <div className="text-center p-6">Loading Dashboard...</div>;
    }

    if (!session) {
        return (
            <div className="text-center p-6">
                Access Denied. Please sign in.
            </div>
        );
    }

    const role = session.user?.role || 'user';
    const userEmail = session.user?.email || '';
    let ContentComponent;
    let displayedRentals = rentals;

    if (role === 'admin') {
        ContentComponent = AdminContent;
    } else if (role === 'vendor') {
        ContentComponent = VendorContent; // Vendor sees all rentals
    } else {
        displayedRentals = rentals.filter((r) => r.status === 'approved');
        ContentComponent = UserContent;
    }

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <StatsCard
                    title="Total Rentals"
                    value={stats.totalRentals}
                    icon="🏠"
                />
                <StatsCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon="👥"
                />
                <StatsCard
                    title="Total Vendors"
                    value={stats.totalVendors}
                    icon="🏪"
                />
            </div>
            <ContentComponent
                rentals={displayedRentals}
                userEmail={userEmail}
            />
        </div>
    );
}
