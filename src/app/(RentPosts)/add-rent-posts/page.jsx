"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";

const imgbbApiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

const initialForm = {
  category: "",
  subcategory: "",
  type: "",
  title: "",
  description: "",
  location: "",
  ownerName: "",
  email: "",
  contactNumber: "",
  rentPrice: "",
  availableFrom: "",
  availableTo: "",
  imageUrl: "",
  latitude: "",
  longitude: "",
};

const AddRentPostsPage = () => {
  const { data: session } = useSession();
  const [form, setForm] = useState(initialForm);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [mapPosition, setMapPosition] = useState({ lat: 23.685, lng: 90.3563 }); // Bangladesh center

  // Prefill name/email when session loads
  useEffect(() => {
    if (session?.user) {
      setForm((prev) => ({
        ...prev,
        ownerName: session.user.name || "",
        email: session.user.email || "",
      }));
    }
  }, [session]);

  // Fetch categories from DB
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/add-category");
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch {}
    };
    fetchCategories();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "category") {
      setForm((prev) => ({ ...prev, category: value, subcategory: "" }));
      // Find selected category object from DB
      const selectedCat = categories.find((cat) => cat.name === value);
      setSubcategories(selectedCat ? selectedCat.subcategories : []);
    } else if (name === "subcategory") {
      setForm((prev) => ({ ...prev, subcategory: value }));
    } else if (name === "imageFile" && files && files[0]) {
      handleImageUpload(files[0]);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Upload image to imgbb
  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setForm((prev) => ({ ...prev, imageUrl: data.data.url }));
      } else {
        alert("Image upload failed.");
      }
    } catch (err) {
      alert("Image upload error.");
    }
  };

  // Get location from device GPS
  const handleGetLocationFromDevice = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setMapPosition({ lat, lng });
          setForm((prev) => ({ ...prev, latitude: lat, longitude: lng }));
        },
        (error) => {
          alert("Unable to retrieve your location.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/rent-posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Rent post added successfully!",
          timer: 2000,
          showConfirmButton: false,
        });
        setForm(initialForm);
        setSubcategories([]);
      } else {
        const error = await res.json();
        Swal.fire({
          icon: "error",
          title: "Failed!",
          text: "Failed to add rent post: " + (error?.error || res.status),
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Error posting data.",
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-base-100 text-base-content flex flex-col py-0 relative">
      {/* Gradient animated header */}
      <div className="w-full h-40 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient-x flex items-center justify-center rounded-b-3xl shadow-lg mb-0">
        <h1 className="text-4xl font-extrabold text-white drop-shadow-lg tracking-wide font-sans text-center">
          <span className="inline-flex items-center gap-2">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /></svg>
            Add Rent Post
          </span>
        </h1>
      </div>
      {/* Step indicator */}
      <div className="w-full flex justify-center mt-4 mb-2">
        <div className="flex gap-4 items-center">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">1</div>
            <span className="text-xs mt-1">Details</span>
          </div>
          <div className="w-8 h-1 bg-blue-300 rounded" />
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">2</div>
            <span className="text-xs mt-1">Location</span>
          </div>
          <div className="w-8 h-1 bg-pink-300 rounded" />
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold">3</div>
            <span className="text-xs mt-1">Image</span>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="w-full px-2 sm:px-6 flex flex-col md:flex-row gap-8 mt-2">
        {/* Form Card */}
        <div className="md:w-7/12 w-full">
          <div className="bg-base-100 rounded-2xl shadow-2xl p-8 flex flex-col gap-6 border border-base-200">
            {/* Category Section */}
            <div>
              <label className="block text-lg font-bold text-base-content mb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border border-blue-300 rounded-lg px-3 py-2 text-base text-base-content bg-base-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id || cat.name} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-lg font-bold text-base-content mb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                Subcategory
              </label>
              <select
                name="subcategory"
                value={form.subcategory}
                onChange={handleChange}
                className="w-full border border-purple-300 rounded-lg px-3 py-2 text-base text-base-content bg-base-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
                disabled={!form.category}
              >
                <option value="">Select Subcategory</option>
                {subcategories.map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
            {/* Conditional fields for each category */}
            {form.category === "Vehicles" ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-base-content mb-1">Model</label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base text-base-content bg-base-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Toyota Corolla"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-base-content mb-1">Number Plate</label>
                  <input
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base text-base-content bg-base-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. DHAKA-D-1234"
                    required
                  />
                </div>
              </>
            ) : form.category === "Properties & Living" ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-base-content mb-1">Property Title</label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base text-base-content bg-base-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Grand Event Hall, Cozy Apartment"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-base-content mb-1">Property Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base text-base-content bg-base-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Describe the property..."
                    required
                  />
                </div>
              </>
            ) : form.category === "Land & Nature" ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-base-content mb-1">Land Type</label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base text-base-content bg-base-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Rice Field, Pond, Garden"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-base-content mb-1">Land Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base text-base-content bg-base-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Describe the land, size, features..."
                    required
                  />
                </div>
              </>
            ) : form.category === "Events & Venues" ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-base-content mb-1">Venue Name</label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base text-base-content bg-base-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Banquet Hall, Party Space"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-base-content mb-1">Venue Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base text-base-content bg-base-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Describe the venue, capacity, amenities..."
                    required
                  />
                </div>
              </>
            ) : form.category === "Tools & Equipment" ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-base-content mb-1">Item Name</label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base text-base-content bg-base-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Drill Machine, Camera, Guitar"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-base-content mb-1">Item Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base text-base-content bg-base-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Describe the item, condition, features..."
                    required
                  />
                </div>
              </>
            ) : form.category === "Lifestyle & Others" ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-base-content mb-1">Item Name</label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base text-base-content bg-base-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Sofa, Sports Gear, Book"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-base-content mb-1">Item Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base text-base-content bg-base-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Describe the item, brand, features..."
                    required
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-base-content mb-1">Title</label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base text-base-content bg-base-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-base-content mb-1">Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base text-base-content bg-base-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Description"
                    required
                  />
                </div>
              </>
            )}
            <div>
              <label className="block text-sm font-medium text-base-content mb-1">Location</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base text-base-content bg-base-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Comilla, Bangladesh"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-base-content mb-1">Owner Name</label>
              <input
                name="ownerName"
                value={form.ownerName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base text-base-content bg-base-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                readOnly={!!session?.user?.name}
                disabled={!!session?.user?.name}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-base-content mb-1">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base text-base-content bg-base-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                readOnly={!!session?.user?.email}
                disabled={!!session?.user?.email}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-base-content mb-1">Contact Number</label>
              <input
                name="contactNumber"
                value={form.contactNumber}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base text-base-content bg-base-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-base-content mb-1">Rent Price (৳/{["Vehicles", "Tools & Equipment", "Events & Venues"].includes(form.category) ? "day" : "month"})</label>
              <input
                name="rentPrice"
                type="number"
                value={form.rentPrice}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base text-base-content bg-base-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-base-content mb-1">Available From</label>
              <input
                name="availableFrom"
                type="date"
                value={form.availableFrom}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base text-base-content bg-base-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-base-content mb-1">Available To</label>
              <input
                name="availableTo"
                type="date"
                value={form.availableTo}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base text-base-content bg-base-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {/* Location & Map Section (inside form) */}
            <div className="flex flex-col gap-2">
              <label className="text-lg font-bold text-base-content mb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 12.414a4 4 0 1 0-5.657 5.657l4.243 4.243a8 8 0 1 0 11.314-11.314l-4.243 4.243z" /></svg>
                Location (GPS Only)
              </label>
              <div className="w-full h-64 rounded-xl overflow-hidden border border-green-300 relative flex items-center justify-center bg-base-200 mb-2">
                <button
                  type="button"
                  className="bg-green-600 text-white px-6 py-3 rounded-xl shadow text-lg font-semibold hover:bg-green-700 transition z-30"
                  onClick={handleGetLocationFromDevice}
                >
                  Use My Location (GPS)
                </button>
                {/* Show map and pin only if GPS is set */}
                {form.latitude && form.longitude && (
                  <>
                    <iframe
                      id="google-map-iframe"
                      title="Google Map"
                      src={`https://maps.google.com/maps?q=${form.latitude},${form.longitude}&z=16&ie=UTF8&iwloc=&output=embed`}
                      width="100%"
                      height="100%"
                      style={{
                        border: 0,
                        borderRadius: "0.75rem",
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        left: 0,
                        top: 0,
                      }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                    <div
                      className="absolute z-20"
                      style={{
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -100%)",
                        pointerEvents: "none",
                      }}
                    >
                      {/* Pin-point SVG icon */}
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16 2C10.477 2 6 6.477 6 12c0 7.732 8.06 16.01 8.41 16.34a1 1 0 0 0 1.18 0C17.94 28.01 26 19.732 26 12c0-5.523-4.477-10-10-10zm0 13.5A3.5 3.5 0 1 1 16 8a3.5 3.5 0 0 1 0 7.5z"
                          fill="#2563eb"
                        />
                        <circle cx="16" cy="12" r="3.5" fill="#fff" />
                      </svg>
                    </div>
                  </>
                )}
              </div>
              <div className="mt-1 text-xs text-base-content">
                {form.latitude && form.longitude
                  ? `Latitude: ${form.latitude.toFixed(5)}, Longitude: ${form.longitude.toFixed(5)}`
                  : "Please use GPS to select your location."}
              </div>
            </div>
            {/* Image Upload Section (inside form, keep imgbb logic) */}
            <div className="flex flex-col gap-2 mt-4">
              <label className="text-lg font-bold text-base-content mb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2zm0 0l7 7 4-4 5 5" /></svg>
                Image Upload
              </label>
              <input
                type="file"
                name="imageFile"
                accept="image/*"
                onChange={handleChange}
                className="w-full border border-pink-300 rounded-lg px-3 py-2 text-base text-base-content bg-base-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
              />
              {form.imageUrl && (
                <div className="mt-2 flex flex-col items-center">
                  <img src={form.imageUrl} alt="Preview" className="max-h-40 rounded-lg border shadow-lg" />
                  <div className="text-xs text-base-content break-all mt-1">{form.imageUrl}</div>
                </div>
              )}
            </div>
            <button
              type="submit"
              className="mt-8 w-full bg-blue-600 text-white font-semibold py-3 rounded-xl text-lg hover:bg-blue-700 transition"
            >
              Add Rent Post
            </button>
          </div>
        </div>
        {/* Live Preview Card */}
        <div className="md:w-5/12 w-full flex flex-col items-center justify-start">
          <div className="bg-base-200 rounded-2xl shadow-xl p-6 w-full mt-4 border border-base-300">
            <h2 className="text-2xl font-bold text-base-content mb-2 text-center">Live Preview</h2>
            <div className="flex flex-col gap-2 items-center">
              {form.imageUrl ? (
                <img src={form.imageUrl} alt="Preview" className="max-h-32 rounded-lg border shadow mb-2" />
              ) : (
                <div className="w-full h-32 bg-base-100 rounded-lg flex items-center justify-center text-base-content">Image Preview</div>
              )}
              <div className="text-lg font-bold text-base-content">{form.title || "Title"}</div>
              <div className="text-base text-base-content">{form.description || "Description"}</div>
              <div className="flex gap-2 mt-2">
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">{form.category || "Category"}</span>
                {form.subcategory && <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-semibold">{form.subcategory}</span>}
              </div>
              <div className="text-sm text-base-content mt-2">Location: {form.location || "Location"}</div>
              <div className="text-sm text-base-content">Price: ৳{form.rentPrice || "0"} {['Vehicles', 'Tools & Equipment', 'Events & Venues'].includes(form.category) ? '/day' : '/month'}</div>
              <div className="text-xs text-base-content">Available: {form.availableFrom || "From"} - {form.availableTo || "To"}</div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddRentPostsPage;
