'use client'


import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FaStar } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';


export default function MyFavorites() {
  const { data: session } = useSession();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookmarkedProducts() {
      setLoading(true);
      if (!session?.user) {
        setProducts([]);
        setLoading(false);
        return;
      }
      // Get bookmarked IDs from user
      const userRes = await fetch('/api/users');
      if (!userRes.ok) {
        setProducts([]);
        setLoading(false);
        return;
      }
      const user = await userRes.json();
      const bookmarks = user.bookmarks || [];
      if (bookmarks.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }
      // Fetch product details for each bookmarked ID
      const productList = await Promise.all(
        bookmarks.map(async (id) => {
          const res = await fetch(`/api/rent-posts/${id}`);
          if (!res.ok) return null;
          const data = await res.json();
          return data;
        })
      );
      setProducts(productList.filter(Boolean));
      setLoading(false);
    }
    fetchBookmarkedProducts();
  }, [session]);

  const handleRemove = async (id) => {
    // Remove bookmark via PATCH
    const res = await fetch('/api/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId: id, action: 'remove' }),
    });
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success('Removed from favorites!');
    } else {
      toast.error('Failed to remove from favorites.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6">My Favorites</h2>
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <span className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></span>
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500 mt-4">No items in your favorites.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-2 sm:px-3">
          {products.map((post) => {
            // Calculate average rating
            const avgRating = Array.isArray(post.ratings) && post.ratings.length > 0
              ? post.ratings.reduce((a, b) => a + b, 0) / post.ratings.length
              : 0;
            return (
              <div key={post._id} className="relative flex flex-col bg-base-100 text-base-content rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] transition-all duration-200 cursor-pointer overflow-hidden mx-auto min-h-[420px] max-h-[420px] min-w-[300px] max-w-[300px]">
                <Link href={`/rent-posts/${post._id}`} className="no-underline text-inherit h-full flex flex-col">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-36 object-cover rounded-t-xl"
                  />
                  <div className="flex flex-row gap-1 px-3 pt-2">
                    <span className="bg-base-200 text-base-content text-xs font-semibold px-2 py-1 rounded-lg">
                      {post.category}
                    </span>
                    {post.subcategory && (
                      <span className="bg-base-200 text-base-content text-xs font-medium px-2 py-1 rounded-lg">
                        {post.subcategory}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 p-3 flex-1">
                    <div className="text-xs text-base-content mb-0 font-medium truncate">
                      {post.location}
                    </div>
                    <div className="flex items-center gap-2 mb-0">
                      <h2 className="text-base font-bold text-base-content leading-tight truncate">
                        {post.title}
                      </h2>
                      {avgRating > 0 && (
                        <div className="flex items-center gap-1 bg-base-200 px-1.5 py-0.5 rounded-lg">
                          <span className="font-semibold text-base-content text-xs sm:text-sm">Rating: {avgRating.toFixed(1)}</span>
                          
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-base-content mb-1 leading-snug line-clamp-2">
                      {post.description}
                    </p>
                    <div className="flex items-center gap-1 mb-1">
                      <span
                        className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                          new Date(post.availableFrom) <= new Date() &&
                          new Date(post.availableTo) >= new Date()
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {new Date(post.availableFrom) <= new Date() &&
                        new Date(post.availableTo) >= new Date()
                          ? "Available"
                          : "Not Available"}
                      </span>
                      <span className="text-xs text-base-content">
                        {post.availableFrom} - {post.availableTo}
                      </span>
                    </div>
                    <div className="text-base font-extrabold text-base-content mb-1">
                      ৳
                      {typeof post.rentPrice === "number"
                        ? post.rentPrice.toLocaleString()
                        : Number(post.rentPrice)
                        ? Number(post.rentPrice).toLocaleString()
                        : "0"}
                      <span className="text-xs font-medium text-base-content">
                        {['Vehicles', 'Tools & Equipment', 'Events & Venues'].includes(post.category) ? '/day' : '/month'}
                      </span>
                    </div>
                  </div>
                </Link>
                <div className="flex flex-row gap-2 w-full px-3 pb-3">
                  <button
                    className="w-full bg-red-600 text-white font-semibold py-1.5 rounded-xl text-sm hover:bg-red-700 transition flex items-center justify-center cursor-pointer"
                    onClick={() => handleRemove(post._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}