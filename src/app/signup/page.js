"use client";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "" },
    validationSchema: Yup.object({
      name: Yup.string().min(3, "Name must be at least 3 characters").required("Full name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string().min(6, "At least 6 characters").required("Password is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        const data = await res.json();
        if (res.ok) {
          Swal.fire({
            icon: "success",
            title: "Signup Successful!",
            text: "Redirecting to login...",
            timer: 1800,
            showConfirmButton: false,
          });
          resetForm();
          setTimeout(() => router.push("/login"), 1800);
        } else {
          Swal.fire({ icon: "error", title: "Signup Failed", text: data.msg || "Something went wrong" });
        }
      } catch {
        Swal.fire({ icon: "error", title: "Server Error", text: "Please try again later." });
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-indigo-300 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/30 blur-3xl rounded-full -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-400/30 blur-3xl rounded-full -z-10 animate-pulse"></div>

      {/* Card */}
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white/80 backdrop-blur-xl p-10 rounded-2xl shadow-2xl w-full max-w-md border border-blue-100"
      >
        <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-6 tracking-tight">
          Create Account
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Join us and explore your dashboard.
        </p>

        {/* Name */}
        <div className="mb-5">
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            className={`w-full p-3 border rounded-lg bg-white/60 backdrop-blur focus:outline-none focus:ring-2 transition-all ${
              formik.touched.name && formik.errors.name
                ? "border-red-500 focus:ring-red-400"
                : "border-blue-300 focus:ring-blue-500"
            }`}
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-5">
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            className={`w-full p-3 border rounded-lg bg-white/60 backdrop-blur focus:outline-none focus:ring-2 transition-all ${
              formik.touched.email && formik.errors.email
                ? "border-red-500 focus:ring-red-400"
                : "border-blue-300 focus:ring-blue-500"
            }`}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-8 relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            className={`w-full p-3 pr-10 border rounded-lg bg-white/60 backdrop-blur focus:outline-none focus:ring-2 transition-all ${
              formik.touched.password && formik.errors.password
                ? "border-red-500 focus:ring-red-400"
                : "border-blue-300 focus:ring-blue-500"
            }`}
          />
          <div
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500 hover:text-blue-600"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </div>
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-lg transition-all shadow-md hover:shadow-xl active:scale-95"
        >
          {formik.isSubmitting ? "Creating Account..." : "Sign Up"}
        </button>

        {/* Login link */}
        <p className="text-center mt-6 text-gray-700 text-sm">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/")}
            className="text-blue-700 font-semibold hover:underline cursor-pointer"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
