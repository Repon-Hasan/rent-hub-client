'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function VendorContent({ rentals }) {
    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-4">All Rentals</h3>
                <Link
                    href="/dashboard/add"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                    Add New Rental
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rentals.map((rental) => (
                    <div
                        key={rental._id}
                        className="bg-white p-4 rounded-xl shadow-sm"
                    >
                        <Image
                               src={(rental.imageUrl ? rental.imageUrl.replace('i.ibb.co.com', 'i.ibb.co') : '/placeholder.jpg')}
                            alt={rental.title}
                            width={300}
                            height={200}
                            className="w-full h-48 object-cover rounded-md mb-4"
                        />
                        <h4 className="text-lg font-semibold">
                            {rental.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                            {rental.location}
                        </p>
                        <p className="text-lg font-bold text-green-600">
                            ৳{rental.rentPrice}
                        </p>
                        <p className="text-sm">
                            Status:{' '}
                            <span
                                className={`${
                                    rental.status === 'approved'
                                        ? 'text-green-600'
                                        : rental.status === 'rejected'
                                        ? 'text-red-600'
                                        : 'text-yellow-600'
                                }`}
                            >
                                {rental.status}
                            </span>
                        </p>
                        <div className="mt-2 space-x-2">
                            <Link
                                href={`/dashboard/edit/${rental._id}`}
                                className="text-blue-600 hover:underline"
                            >
                                Edit
                            </Link>
                            <button className="text-red-600 hover:underline">
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
