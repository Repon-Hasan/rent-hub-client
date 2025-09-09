"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  // Get callbackUrl from query or referrer
  let callbackUrl = searchParams.get("callbackUrl");
  if (!callbackUrl && typeof window !== "undefined") {
    callbackUrl = document.referrer || "/";
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl,
    });

    setIsLoading(false);

    if (res?.error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: res.error,
        confirmButtonColor: "#2563EB",
      });
    } else {
      // Always redirect to callbackUrl if present
      router.push(callbackUrl || "/");
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signIn("google", { callbackUrl });
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-2 bg-base-200">
      <div className="w-full max-w-xl p-8 mx-auto space-y-6 shadow-2xl bg-base-100 rounded-2xl">
        <h2 className="text-3xl font-bold text-center text-base-content">Welcome Back!</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium text-base-content">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full transition-all duration-200 shadow-sm input input-bordered rounded-xl focus:ring-primary focus:border-primary"
              required
            />
          </div>

          {/* Password Input with Toggle */}
          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-medium text-base-content">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full transition-all duration-200 shadow-sm input input-bordered rounded-xl focus:ring-primary focus:border-primary"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute transition-colors -translate-y-1/2 right-3 top-1/2 text-base-content hover:text-primary"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full transition-all duration-200 shadow-lg btn btn-primary rounded-xl hover:shadow-xl"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="my-8 divider text-base-content/60">OR</div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full transition-all duration-200 shadow-lg btn btn-outline btn-primary rounded-xl hover:shadow-xl"
          disabled={isLoading}
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.24 10.27c.56 0 1.09.2 1.48.56l2.58-2.58c-.96-1-2.2-1.63-3.95-1.63-3.23 0-5.83 2.1-5.83 5.09s2.6 5.09 5.83 5.09c2.97 0 4.84-2.16 4.97-5.09H12.24V10.27z" fill="#4285F4" />
            <path d="M11.76 19.34c-1.89 0-3.46-.77-4.63-2.02l-2.61 2.6c1.65 1.55 3.86 2.44 6.94 2.44 3.73 0 6.64-1.99 8.01-4.82l-2.64-2.02c-.68 1.95-2.52 3.32-5.34 3.32z" fill="#34A853" />
            <path d="M19.98 12.06a7.7 7.7 0 0 0-.15-1.63H12.24v3.13h4.45a3.9 3.9 0 0 1-1.71 2.51l2.64 2.02c1.47-1.37 2.47-3.25 2.47-5.83z" fill="#FBBC05" />
            <path d="M4.63 17.32l2.61-2.6c-.76-.7-1.18-1.62-1.18-2.62s.42-1.92 1.18-2.62l-2.61-2.6C.93 7.82.01 9.87.01 12.06s.92 4.24 2.62 6.26z" fill="#EA4335" />
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  );
}