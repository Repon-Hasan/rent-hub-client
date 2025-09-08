"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Swal from "sweetalert2";

export default function RegisterPage() {
  const { register, handleSubmit } = useForm();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    
    // Default role is "renter"
    data.role = "renter";

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Registration Successful!",
          text: "You can now log in to your account.",
          confirmButtonText: "Go to Login",
        }).then(() => {
          router.push("/login");
        });
      } else {
        const err = await res.json().catch(() => ({}));
        
        // This is the new logic for handling existing users
        if (err.message === "Email already exists" || err.message === "Phone number already exists") {
          Swal.fire({
            icon: "info",
            title: "Already Registered",
            text: `${err.message}. Do you want to go to the login page?`,
            showCancelButton: true,
            confirmButtonText: "Go to Login",
          }).then((result) => {
            if (result.isConfirmed) {
              router.push("/login");
            }
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Registration Failed",
            text: err.message || "Something went wrong. Please try again.",
          });
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      Swal.fire({
        icon: "error",
        title: "Something Went Wrong!",
        text: "Please check your network and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signIn("google", { callbackUrl: "/" });
    setIsLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-4"
      >
        {/* First Name */}
        <input
          {...register("firstName", { required: true })}
          placeholder="First Name"
          className="input input-bordered w-full"
        />

        {/* Last Name */}
        <input
          {...register("lastName", { required: true })}
          placeholder="Last Name"
          className="input input-bordered w-full"
        />

        {/* Email */}
        <input
          {...register("email", { required: true })}
          placeholder="Email"
          type="email"
          className="input input-bordered w-full"
        />

        {/* Phone */}
        <input
          {...register("phone", { required: true })}
          placeholder="Phone Number"
          type="tel"
          className="input input-bordered w-full"
        />

        {/* Gender */}
        <select
          {...register("gender", { required: true })}
          className="select select-bordered w-full"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        {/* Image URL */}
        <input
          {...register("imageUrl")}
          placeholder="Profile Image URL "
          type="url"
          className="input input-bordered w-full"
        />

        {/* Password */}
        <div className="relative">
          <input
            {...register("password", { required: true, minLength: 6 })}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="input input-bordered w-full"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-sm"
          >
            {showPassword ? "🙈" : "👁"}
          </button>
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
          {isLoading ? "Registering..." : "Register"}
        </button>
      </form>

      <div className="divider">OR</div>

      <button
        onClick={handleGoogleSignIn}
        className="btn btn-outline btn-primary w-full"
        disabled={isLoading}
      >
        Continue with Google
      </button>
    </div>
  );
}
