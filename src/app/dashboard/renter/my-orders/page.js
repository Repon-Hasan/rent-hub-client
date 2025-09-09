
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';


const mockOrders = [
    {
        id: 1,
        product: 'Bike',
        price: 25000,
        status: 'Delivered',
        date: '2025-08-15',
    },
    {
        id: 2,
        product: 'Camera',
        price: 12000,
        status: 'Pending',
        date: '2025-08-10',
    },
];

export default function MyOrders() {
    const { data: session } = useSession();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        // Replace with API call if needed
        setOrders(mockOrders);
    }, []); // Dependency array is always []

    if (!session) {
        return (
            <p className="text-center text-red-500">
                Please login to see your orders.
            </p>
        );
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
                            <th>Order ID</th>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <motion.tr
                                key={order.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <td>{order.id}</td>
                                <td>{order.product}</td>
                                <td>{order.price} BDT</td>
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
                                        {order.status}
                                    </span>
                                </td>
                                <td>{order.date}</td>
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
