'use client';

import { CustomButton } from '@/app/components/CustomButton';
import { Input } from '@/app/components/Input';
// import { Input } from '@app/components/Input';
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
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/rent-posts`,
                { cache: 'no-store' },
            );
            if (!res.ok) throw new Error('Failed to fetch rentals');

            const data = await res.json();
            console.log('data from API:', data); 

            setRentals(data || []); // rentals array
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

    const handleAction = async (id, action) => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/rent-posts/${id}`,
                {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action }),
                },
            );
            if (!res.ok) {
                throw new Error(
                    `Failed to ${action} rental: ${res.status} ${res.statusText}`,
                );
            }
            toast({ title: 'Success', description: `Rental ${action}ed` });
            fetchRentals();
        } catch (error) {
            console.error(`Error ${action}ing rental:`, error);
            toast({
                title: 'Error',
                description: `Failed to ${action} rental`,
                variant: 'destructive',
            });
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this rental?')) return;
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/rent-posts/${id}`,
                {
                    method: 'DELETE',
                },
            );
            if (!res.ok) {
                throw new Error(
                    `Failed to delete rental: ${res.status} ${res.statusText}`,
                );
            }
            toast({ title: 'Success', description: 'Rental deleted' });
            fetchRentals();
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
                            <TableCell>{rental.status}</TableCell>
                            <TableCell>
                                <CustomButton
                                    onClick={() =>
                                        handleAction(rental._id, 'approve')
                                    }
                                    disabled={rental.status === 'approved'}
                                    className="mr-2"
                                >
                                    Approve
                                </CustomButton>
                                <CustomButton
                                    onClick={() =>
                                        handleAction(rental._id, 'reject')
                                    }
                                    disabled={rental.status === 'rejected'}
                                    variant="outline"
                                    className="mr-2"
                                >
                                    Reject
                                </CustomButton>
                                <CustomButton
                                    onClick={() => handleDelete(rental._id)}
                                    variant="destructive"
                                >
                                    Delete
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
