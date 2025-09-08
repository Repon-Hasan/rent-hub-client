'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { CustomButton } from '@/components/ui/CustomButton';
import { Input } from '@/components/ui/Input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/Table';
import { useToast } from '@/components/ui/useToast';
import Button from '../components/common/Button';
import LoadingDashboard from '../components/LoadingDashboard';

export default function ManageRentals() {
    const { data: session } = useSession();
    const { toast } = useToast();
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);
    const api = process.env.NEXT_PUBLIC_BASE_URL;

    

    const fetchRentals = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${api}/api/rent-posts`, {
                cache: 'no-store',
            });
            if (!res.ok) {
                throw new Error(
                    `Failed to fetch rentals: ${res.status} ${res.statusText}`,
                );
            }
            const rentals = await res.json(); 
            console.log('rentals', rentals);
            setRentals(rentals);
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
    }, [session]);

    const handleAction = async (id, action) => {
        try {
            const res = await fetch(`${api}/api/rent-posts/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action }),
            });
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
            const res = await fetch(`${api}/api/rent-posts/${id}`, {
                method: 'DELETE',
            });
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
        return <LoadingDashboard/>;
    }

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
            <h1 className="text-2xl font-bold mb-4">Manage Rentals</h1>
            <div className="mb-4">
                {/* <Input
                    placeholder="Search by title or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-md"
                /> */}
            </div>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {rentals.map((rental) => (
                        <tr key={rental._id}>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                {rental.title}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                                {rental.location}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                                ৳{rental.rentPrice}
                            </td>
                            <td className="px-6 py-4 text-sm">
                                <span
                                    className={`px-2 py-1 rounded-full text-xs ${
                                        rental.status === 'approved'
                                            ? 'bg-green-100 text-green-800'
                                            : rental.status === 'rejected'
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                    }`}
                                >
                                    {rental.status}
                                </span>
                            </td>

                            <td className="px-6 py-4 text-sm space-x-2">
                                <Button className='cursor-pointer'
                                    variant="primary"
                                    onClick={() =>
                                        handleAction(rental._id, 'approve')
                                    }
                                    disabled={rental.status === 'approved'}
                                >
                                    Approve
                                </Button>
                                <Button className='btn-sm text-sm cursor-pointer'
                                    onClick={() =>
                                        handleAction(rental._id, 'reject')
                                    }
                                    disabled={rental.status === 'rejected'}
                                    variant="danger"
                                >
                                    Reject
                                </Button>
                                <Button className='cursor-pointer'
                                    onClick={() => handleDelete(rental._id)}
                                    variant="danger"
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* {totalPages > 1 && (
                <div className="p-4 flex justify-between items-center bg-gray-50">
                    <div className="text-sm text-gray-600">
                        Showing {indexOfFirstItem + 1} to{' '}
                        {Math.min(indexOfLastItem, rentals.length)} of{' '}
                        {rentals.length}
                    </div>
                    <div className="flex space-x-2">
                        <Button
                            onClick={() =>
                                setCurrentPage((prev) => Math.max(prev - 1, 1))
                            }
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        <Button
                            onClick={() =>
                                setCurrentPage((prev) =>
                                    Math.min(prev + 1, totalPages),
                                )
                            }
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )} */}
        </div>
    );
}



;