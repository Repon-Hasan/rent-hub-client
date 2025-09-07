"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BecomeOwnerSection() {
  const { data: session } = useSession();
  const router = useRouter();

  // const session = true;

  const handleClick = () => {
    if (!session) router.push("/login");
    else router.push("/become-owner");
  };

  return (
    <section className="py-12 bg-primary text-primary-content text-center">
      <h2 className="text-3xl font-bold mb-4">Start Earning Today!</h2>
      <p className="mb-6 max-w-2xl mx-auto">
        Join thousands of owners renting out their assets – from cars to rice
        fields. Pay a small fee to list your items and start earning!
      </p>
      <button onClick={handleClick} className="btn btn-secondary">
        Become an Owner
      </button>
    </section>
  );
}
