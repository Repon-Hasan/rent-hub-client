'use client';

import { CustomButton } from '@/app/components/CustomButton';
import { Input } from '@/app/components/Input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/app/components/Table';
import { useToast } from '@/app/components/useToast';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function ManageRentals() {
    const { data: session } = useSession();
    const { toast } = useToast();
    const [rentals, setRentals] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    const fetchRentals = async () => {
        setLoading(true);
        try {
            const url = new URL(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/rent-posts`,
            );
            if (search) url.searchParams.append('search', search);

            const res = await fetch(url.toString(), { cache: 'no-store' });
            if (!res.ok) throw new Error('Failed to fetch rentals');

            const data = await res.json();
            setRentals(data || []);
            setTotalPages(data.totalPages || 1);
        } catch (error) {
            console.error('Error fetching rentals:', error);
            toast({
                title: 'Error',
                description: 'Failed to load rentals',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (session?.user?.role === 'admin') fetchRentals();
    }, [session, page, search]);

    // handleAction: Accept & Reject
    const handleAction = async (id, status) => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/rent-posts/${id}`,
                {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status }),
                },
            );
            if (!res.ok) throw new Error(`Failed to update rental`);

            toast({ title: 'Success', description: `Rental ${status}` });

            // Local state update for instant UI refresh
            setRentals((prev) =>
                prev.map((r) => (r._id === id ? { ...r, status } : r)),
            );
        } catch (error) {
            console.error(`Error updating rental:`, error);
            toast({
                title: 'Error',
                description: `Failed to update rental`,
                variant: 'destructive',
            });
        }
    };

    // handleDelete: Delete only
    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this rental?')) return;
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/rent-posts/${id}`,
                { method: 'DELETE' },
            );
            if (!res.ok) throw new Error('Failed to delete rental');

            toast({ title: 'Success', description: 'Rental deleted' });

            // Remove deleted item from local state instantly
            setRentals((prev) => prev.filter((r) => r._id !== id));
        } catch (error) {
            console.error('Error deleting rental:', error);
            toast({
                title: 'Error',
                description: 'Failed to delete rental',
                variant: 'destructive',
            });
        }
    };

    if (!session || session.user?.role !== 'admin') {
        return <div className="text-center p-6">Access Denied</div>;
    }

    if (loading) {
        return <div className="text-center p-6">Loading Rentals...</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">
                Custom Rentals Management
            </h1>

            <div className="mb-4">
                <Input
                    placeholder="Search by title or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-md"
                />
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>User Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rentals.map((rental) => (
                        <TableRow className="text-gray-700" key={rental._id}>
                            <TableCell>{rental.title}</TableCell>
                            <TableCell>{rental.email}</TableCell>
                            <TableCell className="capitalize">
                                {rental.status || 'pending'}
                            </TableCell>
                            <TableCell className="flex gap-2">
                                <CustomButton
                                    onClick={() =>
                                        handleAction(rental._id, 'approved')
                                    }
                                    disabled={rental.status === 'approved'}
                                >
                                    Accept
                                </CustomButton>

                                <CustomButton
                                    onClick={() =>
                                        handleAction(rental._id, 'rejected')
                                    }
                                    disabled={rental.status === 'rejected'}
                                    variant="outline"
                                >
                                    Reject
                                </CustomButton>

                                <CustomButton
                                    onClick={() => handleDelete(rental._id)}
                                    variant="destructive"
                                >
                                    🗑 Delete
                                </CustomButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="flex justify-between mt-4">
                <CustomButton
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                >
                    Previous
                </CustomButton>
                <span>
                    Page {page} of {totalPages}
                </span>
                <CustomButton
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                >
                    Next
                </CustomButton>
            </div>
        </div>
    );
}
