"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const bannerTexts = [
  "Find your dream home",
  "Rent cars, houses, or anything!",
  "Fast, secure, and AI-powered listings",
];

export default function Banner() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % bannerTexts.length);
    }, 4000); // change text every 4s
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-[80vh] flex items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 overflow-hidden">
      {/* Animated Background Circles */}
      <div className="absolute w-[600px] h-[600px] bg-white/10 rounded-full animate-ping top-[-150px] left-[-150px]"></div>
      <div className="absolute w-[400px] h-[400px] bg-white/20 rounded-full animate-pulse bottom-[-100px] right-[-100px]"></div>

      {/* Main Content */}
      <div className="relative text-center px-4 max-w-3xl">
        <motion.h1
          key={index}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold text-white mb-6"
        >
          {bannerTexts[index]}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-white/90 text-lg md:text-xl mb-8"
        >
          Explore thousands of products for rent – houses, cars, and more.
        </motion.p>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex justify-center gap-4 flex-wrap"
        >
          <Link href="/listings" className="btn btn-primary px-6 py-3 rounded-md shadow-lg hover:scale-105 transition-transform">
            Browse Listings
          </Link>
          <Link href="/register" className="btn btn-secondary px-6 py-3 rounded-md shadow-lg hover:scale-105 transition-transform">
            Become a Member
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
