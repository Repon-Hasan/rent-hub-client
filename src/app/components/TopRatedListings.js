'use client';

import { useState, useEffect } from 'react';
import ListingCard from './ListingCard';

// Mock data
const mockListings = [
  { id: 6, title: 'Garden Retreat', price: 80, category: 'Gardens', image: '/garden.jpg', aiSummary: 'Pros: Peaceful; Cons: Seasonal' },
  { id: 7, title: 'Apartment Downtown', price: 100, category: 'Houses', image: '/apartment.jpg', aiSummary: 'Pros: Central; Cons: Noisy' },
];

export default function TopRatedListings() {
  const [listings, setListings] = useState(mockListings);

  // Uncomment for backend
  // useEffect(() => {
  //   fetch('/api/listings/top-rated')
  //     .then(res => res.json())
  //     .then(data => setListings(data));
  // }, []);

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-center mb-8 text-base-content dark:text-base-content">Top Rated Listings</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {listings.map(listing => (
          <ListingCard key={listing.id} {...listing} />
        ))}
      </div>
    </section>
  );
}