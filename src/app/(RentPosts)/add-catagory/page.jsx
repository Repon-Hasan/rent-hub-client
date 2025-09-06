"use client";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

const imgbbApiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

const AddCategoryPage = () => {
    const [name, setName] = useState("");
    const [subcategories, setSubcategories] = useState([""]);
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    // Fetch categories from DB
    // Fetch categories from DB
    const fetchCategories = async () => {
        try {
            const res = await fetch("/api/add-catagory");
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            }
        } catch (err) {
            setCategories([]);
        }
    };
    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubcategoryChange = (idx, value) => {
        setSubcategories((prev) => prev.map((sub, i) => (i === idx ? value : sub)));
    };
    const addSubcategory = () => setSubcategories((prev) => [...prev, ""]);
    const removeSubcategory = (idx) => setSubcategories((prev) => prev.filter((_, i) => i !== idx));

    const handleImageUpload = async (file) => {
        setLoading(true);
        const formData = new FormData();
        formData.append("image", file);
        try {
            const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (data.success) {
                setImageUrl(data.data.url);
                await Swal.fire({ icon: "success", title: "Image Uploaded", timer: 1200, showConfirmButton: false });
            } else {
                await Swal.fire({ icon: "error", title: "Image Upload Failed" });
            }
        } catch {
            await Swal.fire({ icon: "error", title: "Image Upload Error" });
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !imageUrl || subcategories.some((sub) => !sub.trim())) {
            await Swal.fire({ icon: "error", title: "All fields required" });
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("/api/add-catagory", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, subcategories, imageUrl }),
            });
            if (res.ok) {
                setName("");
                setSubcategories([""]);
                setImageFile(null);
                setImageUrl("");
                await Swal.fire({ icon: "success", title: "Category Added", timer: 1500, showConfirmButton: false });
                await fetchCategories(); // Refetch after add
            } else {
                const error = await res.text();
                await Swal.fire({ icon: "error", title: "Failed", text: error });
            }
        } catch {
            await Swal.fire({ icon: "error", title: "Error adding category" });
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen w-full bg-white flex flex-col py-12">
            <h1 className="text-center text-4xl font-bold text-gray-900 mb-10 tracking-wide font-sans">Add Category</h1>
            <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-8">
                {/* ...existing code for form... */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. Vehicles"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subcategories</label>
                    {subcategories.map((sub, idx) => (
                        <div key={idx} className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={sub}
                                onChange={(e) => handleSubcategoryChange(idx, e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Subcategory name"
                                required
                            />
                            {subcategories.length > 1 && (
                                <button type="button" onClick={() => removeSubcategory(idx)} className="px-3 py-2 bg-red-500 text-white rounded-lg">Remove</button>
                            )}
                        </div>
                    ))}
                    <button type="button" onClick={addSubcategory} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg">Add Subcategory</button>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                setImageFile(e.target.files[0]);
                                handleImageUpload(e.target.files[0]);
                            }
                        }}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {imageUrl && (
                        <div className="mt-2">
                            <img src={imageUrl} alt="Preview" className="max-h-40 rounded-lg border" />
                            <div className="text-xs text-gray-500 break-all">{imageUrl}</div>
                        </div>
                    )}
                </div>
                <button
                    type="submit"
                    className="w-full bg-green-600 text-white font-semibold py-3 rounded-xl text-lg hover:bg-green-700 transition"
                    disabled={loading}
                >
                    {loading ? "Adding..." : "Add Category"}
                </button>
            </form>

            {/* Categories List from DB */}
            <div className="w-full max-w-5xl mx-auto mt-16">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">All Categories</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {categories.length === 0 ? (
                        <div className="col-span-full text-center text-gray-500">No categories found.</div>
                    ) : (
                        categories.map((cat) => (
                            <div key={cat._id || cat.name} className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                                {cat.imageUrl && (
                                    <img src={cat.imageUrl} alt={cat.name} className="h-24 w-24 object-cover rounded-full mb-4 border" />
                                )}
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{cat.name}</h3>
                                <ul className="text-sm text-gray-700 list-disc pl-4 mb-2">
                                    {cat.subcategories.map((sub, i) => (
                                        <li key={i}>{sub}</li>
                                    ))}
                                </ul>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddCategoryPage;