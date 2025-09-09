'use client';

import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { useEffect } from 'react';

export default function MyProfile() {
    const { data } = useSession();
    const { name, email, image } = data?.user || {};
    console.log(data)
    useEffect(() => {
        toast.success('Your profile loaded!');
    }, []);

        return (
            <div className="bg-base-100 min-h-screen flex justify-center text-base-content">
                <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="card w-full max-w-md bg-base-100 shadow-xl p-6 text-center"
            >
                {/* Profile Image */}
                <div className="flex justify-center">
                    <motion.img
                        src={image || '/default-avatar.png'}
                        alt="Profile Picture"
                        className="w-32 h-32 rounded-full border-4 border-primary shadow-md"
                        whileHover={{ scale: 1.05 }}
                    />
                </div>

                {/* Profile Info */}
                <div className="mt-4 space-y-2">
                    <h2 className="text-xl font-semibold">
                        {name || 'Unknown User'}
                    </h2>
                    <p className="text-gray-500">{email}</p>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex gap-4 justify-center">
                    <button className="btn btn-outline btn-primary">
                        Edit Profile
                    </button>
                    <button className="btn btn-outline btn-secondary">
                        Logout
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
