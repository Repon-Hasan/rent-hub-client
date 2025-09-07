'use client';

import { SessionProvider } from 'next-auth/react';
import Link from 'next/link';
import BecomeOwnerSection from './components/BecomeOwner';
import CategoriesSection from './components/Categories';
import FeaturedListings from './components/FeaturedListings';
import Footer from './components/Footer';
import Newsletter from './components/Newsletter';
import PopularListings from './components/PopularListings';
import Testimonials from './components/Testimonials';
import TopRatedListings from './components/TopRatedListings';
import Banner from '@/components/ui/Banner';

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col bg-base-100 dark:bg-base-200">
            <main className="flex-grow container mx-auto px-4 max-w-7xl">
                <Banner />
                <CategoriesSection></CategoriesSection>
                <FeaturedListings></FeaturedListings>
                <PopularListings></PopularListings>
                <TopRatedListings></TopRatedListings>
                <div className="py-8 text-center">
                    <h3 className="text-2xl font-bold mb-4 text-base-content dark:text-base-content">
                        Discover More
                    </h3>
                    <Link href="/listings" className="btn btn-primary">
                        View All Products
                    </Link>
                </div>
                <SessionProvider>
                    <BecomeOwnerSection />
                </SessionProvider>
                <Testimonials></Testimonials>
                <Newsletter></Newsletter>
            </main>
            <Footer></Footer>
        </div>
    );
}
