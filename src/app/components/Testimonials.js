'use client';


import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Mock data
const mockTestimonials = [
  { id: 1, user: 'John D.', rating: 5, comment: 'Renting a pond was seamless! Highly recommend.' },
  { id: 2, user: 'Sarah M.', rating: 4.5, comment: 'Great car rental experience, super reliable.' },
];

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState(mockTestimonials);

  // Uncomment for backend
  // useEffect(() => {
  //   fetch('/api/reviews/top')
  //     .then(res => res.json())
  //     .then(data => setTestimonials(data));
  // }, []);

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-center mb-8 text-base-content dark:text-base-content">What People Are Saying</h2>
      <div className="carousel carousel-center max-w-full p-4 space-x-4">
        {testimonials.map((t, index) => (
          <motion.div
            key={t.id}
            className="carousel-item"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <div className="card bg-base-100 dark:bg-base-200 shadow-xl w-80">
              <div className="card-body">
                <h3 className="card-title text-base-content dark:text-base-content">{t.user}</h3>
                <p className="text-yellow-400 dark:text-yellow-300">{'★'.repeat(Math.floor(t.rating))}</p>
                <p className="text-base-content/70 dark:text-base-content/70">{t.comment}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}