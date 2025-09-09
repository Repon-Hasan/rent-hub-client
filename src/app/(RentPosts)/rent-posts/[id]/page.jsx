import React from "react";
import AIInsights from "./AIInsights";

import { notFound } from "next/navigation";
import Link from "next/link";

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
    <div className="min-h-screen w-full bg-base-100 text-base-content flex flex-col my-10">
      <main className="w-full mx-auto px-2 sm:px-6 py-8 flex flex-col md:flex-row gap-10">
        {/* Left: Image */}
        <div className="md:w-7/12 w-full flex flex-col items-center justify-center gap-4">
          <div className="w-full aspect-video rounded-2xl shadow-lg overflow-hidden flex items-center justify-center bg-base-200">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-contain rounded-2xl"
              style={{ maxHeight: '480px', background: 'white' }}
            />
          </div>
        </div>
        {/* Right: Details */}
        <div className="md:w-5/12 w-full flex flex-col gap-5 justify-center">
          <h1 className="text-3xl font-bold text-base-content mb-1 leading-tight">
            {post.title}
          </h1>
          <p className="text-base-content mb-2 text-base leading-relaxed">
            {post.description}
          </p>
          <div className="bg-base-200 rounded-xl p-4 mb-2">
            <div className="font-semibold text-base-content mb-2">Information</div>
            <div className="flex justify-between py-1 text-sm">
              <span>Price</span>
              <span className="font-bold text-base-content">
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
              <span className="font-bold text-base-content">{post.location}</span>
            </div>
          </div>
          <div className="bg-base-200 rounded-xl p-4 mb-2">
            <div className="font-semibold text-base-content mb-2">Contact</div>
            <div className="flex justify-between py-1 text-sm">
              <span>Owner</span>
              <Link
                href={`/owner/${post.ownerId}`}
                className="font-bold text-gray-900 hover:text-blue-600 hover:underline transition"
              >
                {post.ownerName}
              </Link>
            </div>
            <div className="flex justify-between py-1 text-sm">
              <span>Email</span>
              <span className="font-bold text-base-content">{post.email}</span>
            </div>
            <div className="flex justify-between py-1 text-sm">
              <span>Contact</span>
              <span className="font-bold text-base-content">
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
        <div className="mb-2 text-lg font-semibold text-base-content self-start">
          Location Map
        </div>
        <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-lg bg-base-200">
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
          <Link href={`/checkout/${post.id}`}>
            <button className="bg-blue-600 text-base-content px-5 font-semibold py-3 rounded-xl text-lg hover:bg-blue-700 transition">
              Book Now
            </button>
          </Link>
          <button className="bg-base-200 px-5 text-base-content font-semibold py-3 rounded-xl text-lg hover:bg-base-300 transition">
            Contact Host
          </button>
        </div>
      </section>
    </div>
  );
};

export default DetailPage;
