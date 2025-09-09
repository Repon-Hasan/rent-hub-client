'use client'

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

// Mock data (replace with API call)
const mockWishlist = [
  { id: 1, name: 'House in Dhaka', price: 5000000, image: '/images/house.jpg' },
  { id: 2, name: 'iPhone 15', price: 80000, image: '/images/iphone.jpg' },
  { id: 3, name: 'Bike', price: 25000, image: '/images/bike.jpg' },
];

export default function MyFavorites() {
  useEffect(() => {
    toast.success('Your favorites loaded!');
  }, []);

  const handleRemove = (name) => {
    // Replace with API call to remove from wishlist
    toast.success(`${name} removed from favorites!`);
  };

  return (
    <div className="container mx-auto p-4">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-semibold mb-6"
      >
        My Favorites
      </motion.h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {mockWishlist.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="card bg-base-200 shadow-md"
          >
            <figure>
              <img src={item.image} alt={item.name} className="h-48 w-full object-cover" />
            </figure>
            <div className="card-body">
              <h3 className="card-title">{item.name}</h3>
              <p>{item.price} BDT</p>
              <button
                className="btn btn-error btn-sm"
                onClick={() => handleRemove(item.name)}
              >
                Remove
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      {mockWishlist.length === 0 && (
        <p className="text-center text-gray-500 mt-4">No items in your favorites.</p>
      )}
    </div>
  );
}