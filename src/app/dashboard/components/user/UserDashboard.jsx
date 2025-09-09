import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

// Mock data for demonstration (replace with real API calls)
const mockUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+880123456789',
    address: '123, Dhaka, Bangladesh',
};

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
];

const mockWishlist = [
    { id: 1, name: 'House in Dhaka', price: 5000000 },
    { id: 2, name: 'iPhone 15', price: 80000 },
];

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        toast.success('Welcome to your dashboard!');
    }, []);

    return (
        <div className="container mx-auto p-4 min-h-screen">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl font-bold mb-6 text-center"
            >
                User Dashboard
            </motion.h1>

            {/* Tabs for navigation */}
            <div className="tabs tabs-boxed mb-6">
                <a
                    className={`tab ${
                        activeTab === 'profile' ? 'tab-active' : ''
                    }`}
                    onClick={() => setActiveTab('profile')}
                >
                    Profile
                </a>
                <a
                    className={`tab ${
                        activeTab === 'orders' ? 'tab-active' : ''
                    }`}
                    onClick={() => setActiveTab('orders')}
                >
                    Order History
                </a>
                <a
                    className={`tab ${
                        activeTab === 'wishlist' ? 'tab-active' : ''
                    }`}
                    onClick={() => setActiveTab('wishlist')}
                >
                    Wishlist
                </a>
                <a
                    className={`tab ${
                        activeTab === 'settings' ? 'tab-active' : ''
                    }`}
                    onClick={() => setActiveTab('settings')}
                >
                    Settings
                </a>
            </div>

            {/* Tab Content */}
            {activeTab === 'profile' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="card bg-base-100 shadow-xl p-6"
                >
                    <h2 className="text-2xl font-semibold mb-4">
                        Profile Information
                    </h2>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Name</span>
                        </label>
                        <input
                            type="text"
                            defaultValue={mockUser.name}
                            className="input input-bordered"
                            disabled
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <input
                            type="email"
                            defaultValue={mockUser.email}
                            className="input input-bordered"
                            disabled
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Phone</span>
                        </label>
                        <input
                            type="text"
                            defaultValue={mockUser.phone}
                            className="input input-bordered"
                            disabled
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Address</span>
                        </label>
                        <input
                            type="text"
                            defaultValue={mockUser.address}
                            className="input input-bordered"
                            disabled
                        />
                    </div>
                    <button
                        className="btn btn-primary mt-4"
                        onClick={() =>
                            toast.success('Profile update feature coming soon!')
                        }
                    >
                        Edit Profile
                    </button>
                </motion.div>
            )}

            {activeTab === 'orders' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="card bg-base-100 shadow-xl p-6"
                >
                    <h2 className="text-2xl font-semibold mb-4">
                        Order History
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Product</th>
                                    <th>Price</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockOrders.map((order) => (
                                    <tr key={order.id}>
                                        <td>{order.id}</td>
                                        <td>{order.product}</td>
                                        <td>{order.price} BDT</td>
                                        <td>{order.status}</td>
                                        <td>{order.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}

            {activeTab === 'wishlist' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="card bg-base-100 shadow-xl p-6"
                >
                    <h2 className="text-2xl font-semibold mb-4">Wishlist</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {mockWishlist.map((item) => (
                            <div
                                key={item.id}
                                className="card bg-base-200 shadow-md"
                            >
                                <div className="card-body">
                                    <h3 className="card-title">{item.name}</h3>
                                    <p>{item.price} BDT</p>
                                    <button
                                        className="btn btn-error btn-sm"
                                        onClick={() =>
                                            toast.success(
                                                `${item.name} removed from wishlist!`,
                                            )
                                        }
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {activeTab === 'settings' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="card bg-base-100 shadow-xl p-6"
                >
                    <h2 className="text-2xl font-semibold mb-4">
                        Account Settings
                    </h2>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">New Password</span>
                        </label>
                        <input
                            type="password"
                            className="input input-bordered"
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Confirm Password</span>
                        </label>
                        <input
                            type="password"
                            className="input input-bordered"
                        />
                    </div>
                    <button
                        className="btn btn-primary mt-4"
                        onClick={() => toast.success('Password updated!')}
                    >
                        Update Password
                    </button>
                    <button
                        className="btn btn-error mt-4"
                        onClick={() => toast('Logged out successfully!')}
                    >
                        Logout
                    </button>
                </motion.div>
            )}
        </div>
    );
}
