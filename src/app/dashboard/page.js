'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import StatsCard from './components/common/StatsCard'; 
import AdminContent from './components/admin/DashboardContent'; 
import VendorContent from './components/vendor/DashboardContent';
import UserContent from './components/user/DashboardContent';
import LoadingDashboard from './components/LoadingDashboard';

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
                console.log('pages posts data: ', res)
                
                if (!res.ok) {
                    throw new Error(`Failed to fetch rentals: ${res.status}`);
                }
                const data = await res.json();
                console.log('data home page :',data)
                setRentals(data);

                // Stats update
                setStats({
                    totalRentals: data.length,
                    totalUsers: session?.user?.role === 'admin' ? 150 : 0,
                    totalVendors:
                        session?.user?.role === 'admin'
                            ? data.filter((r) => r.type === 'owner').length
                            : session?.user?.role === 'owner'
                            ? data.length
                            : 0,
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
        return <LoadingDashboard/>;
    }

    if (!session) {
        return (
            <div className="text-center p-6">
                Access Denied. Please sign in.
            </div>
        );
    }

    const role = session.user?.role || 'renter';
    const userEmail = session.user?.email || '';

    let ContentComponent = UserContent;
    if (role === 'admin') {
        ContentComponent = AdminContent;
    } else if (role === 'owner') {
        ContentComponent = VendorContent;
    }

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <StatsCard
                    title="Total Rentals"
                    value={stats.totalRentals}
                    icon="🏠"
                />
                {role === 'admin' && (
                    <>
                        <StatsCard
                            title="Total Users"
                            value={stats.totalUsers}
                            icon="👥"
                        />
                        <StatsCard
                            title="Total owners"
                            value={stats.totalVendors}
                            icon="🏪"
                        />
                    </>
                )}
            </div>
            <ContentComponent rentals={rentals} userEmail={userEmail} />
        </div>
    );
}
