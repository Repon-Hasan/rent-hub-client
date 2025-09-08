"use client";
import React from "react";
import Link from "next/link";

const PaymentCancelled = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
        <h1 className="text-3xl font-bold text-red-600 mb-4">⚠️ Payment Cancelled</h1>
        <p className="text-gray-700 mb-6">
          Your payment was not completed. You can try booking again.
        </p>
        <Link
          href="/"
          className="inline-block bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition"
        >
          Go Back
        </Link>
      </div>
    </div>
  );
};

export default PaymentCancelled;
