'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useToast as toast } from '@/components/ui/useToast';

export default function Analytics() {
    const { data: session } = useSession();
    const [rentalsData, setRentalsData] = useState([]);
    const [usersData, setUsersData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoading(true);
            try {
                const [rentalsRes, usersRes] = await Promise.all([
                    fetch('/api/rent-posts/analytics', { cache: 'no-store' }),
                    fetch('/api/users/analytics', { cache: 'no-store' }),
                ]);

                if (!rentalsRes.ok || !usersRes.ok) {
                    throw new Error('Failed to fetch analytics');
                }

                const rentalsData = await rentalsRes.json();
                const usersData = await usersRes.json();
                setRentalsData(rentalsData);
                setUsersData(usersData);
            } catch (error) {
                console.error('Error fetching analytics:', error);
                toast({
                    title: 'Error',
                    description: 'Failed to load analytics',
                    variant: 'destructive',
                });
            } finally {
                setLoading(false);
            }
        };

        if (session?.user?.role === 'admin') fetchAnalytics();
    }, [session]);

    if (!session || session.user?.role !== 'admin') {
        return <div className="text-center p-6">Access Denied</div>;
    }

    if (loading) {
        return <div className="text-center p-6">Loading Analytics...</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Analytics Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Rentals per Month</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={rentalsData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#3b82f6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>User Growth</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={usersData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#10b981" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
