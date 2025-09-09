"use client";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50 p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        {/* Icon / visual */}
        <div className="mb-4">
          <svg
            className="w-16 h-16 text-green-600 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2l4-4m0 6a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold mb-2 text-green-700">Payment Successful!</h1>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          Congratulations! You are now upgraded to an owner. Your account has been successfully updated.
        </p>

        {/* CTA Button */}
        <a
          href="/dashboard"
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}
