"use client";

import React, { useState } from 'react';
import Swal from 'sweetalert2';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // In a real-world application, this is where you would call an API endpoint.
    // As per your request, this version will only show a success message.
    console.log('Form submitted:', formData);

    Swal.fire({
      icon: 'success',
      title: 'Message Sent!',
      text: 'Thank you for your message. We will get back to you soon.',
      confirmButtonColor: "#2563EB",
    });

    // Clear the form after submission
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="px-2 py-16 bg-base-200 sm:py-24 sm:px-6 lg:px-8">
      <div className="max-w-6xl p-8 mx-auto shadow-2xl card bg-base-100 rounded-2xl sm:p-12">
        <h2 className="mb-8 text-3xl font-bold text-center sm:text-4xl text-base-content">Get in Touch</h2>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          {/* Contact Information Section */}
          <div className="flex flex-col justify-center">
            <p className="mb-6 text-lg text-base-content/80">
              Have a question, feedback, or need support? We're here to help. Reach out to us through the form or the contact information below.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl text-primary">✉️</span>
                <div>
                  <h4 className="font-semibold text-base-content">Email Us</h4>
                  <a href="mailto:support@yourdomain.com" className="text-sm link link-hover text-primary">support@yourdomain.com</a>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl text-primary">📞</span>
                <div>
                  <h4 className="font-semibold text-base-content">Call Us</h4>
                  <p className="text-sm text-base-content">+880 1234 567890</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl text-primary">📍</span>
                <div>
                  <h4 className="font-semibold text-base-content">Our Office</h4>
                  <p className="text-sm text-base-content">123 Rental Ave, City Center, Dhaka, Bangladesh</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Section */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block mb-1 text-sm font-medium text-base-content">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full transition-all duration-200 input input-bordered rounded-xl focus:ring-primary focus:border-primary"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-1 text-sm font-medium text-base-content">Your Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full transition-all duration-200 input input-bordered rounded-xl focus:ring-primary focus:border-primary"
                  required
                />
              </div>
              <div>
                <label htmlFor="subject" className="block mb-1 text-sm font-medium text-base-content">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full transition-all duration-200 input input-bordered rounded-xl focus:ring-primary focus:border-primary"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block mb-1 text-sm font-medium text-base-content">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full transition-all duration-200 textarea textarea-bordered rounded-xl focus:ring-primary focus:border-primary"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full transition-all duration-200 shadow-lg btn btn-primary rounded-xl hover:shadow-xl"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}