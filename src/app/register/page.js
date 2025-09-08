"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Swal from "sweetalert2";

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
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
          confirmButtonColor: "#2563EB", // Note: This is a third-party library, so it requires a hardcoded color
        }).then(() => {
          router.push("/login");
        });
      } else {
        const err = await res.json().catch(() => ({}));

        if (err.message === "Email already exists" || err.message === "Phone number already exists") {
          Swal.fire({
            icon: "info",
            title: "Already Registered",
            text: `${err.message}. Do you want to go to the login page?`,
            showCancelButton: true,
            confirmButtonText: "Go to Login",
            confirmButtonColor: "#2563EB",
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
            confirmButtonColor: "#2563EB",
          });
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      Swal.fire({
        icon: "error",
        title: "Something Went Wrong!",
        text: "Please check your network and try again.",
        confirmButtonColor: "#2563EB",
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
    <div className="flex items-center justify-center min-h-screen px-2 py-6 bg-base-200">
      <div className="w-full max-w-xl p-8 mx-auto shadow-2xl bg-base-100 rounded-2xl">
        <h2 className="mb-6 text-3xl font-bold text-center text-base-content">Create an Account</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-6"
        >
          {/* First Name & Last Name in a two-column grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="block mb-1 text-sm font-medium text-base-content">First Name</label>
              <input
                id="firstName"
                {...register("firstName", { required: "First Name is required" })}
                placeholder="John"
                className={`w-full input input-bordered rounded-xl shadow-sm focus:ring-primary focus:border-primary transition-all duration-200 ${errors.firstName ? 'input-error' : ''}`}
              />
              {errors.firstName && <p className="mt-1 text-xs text-error">{errors.firstName.message}</p>}
            </div>
            <div>
              <label htmlFor="lastName" className="block mb-1 text-sm font-medium text-base-content">Last Name</label>
              <input
                id="lastName"
                {...register("lastName", { required: "Last Name is required" })}
                placeholder="Doe"
                className={`w-full input input-bordered rounded-xl shadow-sm focus:ring-primary focus:border-primary transition-all duration-200 ${errors.lastName ? 'input-error' : ''}`}
              />
              {errors.lastName && <p className="mt-1 text-xs text-error">{errors.lastName.message}</p>}
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium text-base-content">Email</label>
            <input
              id="email"
              {...register("email", { required: "Email is required" })}
              placeholder="you@example.com"
              type="email"
              className={`w-full input input-bordered rounded-xl shadow-sm focus:ring-primary focus:border-primary transition-all duration-200 ${errors.email ? 'input-error' : ''}`}
            />
            {errors.email && <p className="mt-1 text-xs text-error">{errors.email.message}</p>}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block mb-1 text-sm font-medium text-base-content">Phone Number</label>
            <input
              id="phone"
              {...register("phone", { required: "Phone number is required" })}
              placeholder="+8801234567890"
              type="tel"
              className={`w-full input input-bordered rounded-xl shadow-sm focus:ring-primary focus:border-primary transition-all duration-200 ${errors.phone ? 'input-error' : ''}`}
            />
            {errors.phone && <p className="mt-1 text-xs text-error">{errors.phone.message}</p>}
          </div>

          {/* Gender */}
          <div>
            <label htmlFor="gender" className="block mb-1 text-sm font-medium text-base-content">Gender</label>
            <select
              id="gender"
              {...register("gender", { required: "Gender is required" })}
              className={`w-full select select-bordered rounded-xl shadow-sm focus:ring-primary focus:border-primary transition-all duration-200 ${errors.gender ? 'select-error' : ''}`}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && <p className="mt-1 text-xs text-error">{errors.gender.message}</p>}
          </div>

          {/* Image URL */}
          <div>
            <label htmlFor="imageUrl" className="block mb-1 text-sm font-medium text-base-content">Profile Image URL (Optional)</label>
            <input
              id="imageUrl"
              {...register("imageUrl")}
              placeholder="https://example.com/profile.jpg"
              type="url"
              className="w-full transition-all duration-200 shadow-sm input input-bordered rounded-xl focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-medium text-base-content">Password</label>
            <div className="relative">
              <input
                id="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters"
                  }
                })}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`w-full input input-bordered rounded-xl shadow-sm focus:ring-primary focus:border-primary transition-all duration-200 ${errors.password ? 'input-error' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute transition-colors -translate-y-1/2 right-3 top-1/2 text-base-content hover:text-primary"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-error">{errors.password.message}</p>}
          </div>

          {/* Submit Button */}
          <button type="submit" className="w-full transition-all duration-200 shadow-lg btn btn-primary rounded-xl hover:shadow-xl" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="my-8 divider text-base-content/60">OR</div>

        {/* Google Sign-in Button */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full transition-all duration-200 shadow-lg btn btn-outline btn-primary rounded-xl hover:shadow-xl"
          disabled={isLoading}
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.24 10.27c.56 0 1.09.2 1.48.56l2.58-2.58c-.96-1-2.2-1.63-3.95-1.63-3.23 0-5.83 2.1-5.83 5.09s2.6 5.09 5.83 5.09c2.97 0 4.84-2.16 4.97-5.09H12.24V10.27z" fill="#4285F4"/>
            <path d="M11.76 19.34c-1.89 0-3.46-.77-4.63-2.02l-2.61 2.6c1.65 1.55 3.86 2.44 6.94 2.44 3.73 0 6.64-1.99 8.01-4.82l-2.64-2.02c-.68 1.95-2.52 3.32-5.34 3.32z" fill="#34A853"/>
            <path d="M19.98 12.06a7.7 7.7 0 0 0-.15-1.63H12.24v3.13h4.45a3.9 3.9 0 0 1-1.71 2.51l2.64 2.02c1.47-1.37 2.47-3.25 2.47-5.83z" fill="#FBBC05"/>
            <path d="M4.63 17.32l2.61-2.6c-.76-.7-1.18-1.62-1.18-2.62s.42-1.92 1.18-2.62l-2.61-2.6C.93 7.82.01 9.87.01 12.06s.92 4.24 2.62 6.26z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  );
}