"use client";
import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Swal from "sweetalert2";

async function getRentPosts() {
  const res = await fetch("http://localhost:3000/api/rent-posts", {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return await res.json();
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  // Get ordinal suffix
  const j = day % 10,
    k = day % 100;
  let suffix = "th";
  if (j === 1 && k !== 11) suffix = "st";
  else if (j === 2 && k !== 12) suffix = "nd";
  else if (j === 3 && k !== 13) suffix = "rd";
  return `${day}${suffix} ${month} ${year}`;
}
const RentPostsList = ({ posts, handleDelete }) => (
  <div className="w-full mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-2 sm:px-3">
    {posts.map((post) => (
      <div key={post._id} className="flex flex-col bg-base-100 text-base-content rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] transition-all duration-200 cursor-pointer overflow-hidden mx-auto">
        <Link href={`/rent-posts/${post._id}`} className="no-underline text-inherit">
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
          <div className="flex flex-col gap-1 p-3">
            <div className="text-xs text-base-content mb-0 font-medium truncate">
              {post.location}
            </div>
            <h2 className="text-base font-bold text-base-content mb-0 leading-tight truncate">
              {post.title}
            </h2>
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
                {formatDate(post.availableFrom)} -{" "}
                {formatDate(post.availableTo)}
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
          <Link href={`/rent-posts/${post._id}`} className="w-1/2">
            <span className="w-full bg-blue-600 text-white font-semibold py-1.5 rounded-xl text-sm hover:bg-blue-700 transition flex items-center justify-center cursor-pointer">
              View Detail
            </span>
          </Link>
          <Link href={`/edit-rent-posts/${post._id}`} className="w-1/2">
            <span className="w-full bg-yellow-500 text-white font-semibold py-1.5 rounded-xl text-sm hover:bg-yellow-600 transition flex items-center justify-center cursor-pointer">
              Edit
            </span>
          </Link>
          <button
            className="w-1/2 bg-red-600 text-white font-semibold py-1.5 rounded-xl text-sm hover:bg-red-700 transition"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDelete(post._id);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    ))}
  </div>
);

const RentPostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState(["All"]);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      const res = await fetch("/api/rent-posts", { cache: "no-store" });
      if (!res.ok) {
        setPosts([]);
        setLoading(false);
        return;
      }
      setPosts(await res.json());
      setLoading(false);
    }
    fetchPosts();
  }, []);

  // Fetch categories from /api/rent-category
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/rent-category");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const catNames = ["All", ...data.map((cat) => cat.name ? cat.name : (cat._id || ""))].filter(Boolean);
            setCategories(catNames);
          } else {
            setCategories(["All"]);
          }
        } else {
          setCategories(["All"]);
        }
      } catch (err) {
        setCategories(["All"]);
      }
    };
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    const res = await fetch(`/api/rent-posts/${id}`, { method: "DELETE" });
    if (res.ok) {
      setPosts((prev) => prev.filter((p) => p._id !== id));
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Deleted successfully!",
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Delete Failed!",
        text: "Delete failed.",
      });
    }
  };

  // Filter posts by selected category
  const filteredPosts =
    selectedCategory === "All"
      ? posts
      : posts.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen w-11/12 mx-auto bg-base-100 text-base-content flex flex-col py-12">
      <h1 className="text-center mb-8 text-4xl font-bold text-base-content tracking-wide font-sans">
        All Rent Posts
      </h1>
      <div className="w-full flex justify-left mb-8 ml-8">
        <div className="w-full max-w-xs">
          <label htmlFor="category" className="block mb-2 text-sm font-medium text-base-content">
            Filter by Category
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="block w-full px-4 py-2 text-base border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-base-100 text-base-content shadow-sm"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-base-100 text-base-content">
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>
      <Suspense fallback={<div className="w-full flex justify-center items-center py-20"><span className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></span></div>}>
        {loading ? (
          <div className="w-full flex justify-center items-center py-20">
            <span className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></span>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="w-full flex justify-center items-center py-20">
            <span className="text-lg text-base-content font-semibold">No post to show for this category.</span>
          </div>
        ) : (
          <RentPostsList posts={filteredPosts} handleDelete={handleDelete} />
        )}
      </Suspense>
    </div>
  );
};

export default RentPostsPage;
