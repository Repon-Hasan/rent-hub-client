'use client'
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import Link from 'next/link';


export default function MyProducts() {
    const { data: session } = useSession();
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        if (!session?.user?.email) return;

        fetch(`/api/rent-posts?email=${session.user.email}`)
            .then((res) => res.json())
            .then((data) => setPosts(data));
    }, [session?.user?.email]);
    console.log(posts)

    if (!session) {
        return <p className="text-center text-red-600">Please login first.</p>;
    }

  useEffect(() => {
    toast.success('Your products loaded!');
  }, []);

  const handleAddProduct = () => {
    // Replace with API call or modal form for adding product
    toast.success('Add product feature coming soon!');
  };

//   const handleEdit = (id) => {
//       <Link href={`/api/edit-rent-posts/${id}`}></Link>
//   };

  const handleDelete = (id, name) => {
    // Replace with API call to delete product
    setProducts(products.filter((product) => product.id !== id));
    toast.success(`${name} deleted successfully!`);
  };

  return (
      <div className="container mx-auto p-4">
          <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-semibold mb-6"
          >
              My Products
          </motion.h2>
          <button className="btn btn-primary mb-4" onClick={handleAddProduct}>
              <Link href="/add-rent-posts">Add New Product</Link>
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {posts.map((product) => (
                  <motion.div
                      key={product._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="card bg-base-200 shadow-md"
                  >
                      <figure>
                          <img
                              src={product.imageUrl}
                              alt={product.ownerName}
                              className="h-48 w-full object-cover"
                          />
                      </figure>
                      <div className="card-body">
                          <h3 className="card-title">{product.title}</h3>
                          <p>{product.rentPrice} BDT</p>
                          <span
                              className={`badge ${
                                  product.status === 'Active'
                                      ? 'badge-success'
                                      : 'badge-warning'
                              }`}
                          >
                              {product.status}
                          </span>
                          <div className="card-actions mt-2">
                              <Link
                                  href={`/rent-posts/edit/${product._id}`}
                                  className="btn btn-primary btn-sm"
                              >
                                  Edit
                              </Link>
                              <button
                                  className="btn btn-error btn-sm"
                                  onClick={() =>
                                      handleDelete(product._id, product.title)
                                  }
                              >
                                  Delete
                              </button>
                          </div>
                      </div>
                  </motion.div>
              ))}
          </div>
          {posts.length === 0 && (
              <p className="text-center text-gray-500 mt-4">
                  No products listed.
              </p>
          )}
      </div>
  );
}