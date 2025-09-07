
"use client";


import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Categories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('/api/add-category')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  return (
    <section className="py-12">
      <h2 className="mb-8 text-3xl font-bold text-center text-base-content dark:text-base-content">
        Explore Categories
      </h2>
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {categories.map((cat, index) => (
          <motion.div
            key={cat._id || cat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={`/rent-posts?category=${cat.name.toLowerCase()}`}>
              <div className="transition-shadow shadow-xl card bg-base-100 dark:bg-base-200 hover:shadow-2xl">
                <div className="text-center card-body">
                  {cat.imageUrl && (
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      className="w-16 h-16 mx-auto mb-2 rounded-full"
                    />
                  )}
                  <h3 className="justify-center card-title text-base-content dark:text-base-content">
                    {cat.name}
                  </h3>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
