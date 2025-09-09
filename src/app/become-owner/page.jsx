"use client";
import { useState } from "react";
import Swal from "sweetalert2";
import { HiUser, HiMail, HiPhone, HiHome, HiLocationMarker, HiMailOpen } from "react-icons/hi";
import Link from "next/link";

export default function BecomeOwnerPage() {
  const [form, setForm] = useState({
    email: "",
    name: "",
    phone: "",
    address: "",
    city: "",
    postcode: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePayment = async () => {
    const { email, name, phone } = form;
    if (!email || !name || !phone) {
      Swal.fire("Error", "Please fill all required fields", "error");
      return;
    }

    setLoading(true);
    try {
      // Check user role first
      const roleRes = await fetch("/api/users/check-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const roleData = await roleRes.json();

      if (roleData.role === "owner") {
        Swal.fire({
          icon: "info",
          title: "Already an Owner",
          text: "You are already an owner!",
        }).then(() => window.location.href = "/dashboard");
        return;
      }

      // Initiate payment
      const res = await fetch("/api/payment/init-owner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.url) window.location.href = data.url;
      else console.error("Payment init failed:", data);

    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Something went wrong. Try again!", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-100 p-6">
      <div className="bg-base-200 shadow-2xl rounded-3xl p-10 w-full max-w-xl text-center transform transition-all duration-500 ">
        <h1 className="text-4xl font-bold mb-8 text-blue-700 animate-bounce">Apply for Owner</h1>
        <div className="grid gap-5 ">
          <div className="relative">
            <HiUser className="absolute top-3 left-3 text-gray-400" size={20} />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="border pl-10 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>
          <div className="relative">
            <HiMail className="absolute top-3 left-3 text-gray-400" size={20} />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="border pl-10 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>
          <div className="relative">
            <HiPhone className="absolute top-3 left-3 text-gray-400" size={20} />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              className="border pl-10 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>
          <div className="relative">
            <HiHome className="absolute top-3 left-3 text-gray-400" size={20} />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
              className="border pl-10 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>
          <div className="relative">
            <HiLocationMarker className="absolute top-3 left-3 text-gray-400" size={20} />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              className="border pl-10 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>
          <div className="relative">
            <HiMailOpen className="absolute top-3 left-3 text-gray-400" size={20} />
            <input
              type="text"
              name="postcode"
              placeholder="Postcode"
              value={form.postcode}
              onChange={handleChange}
              className="border pl-10 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="mt-8 btn btn-neutral w-full rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105"
        >
          {loading ? "Redirecting..." : "Pay 500৳"}
        </button>
        <Link href={"/"} className="btn btn-outline mt-3 w-full rounded-2xl">
          Go Back
        </Link>
      </div>
    </div>
  );
}
