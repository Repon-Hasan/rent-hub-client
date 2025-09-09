'use client'

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';

// Mock data (replace with API call)
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
        product: 'Phone',
        price: 15000,
        status: 'Pending',
        date: '2025-09-01',
    },
    {
        id: 3,
        product: 'House',
        price: 5000000,
        status: 'Processing',
        date: '2025-09-05',
    },
];

export default function MyOrders() {

    const { data: session } = useSession();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (session?.user?.email) {
            fetch(`/api/bookings?email=${session.user.email}`)
                .then((res) => res.json())
                .then((data) => setOrders(data))
                .catch((err) => console.error('Fetch error:', err));
        }
    }, [session?.user?.email]);

    console.log(orders)

    if (!session) {
        return (
            <p className="text-center text-red-500">
                Please login to see your orders.
            </p>
        );
    }

    // useEffect(() => {
    //     toast.success('Your orders loaded!');
    // }, []);

    return (
        <div className="container mx-auto text-gray-800 p-4">
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
                <p className=" text-gray-500 mt-4 h-[500px] flex justify-center items-center">
                    No orders found.
                </p>
            )}
        </div>
    );
}
