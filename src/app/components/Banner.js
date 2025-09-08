"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const bannerTexts = [
  "Find your dream home",
  "Rent cars, houses, or anything!",
  "Fast, secure, and AI-powered listings",
];

export default function Banner() {
  const [index, setIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % bannerTexts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/rent-posts?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <section className="relative w-full h-[80vh] flex items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 overflow-hidden">
      {/* Animated Background Circles */}
      <div className="absolute w-[600px] h-[600px] bg-white/10 rounded-full animate-ping top-[-150px] left-[-150px]"></div>
      <div className="absolute w-[400px] h-[400px] bg-white/20 rounded-full animate-pulse bottom-[-100px] right-[-100px]"></div>

      {/* Main Content */}
      <div className="relative max-w-5xl px-4 text-center">
        <motion.h1
          key={index}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="mb-6 text-3xl font-bold text-white md:text-4xl lg:text-5xl"
        >
          {bannerTexts[index]}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mb-8 text-lg text-white/90 md:text-xl"
        >
          Explore thousands of products for rent – houses, cars, and more.
        </motion.p>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex flex-col items-center justify-center w-full gap-4"
        >
          <form
            onSubmit={handleSearch}
            className="flex w-full max-w-lg overflow-hidden rounded-md shadow-lg" // Fixed max-width
          >
            <input
              type="text"
              placeholder="Search by name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-3 text-base text-gray-800 bg-white border-none rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px] max-w-full box-border" // Added min-w and box-border
            />
            <button
              type="submit"
              className="px-6 py-3 font-semibold text-white transition-colors duration-300 bg-blue-600 rounded-r-md hover:bg-blue-700"
            >
              Search
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}