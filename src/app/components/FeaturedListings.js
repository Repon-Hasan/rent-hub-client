'use client';
import { useState, useEffect } from 'react';
import ListingCard from './ListingCard';

// Mock data
const mockListings = [
  { id: 1, title: 'Cozy Beach House', price: 120, category: 'Houses', image: '/house.jpg', aiSummary: 'Pros: Great view; Cons: Limited parking' },
  { id: 2, title: 'Toyota Camry', price: 50, category: 'Cars', image: '/car.jpg', aiSummary: 'Pros: Fuel-efficient; Cons: Older model' },
  { id: 3, title: 'Rice Field Plot', price: 30, category: 'Rice Fields', image: '/field.jpg', aiSummary: 'Pros: Fertile soil; Cons: Remote' },
];

export default function FeaturedListings() {
  const [listings, setListings] = useState(mockListings);

  // Uncomment for backend
  // useEffect(() => {
  //   fetch('/api/listings/featured')
  //     .then(res => res.json())
  //     .then(data => setListings(data));
  // }, []);

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-center mb-8 text-base-content dark:text-base-content">Featured Listings</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {listings.map(listing => (
          <ListingCard key={listing.id} {...listing} />
        ))}
      </div>
    </section>
  );
}