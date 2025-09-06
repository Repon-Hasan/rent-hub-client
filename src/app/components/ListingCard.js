'use client';

import Link from 'next/link';
import Swal from 'sweetalert2';

export default function ListingCard({ id, title, price, category, image, aiSummary }) {
  const handleBookmark = () => {
    // Mock bookmark (replace with POST /api/bookmarks)
    Swal.fire({
      icon: 'success',
      title: 'Bookmarked!',
      text: `${title} has been added to your favorites.`,
      timer: 1500,
      showConfirmButton: false,
    });
  };

  return (
    <div className="card bg-base-100 dark:bg-base-200 shadow-xl hover:shadow-2xl transition-shadow">
      <figure>
        <img src={image || '/placeholder.jpg'} alt={title} className="h-48 w-full object-cover" />
      </figure>
      <div className="card-body">
        <h2 className="card-title text-base-content dark:text-base-content">{title}</h2>
        <p className="text-sm text-base-content/70 dark:text-base-content/70">{category}</p>
        <p className="font-bold text-base-content dark:text-base-content">${price}/day</p>
        {aiSummary && (
          <p className="text-sm italic text-base-content/70 dark:text-base-content/70">AI Insight: {aiSummary}</p>
        )}
        <div className="card-actions justify-between mt-4">
          <Link href={`/listings/${id}`} className="btn btn-primary btn-sm">View Details</Link>
          <button onClick={handleBookmark} className="btn btn-ghost btn-sm">
            <svg className="w-5 h-5 text-base-content dark:text-base-content" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}