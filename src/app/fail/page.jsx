"use-client"

import Link from "next/link";

export default function Page() {
  return (
    <div className="flex items-center justify-center h-screen bg-red-50">
      <div className="bg-white p-10 rounded-2xl shadow-lg text-center">
        <h1 className="text-3xl font-bold text-red-600">❌ Payment Failed!</h1>
        <p className="mt-4 text-gray-700">Something went wrong. Please try again.</p>
        <Link href={'/become-owner'} className="btn btn-neutral mt-6 rounded-2xl w-full">Try Again</Link>
      </div>
    </div>
  );
}
