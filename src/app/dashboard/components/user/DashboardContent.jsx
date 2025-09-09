'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function UserContent({ rentals }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredRentals = rentals.filter((rental) =>
        rental.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <input
                    type="text"
                    placeholder="Search rentals..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border rounded-md"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRentals.map((rental) => (
                    <div
                        key={rental._id}
                        className="bg-white p-4 rounded-xl shadow-sm"
                    >
                        <Image
                            src={rental.imageUrl || '/placeholder.jpg'}
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
                        <Link href={`/rent-posts/${rental._id}`}>
                            <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                                View Details
                            </button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
