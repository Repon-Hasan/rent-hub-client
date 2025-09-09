'use client';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import Swal from "sweetalert2";

const imgbbApiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

const initialForm = {
    category: '',
    subcategory: '',
    title: '',
    description: '',
    location: '',
    ownerName: '',
    email: '',
    contactNumber: '',
    rentPrice: '',
    availableFrom: '',
    availableTo: '',
    imageUrl: '',
    latitude: '',
    longitude: '',
    status: 'pending'
};

const AddRentPostsPage = () => {
    const { data: session } = useSession();
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [mapPosition, setMapPosition] = useState({
        lat: 23.685,
        lng: 90.3563,
    }); // Bangladesh center
    // Fetch categories from DB

    const [form, setForm] = useState({
        ownerName: '',
        email: session?.user?.email || '',
        category: '',
        subcategory: '',
        title: '',
        description: '',
        location: '',
        contactNumber: '',
        rentPrice: '',
        availableFrom: '',
        availableTo: '',
        imageUrl: '',
        latitude: '',
        longitude: '',
        status: 'pending'
    });

    useEffect(() => {
        if (session?.user) {
            setForm((prev) => ({
                ...prev,
                email: session?.user?.email || '',
            }));
        }
    }, [session]);
  console.log(session)

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('/api/add-category');
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
        if ( name === 'email') return;
        if (name === 'category') {
            setForm((prev) => ({ ...prev, category: value, subcategory: '' }));
            // Find selected category object from DB
            const selectedCat = categories.find((cat) => cat.name === value);
            setSubcategories(selectedCat ? selectedCat.subcategories : []);
        } else if (name === 'subcategory') {
            setForm((prev) => ({ ...prev, subcategory: value }));
        } else if (name === 'imageFile' && files && files[0]) {
            handleImageUpload(files[0]);
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    // Upload image to imgbb
    const handleImageUpload = async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        try {
            const res = await fetch(
                `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
                {
                    method: 'POST',
                    body: formData,
                },
            );
            const data = await res.json();
            if (data.success) {
                setForm((prev) => ({ ...prev, imageUrl: data.data.url }));
                    Swal.fire({
                        icon: 'success',
                        title: 'Image uploaded!',
                        text: 'Image uploaded successfully.',
                        timer: 1500,
                        showConfirmButton: false,
                    });
            } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Image upload failed',
                        text: 'Please try again.',
                    });
            }
        } catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: 'Image upload error',
                    text: 'Please try again.',
                });
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
                    setForm((prev) => ({
                        ...prev,
                        latitude: lat,
                        longitude: lng,
                    }));
                },
                (error) => {
                    alert('Unable to retrieve your location.');
                },
            );
        } else {
            alert('Geolocation is not supported by your browser.');
        }
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/rentPosts', {
                method: 'POST',
                
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Rent post added!',
                        text: 'Your post has been added.',
                        timer: 1800,
                        showConfirmButton: false,
                    });
                setForm(initialForm);
                setSubcategories([]);
            } else {
                const error = await res.json();
                    Swal.fire({
                        icon: 'error',
                        title: 'Failed to add rent post',
                        text: error?.error || `Status: ${res.status}`,
                    });
            }
        } catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error posting data',
                    text: 'Please try again.',
                });
        }
    };

    return (
        <div className="min-h-screen w-11/12 mx-auto bg-base-100 text-base-content flex flex-col py-12">
            <h1 className="text-center text-4xl font-bold mb-10 tracking-wide font-sans">
                Add Rent Post
            </h1>
            <form onSubmit={handleSubmit} className="w-full px-2 sm:px-6">
                <div>
                    <button className="btn btn-primary mb-3">
                        <Link href="/dashboard/owner/my-rentals">Back</Link>
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-base-200 rounded-2xl text-base-content shadow-lg p-8">
                    <div className="flex flex-col gap-6">
                        <div>
                            <label className="block text-sm font-medium text-base-content mb-1">
                                Category
                            </label>
                            <select
                                name="category"
                                value={form.category || ''}
                                onChange={handleChange}
                                className="w-full border border-base-200 rounded-lg px-3 py-2 text-base text-base-content bg-base-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option
                                        key={cat._id || cat.name}
                                        value={cat.name}
                                    >
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-base-content mb-1">
                                Subcategory
                            </label>
                            <select
                                name="subcategory"
                                value={form.subcategory}
                                onChange={handleChange}
                                className="w-full border border-base-200 rounded-lg px-3 py-2 text-base text-base-content bg-base-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                disabled={!form.category}
                            >
                                <option value="">Select Subcategory</option>
                                {subcategories.map((sub) => (
                                    <option key={sub} value={sub}>
                                        {sub}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* Conditional fields for each category */}
                        {form.category === 'Vehicles' ? (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-base-content mb-1">
                                        Model
                                    </label>
                                    <input
                                        name="title"
                                        value={form.title || ''}
                                        onChange={handleChange}
                                        className="w-full border border-base-200 rounded-lg px-3 py-2 text-base text-base-content bg-base-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g. Toyota Corolla"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-base-content mb-1">
                                        Number Plate
                                    </label>
                                    <input
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        className="w-full border border-base-200 rounded-lg px-3 py-2 text-base text-base-content bg-base-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g. DHAKA-D-1234"
                                        required
                                    />
                                </div>
                            </>
                        ) : form.category === 'Properties & Living' ? (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-base-content mb-1">
                                        Property Title
                                    </label>
                                    <input
                                        name="title"
                                        value={form.title}
                                        onChange={handleChange}
                                        className="w-full border border-base-200 rounded-lg px-3 py-2 text-base text-base-content bg-base-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g. Grand Event Hall, Cozy Apartment"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-base-content mb-1">
                                        Property Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        className="w-full border border-base-200 rounded-lg px-3 py-2 text-base text-base-content bg-base-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows={3}
                                        placeholder="Describe the property..."
                                        required
                                    />
                                </div>
                            </>
                        ) : form.category === 'Land & Nature' ? (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-base-content mb-1">
                                        Land Type
                                    </label>
                                    <input
                                        name="title"
                                        value={form.title}
                                        onChange={handleChange}
                                        className="w-full border border-base-200 rounded-lg px-3 py-2 text-base text-base-content bg-base-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g. Rice Field, Pond, Garden"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-base-content mb-1">
                                        Land Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        className="w-full border border-base-200 rounded-lg px-3 py-2 text-base text-base-content bg-base-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows={3}
                                        placeholder="Describe the land, size, features..."
                                        required
                                    />
                                </div>
                            </>
                        ) : form.category === 'Events & Venues' ? (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-base-content mb-1">
                                        Venue Name
                                    </label>
                                    <input
                                        name="title"
                                        value={form.title}
                                        onChange={handleChange}
                                        className="w-full border border-base-200 rounded-lg px-3 py-2 text-base text-base-content bg-base-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g. Banquet Hall, Party Space"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-base-content mb-1">
                                        Venue Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        className="w-full border border-base-200 rounded-lg px-3 py-2 text-base text-base-content bg-base-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows={3}
                                        placeholder="Describe the venue, capacity, amenities..."
                                        required
                                    />
                                </div>
                            </>
                        ) : form.category === 'Tools & Equipment' ? (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-base-content mb-1">
                                        Item Name
                                    </label>
                                    <input
                                        name="title"
                                        value={form.title}
                                        onChange={handleChange}
                                        className="w-full border border-base-200 rounded-lg px-3 py-2 text-base text-base-content bg-base-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g. Drill Machine, Camera, Guitar"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-base-content mb-1">
                                        Item Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        className="w-full border border-base-200 rounded-lg px-3 py-2 text-base text-base-content bg-base-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows={3}
                                        placeholder="Describe the item, condition, features..."
                                        required
                                    />
                                </div>
                            </>
                        ) : form.category === 'Lifestyle & Others' ? (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-base-content mb-1">
                                        Item Name
                                    </label>
                                    <input
                                        name="title"
                                        value={form.title}
                                        onChange={handleChange}
                                        className="w-full border border-base-200 rounded-lg px-3 py-2 text-base text-base-content bg-base-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g. Sofa, Sports Gear, Book"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-base-content mb-1">
                                        Item Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        className="w-full border border-base-200 rounded-lg px-3 py-2 text-base text-base-content bg-base-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows={3}
                                        placeholder="Describe the item, brand, features..."
                                        required
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-base-content mb-1">
                                        Title
                                    </label>
                                    <input
                                        name="title"
                                        value={form.title}
                                        onChange={handleChange}
                                        className="w-full border border-base-200 rounded-lg px-3 py-2 text-base text-base-content bg-base-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Title"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-base-content mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        className="w-full border border-base-200 rounded-lg px-3 py-2 text-base text-base-content bg-base-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows={3}
                                        placeholder="Description"
                                        required
                                    />
                                </div>
                            </>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-base-content mb-1">
                                Location
                            </label>
                            <input
                                name="location"
                                value={form.location || ''}
                                onChange={handleChange}
                                className="w-full border border-base-200 rounded-lg px-3 py-2 text-base text-base-content bg-base-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g. Comilla, Bangladesh"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-base-content mb-1">
                                Owner Name
                            </label>
                            <input
                                name="ownerName"
                                value={form.ownerName || (session?.user?.name || '')}
                                onChange={handleChange}
                                className="w-full cursor-not-allowed border border-base-200 rounded-lg px-3 py-2 text-base text-base-content bg-base-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                readOnly
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-base-content mb-1">
                                Email
                            </label>
                            <input
                                name="email"
                                type="email"
                                value={form.email || ''}
                                onChange={handleChange}
                                className="w-full cursor-not-allowed border border-base-200 rounded-lg px-3 py-2 text-base text-base-content bg-base-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                readOnly
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-base-content mb-1">
                                Contact Number
                            </label>
                            <input
                                name="contactNumber"
                                value={form.contactNumber || ''}
                                onChange={handleChange}
                                className="w-full border border-base-200 rounded-lg px-3 py-2 text-base text-base-content bg-base-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-base-content mb-1">
                                Rent Price (৳/
                                {[
                                    'Vehicles',
                                    'Tools & Equipment',
                                    'Events & Venues',
                                ].includes(form.category)
                                    ? 'day'
                                    : 'month'}
                                )
                            </label>
                            <input
                                name="rentPrice"
                                type="number"
                                value={form.rentPrice}
                                onChange={handleChange}
                                className="w-full border border-base-200 rounded-lg px-3 py-2 text-base text-base-content bg-base-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-base-content mb-1">
                                Available From
                            </label>
                            <input
                                name="availableFrom"
                                type="date"
                                value={form.availableFrom}
                                onChange={handleChange}
                                className="w-full border border-base-200 rounded-lg px-3 py-2 text-base text-base-content bg-base-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-base-content mb-1">
                                Available To
                            </label>
                            <input
                                name="availableTo"
                                type="date"
                                value={form.availableTo}
                                onChange={handleChange}
                                className="w-full border border-base-200 rounded-lg px-3 py-2 text-base text-base-content bg-base-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-base-content mb-1">
                                Image Upload
                            </label>
                            <input
                                type="file"
                                name="imageFile"
                                accept="image/*"
                                onChange={handleChange}
                                className="w-full border border-base-200 rounded-lg px-3 py-2 text-base text-base-content bg-base-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            {form.imageUrl && (
                                <div className="mt-2">
                                    <img
                                        src={form.imageUrl}
                                        alt="Preview"
                                        className="max-h-40 rounded-lg border"
                                    />
                                    <div className="text-xs text-base-content break-all">
                                        {form.imageUrl}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col gap-6 justify-between">
                        <div>
                            <label className="block text-sm font-medium text-base-content mb-2">
                                Location (GPS Only)
                            </label>
                            <div className="w-full h-64 md:h-[calc(100vh-8rem)] rounded-xl overflow-hidden border border-base-200 relative bg-base-100">
                                {/* Overlay button on map */}
                                {form.latitude && form.longitude && (
                                    <>
                                        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40">
                                            <button
                                                type="button"
                                                className="bg-green-600 text-base-content px-6 py-3 rounded-xl shadow text-lg font-semibold hover:bg-green-700 transition"
                                                onClick={handleGetLocationFromDevice}
                                            >
                                                Use My Location (GPS)
                                            </button>
                                        </div>
                                        <div className="relative w-full h-full">
                                            <MapSelector
                                                latitude={form.latitude}
                                                longitude={form.longitude}
                                                onSelect={(lat, lng) => setForm((prev) => ({ ...prev, latitude: lat, longitude: lng }))}
                                            />
                                        </div>
                                    </>
                                )}
                                {/* If no lat/lng, show button only */}
                                {!form.latitude || !form.longitude ? (
                                    <div className="flex items-center justify-center w-full h-full">
                                        <button
                                            type="button"
                                            className="bg-green-600 text-base-content px-6 py-3 rounded-xl shadow text-lg font-semibold hover:bg-green-700 transition"
                                            onClick={handleGetLocationFromDevice}
                                        >
                                            Use My Location (GPS)
                                        </button>
                                    </div>
                                ) : null}
                            </div>
                            <div className="mt-2 text-xs text-base-content">
                                {form.latitude && form.longitude
                                    ? `Latitude: ${form.latitude.toFixed(5)}, Longitude: ${form.longitude.toFixed(5)}`
                                    : 'Please use GPS to select your location.'}
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="mt-8 w-full bg-blue-600 text-white font-semibold py-3 rounded-xl text-lg hover:bg-blue-700 transition"
                        >
                            Add Rent Post
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

function MapSelector({ latitude, longitude, onSelect }) {
    const mapRef = useRef(null);
    useEffect(() => {
        let map;
        let marker;
        function loadMap() {
            if (!mapRef.current) return;
            // Remove any previous map instance
            if (mapRef.current._leaflet_map) {
                mapRef.current._leaflet_map.remove();
                mapRef.current._leaflet_map = null;
            }
            map = window.L.map(mapRef.current, { closePopupOnClick: false }).setView([latitude, longitude], 16);
            window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
            }).addTo(map);
            marker = window.L.marker([latitude, longitude], { draggable: true }).addTo(map);
            marker.on('dragend', function (e) {
                const { lat, lng } = e.target.getLatLng();
                onSelect(lat, lng);
            });
            map.on('click', function (e) {
                const { lat, lng } = e.latlng;
                marker.setLatLng([lat, lng]);
                onSelect(lat, lng);
            });
            mapRef.current._leaflet_map = map;
        }
        // Load Leaflet if not present
        if (!window.L) {
            const leafletScript = document.createElement('script');
            leafletScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            leafletScript.async = true;
            document.body.appendChild(leafletScript);
            leafletScript.onload = () => {
                loadMap();
            };
            const leafletCss = document.createElement('link');
            leafletCss.rel = 'stylesheet';
            leafletCss.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(leafletCss);
        } else {
            loadMap();
        }
        // Clean up
        return () => {
            if (mapRef.current && mapRef.current._leaflet_map) {
                mapRef.current._leaflet_map.remove();
                mapRef.current._leaflet_map = null;
            }
        };
    }, [latitude, longitude]);
    return <div ref={mapRef} style={{ width: '100%', height: '100%', borderRadius: '0.75rem', zIndex: 10 }} />;
}

export default AddRentPostsPage;
