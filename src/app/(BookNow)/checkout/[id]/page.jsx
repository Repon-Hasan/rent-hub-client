import React from 'react';

async function getRentPost(id) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/rent-posts/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
}

const Page = async ({ params }) => {
    const awaitedParams = typeof params?.then === "function" ? await params : params;
    const post = await getRentPost(awaitedParams.id);
    if (!post) {
        return <div>Post not found.</div>;
    }
    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">
            <h2 className="text-2xl font-bold mb-4">Checkout for: {post.title}</h2>
            <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover rounded mb-4" />
            <div className="mb-2"><strong>Category:</strong> {post.category}</div>
            {post.subcategory && <div className="mb-2"><strong>Subcategory:</strong> {post.subcategory}</div>}
            <div className="mb-2"><strong>Location:</strong> {post.location}</div>
            <div className="mb-2"><strong>Available:</strong> {post.availableFrom} - {post.availableTo}</div>
            <div className="mb-2"><strong>Owner:</strong> {post.ownerName}</div>
            <div className="mb-2"><strong>Contact:</strong> {post.contactNumber}</div>
            <div className="mb-2"><strong>Rent Price:</strong> ৳{post.rentPrice}</div>
            <div className="mt-6">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition">Confirm & Pay</button>
            </div>
        </div>
    );
};

export default Page;