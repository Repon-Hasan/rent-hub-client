'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function ManageUsers() {
    const { data: session } = useSession();
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const api = process.env.NEXT_PUBLIC_BASE_URL;

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `/api/users?search=${encodeURIComponent(search)}`,
                { cache: 'no-store' },
            );
            if (!res.ok) throw new Error('Failed to fetch users');
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (session?.user?.role === 'admin') fetchUsers();
    }, [session, search]);

    const handleRoleChange = async (id, role) => {
        try {
            const res = await fetch(`/api/users/check-role`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, role }),
            });

            if (!res.ok) throw new Error('Failed to update role');

            setUsers((prev) =>
                prev.map((u) => (u._id === id ? { ...u, role } : u)),
            );

            toast.success('Role updated');
        } catch (err) {
            console.error(err);
            toast.error('Failed to update role');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            const res = await fetch(`/api/users?id=${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('Failed to delete user');

            setUsers((prev) => prev.filter((u) => u._id !== id));

            toast.success('User deleted');
        } catch (err) {
            console.error(err);
            toast.error('Failed to delete user');
        }
    };


    if (!session || session.user?.role !== 'admin') {
        return (
            <div className="text-center p-6 text-red-600 font-semibold">
                Access Denied
            </div>
        );
    }

    if (loading) {
        return (
            <div className="text-center p-6 text-gray-600 font-medium">
                Loading Users...
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">
                Manage Users
            </h1>

            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input input-bordered w-full max-w-md"
                />
            </div>

            <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
                <table className="table w-full">
                    <thead className="bg-base-200 text-base-content font-semibold">
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="text-center text-base-content/70 py-8 text-lg"
                                >
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        No users found.
                                    </motion.div>
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <motion.tr
                                    key={user._id}
                                    className="hover:bg-base-200/50 bg-gray-600 transition-colors"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <td>
                                        {user.name ||
                                            `${user.firstName} ${user.lastName}`}
                                    </td>
                                    <td>{user.email}</td>
                                    <td>
                                        <select
                                            className="select select-bordered select-primary w-full max-w-[140px]"
                                            value={user.role}
                                            onChange={(e) =>
                                                handleRoleChange(
                                                    user._id,
                                                    e.target.value,
                                                )
                                            }
                                        >
                                            <option value="user">Renter</option>
                                            <option value="vendor">
                                                Owner
                                            </option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-error btn-sm"
                                            onClick={() =>
                                                handleDelete(user._id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </motion.tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
