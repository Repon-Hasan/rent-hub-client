'use client';
import { useState } from 'react';

export default function RentalsTable({ rentals }) {
    const [data, setData] = useState(rentals);

    const handleAccept = async (id) => {
        // API call to update status
        const res = await fetch(`/api/rent-posts/${id}/accept`, {
            method: 'POST',
        });
        if (res.ok)
            setData((prev) =>
                prev.map((r) =>
                    r._id === id ? { ...r, status: 'Accepted' } : r,
                ),
            );
    };

    const handleDelete = async (id) => {
        const res = await fetch(`/api/rent-posts/${id}`, { method: 'DELETE' });
        if (res.ok) setData((prev) => prev.filter((r) => r._id !== id));
    };

    return (
        <div className="overflow-x-auto">
            <table className="table w-full bg-base-100">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Owner</th>
                        <th>Email</th>
                        <th>Rent</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((r) => (
                        <tr key={r._id}>
                            <td>{r.title}</td>
                            <td>{r.ownerName}</td>
                            <td>{r.email}</td>
                            <td>৳{r.rentPrice}</td>
                            <td>{r.status || 'Pending'}</td>
                            <td className="flex gap-2">
                                <button
                                    className="btn btn-xs btn-success"
                                    onClick={() => handleAccept(r._id)}
                                >
                                    Accept
                                </button>
                                <button
                                    className="btn btn-xs btn-error"
                                    onClick={() => handleDelete(r._id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
