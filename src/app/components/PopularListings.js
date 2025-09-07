
'use client';

import { useState, useEffect } from 'react';
import ListingCard from './ListingCard';

// Mock data
const mockListings = [
  { id: 4, title: 'Luxury Resort', price: 200, category: 'Resorts', image: '/resort.jpg', aiSummary: 'Pros: All-inclusive; Cons: Pricey' },
  { id: 5, title: 'Honda Civic', price: 45, category: 'Cars', image: '/car2.jpg', aiSummary: 'Pros: Reliable; Cons: Small trunk' },
];

export default function PopularListings() {
  const [listings, setListings] = useState(mockListings);

  // Uncomment for backend
  // useEffect(() => {
  //   fetch('/api/listings/popular')
  //     .then(res => res.json())
  //     .then(data => setListings(data));
  // }, []);

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-center mb-8 text-base-content dark:text-base-content">Popular Listings</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {listings.map(listing => (
          <ListingCard key={listing.id} {...listing} />
        ))}
      </div>
    </section>
  );
}