"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function ReviewsSection({ ownerId }) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    fetch(`/api/reviews?ownerId=${ownerId}`)
      .then((res) => res.json())
      .then((data) => setReviews(data));
  }, [ownerId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session) return alert("You must be logged in to leave a review");

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, ownerId }),
    });

    if (res.ok) {
      setForm({ rating: 5, comment: "" });
      const updated = await fetch(`/api/reviews?ownerId=${ownerId}`).then((r) =>
        r.json()
      );
      setReviews(updated);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-xl font-bold mb-4">Reviews & Ratings</h2>

      {session && (
        <form onSubmit={handleSubmit} className="space-y-3 mb-6">
          <select
            value={form.rating}
            onChange={(e) => setForm({ ...form, rating: e.target.value })}
            className="border rounded p-2"
          >
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>
                {r} Star{r > 1 ? "s" : ""}
              </option>
            ))}
          </select>
          <textarea
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
            placeholder="Write a review..."
            className="w-full border rounded p-2"
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Submit Review
          </button>
        </form>
      )}

      <div className="space-y-4">
        {reviews.length === 0 && <p>No reviews yet.</p>}
        {reviews.map((r) => (
          <div key={r._id} className="p-4 border rounded-lg">
            <div className="flex justify-between">
              <span className="font-semibold">{r.userName}</span>
              <span className="text-yellow-500">{r.rating}★</span>
            </div>
            <p className="text-gray-700">{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
