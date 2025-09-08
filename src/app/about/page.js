"use client"

import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="px-4 py-16 bg-base-100 sm:py-24 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto mb-16 text-center">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-base-content">
          More Than Just Rentals. It's a World of Possibilities.
        </h1>
        <p className="max-w-2xl mx-auto mt-4 text-lg text-base-content/80">
          We're building a community where everything is shareable. Our mission is to connect individuals and businesses with the assets they need, when they need them, through a secure, intelligent, and diverse platform.
        </p>
      </div>

      {/* Values Section */}
      <div className="grid grid-cols-1 gap-8 mx-auto mt-16 text-center max-w-7xl md:grid-cols-3">
        <div className="p-8 transition-all transform shadow-xl card bg-base-200 rounded-xl hover:scale-105 hover:shadow-2xl">
          <div className="flex items-center justify-center mb-4 text-4xl text-primary">
            <span role="img" aria-label="lightbulb">💡</span>
          </div>
          <h3 className="mb-2 text-xl font-bold text-base-content">Innovation with AI</h3>
          <p className="text-base-content/80">
            Our platform uses AI to provide instant insights and intelligent recommendations, helping you make informed decisions about your next rental.
          </p>
        </div>
        <div className="p-8 transition-all transform shadow-xl card bg-base-200 rounded-xl hover:scale-105 hover:shadow-2xl">
          <div className="flex items-center justify-center mb-4 text-4xl text-primary">
            <span role="img" aria-label="handshake">🤝</span>
          </div>
          <h3 className="mb-2 text-xl font-bold text-base-content">Trust & Community</h3>
          <p className="text-base-content/80">
            With our secure payment system, robust review and rating features, we ensure a safe and trustworthy environment for every transaction.
          </p>
        </div>
        <div className="p-8 transition-all transform shadow-xl card bg-base-200 rounded-xl hover:scale-105 hover:shadow-2xl">
          <div className="flex items-center justify-center mb-4 text-4xl text-primary">
            <span role="img" aria-label="rocket">🚀</span>
          </div>
          <h3 className="mb-2 text-xl font-bold text-base-content">Unmatched Versatility</h3>
          <p className="text-base-content/80">
            From the ordinary to the extraordinary, our platform allows you to rent a wide variety of assets, connecting you to endless possibilities.
          </p>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="mt-20 text-center">
        <h2 className="mb-4 text-3xl font-bold sm:text-4xl text-base-content">Ready to Explore?</h2>
        <p className="max-w-3xl mx-auto mb-8 text-lg text-base-content/80">
          Whether you're looking to rent a new asset or list your own, our platform is designed to make the process seamless. Join us today and be a part of the future of rentals.
        </p>
        <Link href="/rent-posts">
          <span className="transition-all duration-200 rounded-full shadow-lg btn btn-primary btn-lg hover:shadow-xl">
            Explore All Listings
          </span>
        </Link>
      </div>
    </div>
  );
}