"use client";

import React from "react";
import Link from "next/link";

const BookingSuccess = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
        <h1 className="text-3xl font-bold text-green-700 mb-4">🎉 Booking Confirmed!</h1>
        <p className="text-gray-700 mb-6">
          Thank you! Your booking has been successfully completed.
        </p>
        <Link
          href="/dashboard/my-orders"
          className="inline-block bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
        >
          View My Bookings
        </Link>
      </div>
    </div>
  );
};

export default BookingSuccess;
