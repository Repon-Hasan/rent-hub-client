"use client";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";

async function getRentPost(id) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/rent-posts/${id}`,
    { cache: "no-store" }
  );
  if (!res.ok) return null;
  return await res.json();
}

const Page = ({ params }) => {
  const { data: session } = useSession();
  // const session = false;
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookedDates, setBookedDates] = useState([]);

  const [form, setForm] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "",
    startDate: "",
    endDate: "",
    advance: 0,
  });
  // Pre-fill name and email when session changes
  useEffect(() => {
    if (session?.user) {
      setForm((prev) => ({
        ...prev,
        name: session.user.name || prev.name,
        email: session.user.email || prev.email,
      }));
    }
  }, [session]);

  const [totalCost, setTotalCost] = useState(0);
  const [monthDiff, setMonthDiff] = useState(0);

  // Fetch rent post and booked dates
  useEffect(() => {
    (async () => {
      const awaitedParams =
        typeof params?.then === "function" ? await params : params;
      const data = await getRentPost(awaitedParams.id);
      setPost(data);

      if (data?._id) {
        fetch(`/api/bookings?postId=${data._id}`)
          .then((res) => res.json())
          .then((data) => setBookedDates(data))
          .catch((err) => console.error(err));
      }

      setLoading(false);
    })();
  }, [params]);

  // Update total cost and monthDiff
  useEffect(() => {
    if (form.startDate && form.endDate && post) {
      const sDate = new Date(form.startDate);
      const eDate = new Date(form.endDate);

      if (sDate <= eDate) {
        // Total days
        const diffTime = eDate - sDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        // Calculate years, months, days
        let years = eDate.getFullYear() - sDate.getFullYear();
        let months = eDate.getMonth() - sDate.getMonth();
        let days = eDate.getDate() - sDate.getDate();

        if (days < 0) {
          months -= 1;
          const prevMonth = new Date(eDate.getFullYear(), eDate.getMonth(), 0);
          days += prevMonth.getDate();
        }

        if (months < 0) {
          years -= 1;
          months += 12;
        }

        // Build dynamic duration string
        const parts = [];
        if (years > 0) parts.push(`${years} year${years > 1 ? "s" : ""}`);
        if (months > 0) parts.push(`${months} month${months > 1 ? "s" : ""}`);
        if (days > 0 || parts.length === 0) parts.push(`${days} day${days > 1 ? "s" : ""}`);

        const durationStr = parts.join(", ");

        // Set state
        setMonthDiff(months + years * 12);
        setTotalCost(diffDays * parseFloat(post.rentPrice));
        setForm((prev) => ({ ...prev, durationStr }));

        // Advance payment logic
        if (months + years * 12 > 3) {
          setForm((prev) => ({ ...prev, advance: post.rentPrice * 30 }));
        } else {
          setForm((prev) => ({ ...prev, advance: 0 }));
        }
      }
    }
  }, [form.startDate, form.endDate, post]);



  if (loading) return <Loading></Loading>;
  if (!post) return <div>Post not found.</div>;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePayNow = async () => {
    if (!session) {
      // Send current URL as callbackUrl to login page
      const currentUrl = typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/';
      router.push(`/login?callbackUrl=${encodeURIComponent(currentUrl)}`);
    }
    else {
      if (!form.startDate || !form.endDate) {
        Swal.fire({
          icon: "warning",
          title: "Select Dates",
          text: "Please select start and end dates.",
        });
        return;
      }

      const sDate = new Date(form.startDate);
      const eDate = new Date(form.endDate);
      const availStart = new Date(post.availableFrom);
      const availEnd = new Date(post.availableTo);

      // 1️⃣ Check if selected dates are within availability
      if (sDate < availStart || eDate > availEnd) {
        Swal.fire({
          icon: "warning",
          title: "Unavailable",
          text: `Selected date range is not available. Available: ${post.availableFrom} → ${post.availableTo}`,
        });
        return;
      }

      // 2️⃣ Check if dates overlap with existing bookings
      const conflict = bookedDates.some((b) => {
        const bStart = new Date(b.startDate);
        const bEnd = new Date(b.endDate);
        return sDate <= bEnd && eDate >= bStart;
      });

      if (conflict) {
        Swal.fire({
          icon: "error",
          title: "Already Booked",
          text: "Selected dates conflict with existing booking. Please choose another date range.",
        });
        return;
      }

      // 3️⃣ SweetAlert confirmation before payment
      Swal.fire({
        icon: "question",
        title: "Confirm Payment",
        text: `You will pay ৳${form.advance > 0 ? form.advance : totalCost}. Proceed?`,
        showCancelButton: true,
        confirmButtonText: "Yes, Pay Now",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const res = await fetch("/api/payment/init-booking", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...form, totalCost, monthDiff, postId: post._id, title: post.title }),
            });
            const data = await res.json();

            if (data.paymentUrl) window.location.href = data.paymentUrl;
            else Swal.fire({ icon: "error", title: "Payment Failed", text: "Cannot initialize payment." });
          } catch (err) {
            Swal.fire({ icon: "error", title: "Payment Error", text: "Something went wrong." });
          }
        }

      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto my-10 p-8 bg-white  rounded-2xl shadow-xl border-2">
      <h2 className="text-3xl font-bold mb-6 text-center">Checkout: {post.title}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Item Info */}
        <div className="space-y-4 flex-1">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-60 object-cover rounded-lg shadow"
          />
          <div className="bg-base-200 p-4 rounded-lg space-y-2 text-sm">
            <p><strong>Category:</strong> {post.category}</p>
            {post.subcategory && <p><strong>Subcategory:</strong> {post.subcategory}</p>}
            <p><strong>Location:</strong> {post.location}</p>
            <p><strong>Owner:</strong> {post.ownerName}</p>
            <p><strong>Contact:</strong> {post.contactNumber}</p>
            <p><strong>Available:</strong> {post.availableFrom} → {post.availableTo}</p>
            <p className="text-blue-600 font-semibold">Rent Price: ৳{post.rentPrice}/day</p>
          </div>
        </div>

        {/* Right: Form */}
        <div className="space-y-5 bg-base-200 p-6 rounded-xl shadow-sm flex-1">
          <div className="grid grid-cols-1 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-100 text-gray-700 cursor-not-allowed"
              value={form.name}
              onChange={handleChange}
              required
              disabled={!!form.name}
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-100 text-gray-700 cursor-not-allowed"
              value={form.email}
              onChange={handleChange}
              required
              disabled={!!form.email}
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm">Start Date</label>
              <input
                type="date"
                name="startDate"
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={form.startDate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm">End Date</label>
              <input
                type="date"
                name="endDate"
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={form.endDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {monthDiff > 3 && (
            <div>
              <label className="block mb-1 text-sm">Advance Payment (Fixed)</label>
              <input
                type="number"
                name="advance"
                value={post.rentPrice * 30}
                className="w-full border p-3 rounded-lg bg-gray-200 text-gray-700 cursor-not-allowed"
                readOnly
              />
              <p className="text-sm text-gray-500 mt-1">
                Mandatory advance for bookings over 3 months.
              </p>
            </div>
          )}

          {totalCost > 0 && (
            <div className="bg-white border p-4 rounded-lg">
              <p className="text-gray-700">
                Duration: <strong>{form.durationStr}</strong>
              </p>
              <p className="text-lg font-semibold text-green-600">
                Total Rent: ৳{totalCost}
              </p>
            </div>
          )}


          <button
            onClick={handlePayNow}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Confirm & Pay
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
