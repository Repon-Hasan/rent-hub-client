"use client";

import { useState, useEffect } from 'react';
import ListingCard from './ListingCard';

export default function FeaturedListings() {
  const [listings, setListings] = useState([]);
<<<<<<< HEAD
<<<<<<< HEAD
  const api = process.env.NEXT_PUBLIC_BASE_URL;
=======
  const [isLoading, setIsLoading] = useState(true);

>>>>>>> 5358e810e02d460f3077cdab9618d35e9c3cddd1
=======
  const api = process.env.NEXT_PUBLIC_BASE_URL;
  const [isLoading, setIsLoading] = useState(true);

>>>>>>> 44e2e1644d7ac8c27a83cbc507d110d1ccec6930
  useEffect(() => {
    fetch(`${api}/api/rent-posts?featured=true`)
      .then(res => res.json())
      .then(data => {
        // The most likely cause of the error is that the API response is an object
        // containing the listings array, e.g., { listings: [...] }.
        // This line checks for that and safely sets the state.
        const listingsArray = data.listings || data;
        
        if (Array.isArray(listingsArray)) {
          setListings(listingsArray);
        } else {
          console.error("Fetched data is not an array:", listingsArray);
          setListings([]);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch featured listings:", error);
        setListings([]);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <section className="py-12 text-center">
        <h2 className="mb-8 text-3xl font-bold text-base-content">
          Featured Listings
        </h2>
        <div className="flex items-center justify-center h-48">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </section>
    );
  }

  if (listings.length === 0) {
    return (
      <section className="py-12 text-center">
        <h2 className="mb-8 text-3xl font-bold text-base-content">
          Featured Listings
        </h2>
        <div className="p-8 text-center text-gray-500">
          <p>No featured listings are available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 44e2e1644d7ac8c27a83cbc507d110d1ccec6930
      <section className="py-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-base-content dark:text-base-content">
              Featured Listings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.isArray(listings) ? (
                  listings.map((listing) => (
                      <ListingCard
                          key={listing._id}
                          id={listing._id}
                          title={listing.title}
                          price={listing.rentPrice}
                          category={listing.category}
                          image={listing.imageUrl}
                          aiSummary={listing.aiSummary}
                      />
                  ))
              ) : (
                  <p>No listings</p>
              )}
          </div>
      </section>
<<<<<<< HEAD
=======
    <section className="py-12">
      <h2 className="mb-8 text-3xl font-bold text-center text-base-content">
        Featured Listings
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {listings.map(listing => (
          <ListingCard
            key={listing._id}
            id={listing._id}
            title={listing.title}
            price={listing.rentPrice}
            category={listing.category}
            image={listing.imageUrl}
            aiSummary={listing.aiSummary}
          />
        ))}
      </div>
    </section>
>>>>>>> 5358e810e02d460f3077cdab9618d35e9c3cddd1
=======

>>>>>>> 44e2e1644d7ac8c27a83cbc507d110d1ccec6930
  );
}