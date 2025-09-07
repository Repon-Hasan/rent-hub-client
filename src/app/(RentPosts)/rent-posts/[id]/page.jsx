import React from "react";
import AIInsights from "./AIInsights";

import { notFound } from "next/navigation";

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

async function getRentPost(id) {
  const res = await fetch(`http://localhost:3000/api/rent-posts/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  const post = await res.json();
  // Convert MongoDB _id to id for compatibility if needed
  if (post && post._id) post.id = post._id;
  return post;
}

const DetailPage = async (props) => {
  const params = typeof props.params?.then === "function" ? await props.params : props.params;
  const post = await getRentPost(params.id);
  if (!post) return notFound();
  return (
    <div className="min-h-screen w-full bg-white flex flex-col my-10">
      <main className="w-full mx-auto px-2 sm:px-6 py-8 flex flex-col md:flex-row gap-10">
        {/* Left: Image */}
        <div className="md:w-7/12 w-full flex flex-col items-center justify-center gap-4">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full max-h-[420px] object-cover rounded-2xl shadow-lg"
          />
        </div>
        {/* Right: Details */}
        <div className="md:w-5/12 w-full flex flex-col gap-5 justify-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-1 leading-tight">
            {post.title}
          </h1>
          <p className="text-gray-700 mb-2 text-base leading-relaxed">
            {post.description}
          </p>
          <div className="bg-gray-50 rounded-xl p-4 mb-2">
            <div className="font-semibold text-gray-800 mb-2">Information</div>
            <div className="flex justify-between py-1 text-sm">
              <span>Price</span>
              <span className="font-bold text-gray-900">
                ৳{typeof post.rentPrice === "number"
                  ? post.rentPrice.toLocaleString()
                  : Number(post.rentPrice)
                  ? Number(post.rentPrice).toLocaleString()
                  : "0"}
                {['Vehicles', 'Tools & Equipment', 'Events & Venues'].includes(post.category) ? '/day' : '/month'}
              </span>
            </div>
            <div className="flex justify-between py-1 text-sm">
              <span>Availability</span>
              <span className="font-bold text-blue-700">
                {formatDate(post.availableFrom)} -{" "}
                {formatDate(post.availableTo)}
              </span>
            </div>
            <div className="flex justify-between py-1 text-sm">
              <span>Location</span>
              <span className="font-bold text-gray-900">{post.location}</span>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 mb-2">
            <div className="font-semibold text-gray-800 mb-2">Contact</div>
            <div className="flex justify-between py-1 text-sm">
              <span>Owner</span>
              <span className="font-bold text-gray-900">{post.ownerName}</span>
            </div>
            <div className="flex justify-between py-1 text-sm">
              <span>Email</span>
              <span className="font-bold text-gray-900">{post.email}</span>
            </div>
            <div className="flex justify-between py-1 text-sm">
              <span>Contact</span>
              <span className="font-bold text-gray-900">
                {post.contactNumber}
              </span>
            </div>
          </div>
        </div>
      </main>
      {/* AI Insights full width under image */}
  <AIInsights post={post} />
      {/* Map Section */}
      <section className="w-full mx-auto px-2 sm:px-6 mt-8 flex flex-col items-center">
        <div className="mb-2 text-lg font-semibold text-gray-800 self-start">
          Location Map
        </div>
        <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-lg">
          <iframe
            title="Google Map"
            width="100%"
            height="100%"
            className="w-full h-full border-0 rounded-2xl"
            style={{ minHeight: "256px" }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://maps.google.com/maps?q=${post.latitude},${post.longitude}&z=15&output=embed`}
          ></iframe>
        </div>
        <div className="flex gap-4 mt-8">
          <button className="bg-blue-600 text-white px-5 font-semibold py-3 rounded-xl text-lg hover:bg-blue-700 transition">
            Book Now
          </button>
          <button className=" bg-gray-200 px-5 text-gray-800 font-semibold py-3 rounded-xl text-lg hover:bg-gray-300 transition">
            Contact Host
          </button>
          <a href={`/edit-rent-posts/${post.id}`}>
            <button className="bg-yellow-500 text-white px-5 font-semibold py-3 rounded-xl text-lg hover:bg-yellow-600 transition">
              Edit
            </button>
          </a>
        </div>
      </section>
    </div>
  );
};

export default DetailPage;
