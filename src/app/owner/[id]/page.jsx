"use client";

import { useEffect, useState } from "react";
import OwnerDetails from "@/app/components/OwnerDetails";
import OwnerPosts from "@/app/components/OwnerPosts";
import ReviewsSection from "@/app/components/ReviewsSection";
import * as React from "react";

export default function OwnerProfile({ params: rawParams }) {
  // unwrap params promise safely
  const params = React.use(rawParams);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params?.id) return;

    setLoading(true);
    fetch(`/api/owner/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [params?.id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!data?.owner) return <p className="text-center mt-10">Owner not found</p>;

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <OwnerDetails owner={data.owner} />
      <OwnerPosts posts={data.posts} />
      <ReviewsSection ownerId={params.id} />
    </div>
  );
}
