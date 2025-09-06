'use client';

import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';

export default function Newsletter() {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    // Mock backend call
    // await fetch('/api/subscribe', { method: 'POST', body: JSON.stringify(data) });
    Swal.fire({
      icon: 'success',
      title: 'Subscribed!',
      text: 'Thanks for joining our newsletter!',
      timer: 1500,
    });
    reset();
  };

  return (
    <section className="py-12 text-center">
      <h2 className="text-3xl font-bold mb-4 text-base-content dark:text-base-content">Stay Updated</h2>
      <p className="mb-6 text-base-content/70 dark:text-base-content/70">Get the latest listings and updates straight to your inbox.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:flex-row justify-center gap-4">
        <input
          type="email"
          {...register('email', { required: true })}
          placeholder="Enter your email"
          className="input input-bordered max-w-xs bg-base-100 dark:bg-base-200 text-base-content dark:text-base-content"
        />
        <button type="submit" className="btn btn-primary">Subscribe</button>
      </form>
    </section>
  );
}