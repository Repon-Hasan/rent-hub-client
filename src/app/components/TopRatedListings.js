'use client';
import { useState, useEffect } from 'react';
import ListingCard from './ListingCard';

export default function TopRatedListings() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    fetch('/api/rent-posts?sort=rating_desc')
      .then(res => res.json())
      .then(data => setListings(data))
      .catch(() => setListings([]));
  }, []);

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-center mb-8 text-base-content dark:text-base-content">Top Rated Listings</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {listings.map(listing => (
          <ListingCard key={listing._id} id={listing._id} title={listing.title} price={listing.rentPrice} category={listing.category} image={listing.imageUrl} aiSummary={listing.aiSummary} />
        ))}
      </div>
    </section>
  );
}