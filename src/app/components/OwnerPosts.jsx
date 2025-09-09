export default function OwnerPosts({ posts }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-xl font-bold mb-4">Recent Rentals</h2>
      {posts.length === 0 ? (
        <p>No rentals yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map((post) => (
            <div key={post._id} className="p-4 border rounded-lg">
              <h3 className="font-semibold">{post.title}</h3>
              <p className="text-gray-600 text-sm">{post.location}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
