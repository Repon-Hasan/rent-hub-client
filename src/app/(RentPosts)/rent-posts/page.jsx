import React from "react";
import Link from "next/link";

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

const RentPostsPage = async () => {
  const posts = await getRentPosts();
  return (
    <div className="min-h-screen w-full bg-white flex flex-col py-12">
      <h1 className="text-center mb-10 text-4xl font-bold text-gray-900 tracking-wide font-sans">
        Universal Rent Hub
      </h1>
      <div className="w-full mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-2 sm:px-6">
        {posts.map((post) => (
          <Link
            key={post._id}
            href={`/rent-posts/${post._id}`}
            className="no-underline text-inherit"
          >
            <div className="flex flex-col bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.03] transition-all duration-200 cursor-pointer overflow-hidden">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-56 object-cover rounded-t-2xl"
              />
              <div className="flex flex-row gap-2 px-6 pt-4">
                <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2 py-1 rounded-lg">
                  {post.category}
                </span>
                {post.subcategory && (
                  <span className="bg-gray-50 text-gray-500 text-xs font-medium px-2 py-1 rounded-lg">
                    {post.subcategory}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-3 p-6">
                <div className="text-xs text-gray-500 mb-1 font-medium">
                  {post.location}
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-1 leading-tight">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-700 mb-2 leading-relaxed line-clamp-2">
                  {post.description}
                </p>
                <div className="flex items-center gap-2 mb-2">
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
                  <span className="text-xs text-gray-400">
                    {formatDate(post.availableFrom)} -{" "}
                    {formatDate(post.availableTo)}
                  </span>
                </div>
                <div className="text-xl font-extrabold text-blue-700 mb-3">
                  ৳
                  {typeof post.rentPrice === "number"
                    ? post.rentPrice.toLocaleString()
                    : Number(post.rentPrice)
                    ? Number(post.rentPrice).toLocaleString()
                    : "0"}
                  <span className="text-xs font-medium text-gray-500">
                    /month
                  </span>
                </div>
                <button className="w-full bg-blue-600 text-white font-semibold py-2 rounded-xl text-sm hover:bg-blue-700 transition">
                  See Detail
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RentPostsPage;
