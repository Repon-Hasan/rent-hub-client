"use client";
import React, { useEffect, useState } from "react";
import { FaStar, FaCalendarAlt, FaUser, FaEnvelope, FaPhone, FaMoneyBillWave, FaCheckCircle } from "react-icons/fa";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";

const RenterReviewPage = () => {
    const { data: session, status } = useSession();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviewInputs, setReviewInputs] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [reviewedPostIds, setReviewedPostIds] = useState([]);

    useEffect(() => {
        async function fetchBookingsAndReviews() {
            if (session?.user?.email) {
                try {
                    const bookingsRes = await fetch(`/api/bookings?email=${session.user.email}`);
                    const bookingsData = await bookingsRes.json();
                    setBookings(bookingsData);

                    // Fetch all related rent posts to check reviews
                    const postIds = bookingsData.map(b => b.postId);
                    const reviewedIds = [];
                    await Promise.all(postIds.map(async (postId) => {
                        if (!postId) return;
                        const postRes = await fetch(`/api/rent-posts/${postId}`);
                        if (postRes.ok) {
                            const postData = await postRes.json();
                            if (postData.reviews && postData.reviews.some(r => r.email === session.user.email)) {
                                reviewedIds.push(postId);
                            }
                        }
                    }));
                    setReviewedPostIds(reviewedIds);
                } catch {
                    // ignore errors for now
                }
                setLoading(false);
            }
        }
        fetchBookingsAndReviews();
    }, [session]);

    if (status === "loading" || loading) {
        return <div className="flex justify-center items-center h-96">Loading...</div>;
    }

    // Handle review input change
    const handleReviewChange = (id, field, value) => {
        setReviewInputs((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value,
            },
        }));
    };

    // Submit review
    const handleReviewSubmit = async (booking) => {
        setSubmitting(true);
        const review = reviewInputs[booking._id || booking.id];
        if (!review || !review.text || !review.rating) {
            Swal.fire({
                icon: "warning",
                title: "Incomplete!",
                text: "Please provide both review text and rating.",
                timer: 1800,
                showConfirmButton: false,
            });
            setSubmitting(false);
            return;
        }
        try {
            const res = await fetch(`/api/rent-posts/${booking.postId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: session.user.name || booking.name,
                    email: session.user.email,
                    rating: review.rating,
                    review: review.text,
                    reviewDate: new Date().toISOString(),
                }),
            });
            if (res.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Review submitted!",
                    text: "Thank you for your feedback.",
                    timer: 1800,
                    showConfirmButton: false,
                });
                setReviewInputs((prev) => ({ ...prev, [booking._id || booking.id]: { text: "", rating: 0 } }));
                setReviewedPostIds((prev) => [...prev, booking.postId]);
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Failed!",
                    text: "Failed to submit review.",
                });
            }
        } catch {
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: "Error submitting review.",
            });
        }
        setSubmitting(false);
    };

    // Helper to format date as '1st Jan 2025'
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        const day = date.getDate();
        const month = date.toLocaleString("en-US", { month: "short" });
        const year = date.getFullYear();
        // Get ordinal suffix
        const getOrdinal = (n) => {
            if (n > 3 && n < 21) return "th";
            switch (n % 10) {
                case 1: return "st";
                case 2: return "nd";
                case 3: return "rd";
                default: return "th";
            }
        };
        return `${day}${getOrdinal(day)} ${month} ${year}`;
    };

    // Filter bookings to those not reviewed yet
    const toReview = bookings.filter(b => !reviewedPostIds.includes(b.postId));
    return (
        <div className="max-w-3xl mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6 text-center">My Booking Reviews</h1>
            {bookings.length === 0 ? (
                <div className="text-center text-gray-500">No bookings found.</div>
            ) : toReview.length === 0 ? (
                <div className="text-center text-base-content py-16">
                    <h2 className="text-xl font-semibold mb-2">No product to review</h2>
                    <p className="text-gray-500">You have already reviewed all your booked products. Thank you for sharing your feedback!</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {toReview.map((booking) => {
                        const review = reviewInputs[booking._id || booking.id] || { text: "", rating: 0 };
                        return (
                            <div key={booking._id || booking.id} className="bg-base-100 rounded-2xl shadow-lg p-8 border border-base-200">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <span className="font-semibold text-xl flex items-center gap-2">
                                            <FaCheckCircle className="text-green-500" />
                                            {booking.itemTitle || booking.category}
                                        </span>
                                        <span className="ml-3 px-3 py-1 rounded bg-green-100 text-green-700 text-xs capitalize">
                                            {booking.status}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-500 flex items-center gap-1">
                                        <FaCalendarAlt />
                                        Booked: {formatDate(booking.createdAt)}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                                    <div className="bg-base-200 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium">Booking ID:</span>
                                            <span className="text-xs text-gray-500">{booking.id}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <FaUser className="text-blue-500" />
                                            <span className="font-medium">Name:</span>
                                            <span>{booking.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <FaEnvelope className="text-blue-400" />
                                            <span className="font-medium">Email:</span>
                                            <span>{booking.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <FaPhone className="text-green-400" />
                                            <span className="font-medium">Phone:</span>
                                            <span>{booking.phone}</span>
                                        </div>
                                    </div>
                                    <div className="bg-base-200 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <FaCalendarAlt className="text-purple-400" />
                                            <span className="font-medium">Start Date:</span>
                                            <span>{formatDate(booking.startDate)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <FaCalendarAlt className="text-purple-400" />
                                            <span className="font-medium">End Date:</span>
                                            <span>{formatDate(booking.endDate)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <FaMoneyBillWave className="text-green-500" />
                                            <span className="font-medium">Total Cost:</span>
                                            <span className="font-bold">৳{booking.totalCost}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <FaMoneyBillWave className="text-yellow-500" />
                                            <span className="font-medium">Advance:</span>
                                            <span className="font-bold">৳{booking.advance}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="border-t pt-4 mt-4">
                                    <h2 className="font-semibold mb-2 text-lg">Leave a Review & Rating</h2>
                                    <div className="flex items-center mb-2">
                                        {[1,2,3,4,5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                className={`text-2xl mr-1 ${review.rating >= star ? "text-yellow-400" : "text-gray-300"}`}
                                                onClick={() => handleReviewChange(booking._id || booking.id, "rating", star)}
                                                disabled={submitting}
                                            >
                                                <FaStar />
                                            </button>
                                        ))}
                                    </div>
                                    <textarea
                                        className="w-full border rounded p-2 mb-2 bg-base-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        rows={3}
                                        placeholder="Write your review..."
                                        value={review.text}
                                        onChange={(e) => handleReviewChange(booking._id || booking.id, "text", e.target.value)}
                                        disabled={submitting}
                                    />
                                    <button
                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition shadow"
                                        onClick={() => handleReviewSubmit(booking)}
                                        disabled={submitting}
                                    >
                                        {submitting ? "Submitting..." : "Submit Review"}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default RenterReviewPage;