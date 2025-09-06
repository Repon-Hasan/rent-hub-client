'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Mock categories (replace with fetch from GET /api/categories)
const categories = [
  { name: 'Houses', icon: '🏠' },
  { name: 'Cars', icon: '🚗' },
  { name: 'Rice Fields', icon: '🌾' },
  { name: 'Ponds', icon: '💧' },
  { name: 'Gardens', icon: '🌱' },
  { name: 'Resorts', icon: '🏖️' },
];

export default function CategoriesSection() {
  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-center mb-8 text-base-content dark:text-base-content">Explore Categories</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((cat, index) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={`/listings?category=${cat.name.toLowerCase()}`}>
              <div className="card bg-base-100 dark:bg-base-200 shadow-xl hover:shadow-2xl transition-shadow">
                <div className="card-body text-center">
                  <span className="text-4xl text-base-content dark:text-base-content">{cat.icon}</span>
                  <h3 className="card-title justify-center text-base-content dark:text-base-content">{cat.name}</h3>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}