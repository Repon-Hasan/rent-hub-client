
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';




export default function MyOrders() {
    const { data: session } = useSession();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        async function fetchBookings() {
            if (!session?.user?.email) {
                setOrders([]);
                return;
            }
            try {
                // Fetch all bookings for the user
                const res = await fetch(`/api/bookings?email=${session.user.email}`);
                if (!res.ok) {
                    setOrders([]);
                    return;
                }
                const data = await res.json();
                setOrders(Array.isArray(data) ? data : []);
            } catch {
                setOrders([]);
            }
        }
        fetchBookings();
    }, [session]);

    if (!session) {
        return (
            <p className="text-center text-red-500">
                Please login to see your orders.
            </p>
        );
    }

    // Helper to format date as '10th Jun 2025'
    function formatDate(dateStr) {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        const day = date.getDate();
        const month = date.toLocaleString('en-US', { month: 'short' });
        const year = date.getFullYear();
        // Get ordinal suffix
        const getOrdinal = (n) => {
            if (n > 3 && n < 21) return 'th';
            switch (n % 10) {
                case 1: return 'st';
                case 2: return 'nd';
                case 3: return 'rd';
                default: return 'th';
            }
        };
        return `${day}${getOrdinal(day)} ${month} ${year}`;
    }

    return (
        <div className="bg-base-100 text-base-content min-h-screen">
            <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-2xl font-semibold mb-6"
            >
                My Orders
            </motion.h2>
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr className='text-black'>
                            <th>Serial</th>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, idx) => (
                            <motion.tr
                                key={order._id || order.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <td>{idx + 1}</td>
                                <td>{order.itemTitle || order.category || '-'}</td>
                                <td>{order.totalCost ? `${order.totalCost} BDT` : '-'}</td>
                                <td>
                                    <span
                                        className={`badge ${
                                            order.status === 'Delivered'
                                                ? 'badge-success'
                                                : order.status === 'Pending'
                                                ? 'badge-warning'
                                                : 'badge-info'
                                        }`}
                                    >
                                        {order.status || 'Pending'}
                                    </span>
                                </td>
                                <td>{order.createdAt ? formatDate(order.createdAt) : '-'}</td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {orders.length === 0 && (
                <p className="text-gray-500 mt-4 h-[500px] flex justify-center items-center">
                    No orders found.
                </p>
            )}
        </div>
    );
}
