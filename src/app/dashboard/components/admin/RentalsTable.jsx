'use client';

import { useState } from 'react';
import Button from '../common/Button';

export default function RentalsTable({ rentals }) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentRentals = rentals.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(rentals.length / itemsPerPage);

    const handleStatusUpdate = async (id, status) => {
        try {
            const res = await fetch(`/api/rent-posts/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            if (res.ok) {
                // Refresh rentals or update state
                window.location.reload();
            } else {
                alert('Failed to update status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
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
                    {currentRentals.map((rental) => (
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
                                <Button
                                    variant="primary"
                                    onClick={() =>
                                        handleStatusUpdate(
                                            rental._id,
                                            'approved',
                                        )
                                    }
                                >
                                    Accept
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() =>
                                        handleStatusUpdate(
                                            rental._id,
                                            'rejected',
                                        )
                                    }
                                >
                                    Reject
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {totalPages > 1 && (
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
            )}
        </div>
    );
}
