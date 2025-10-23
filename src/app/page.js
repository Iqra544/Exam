"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Validation Schema
  const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  });

  // ✅ Handle Login
  const handleLogin = async (values, { setSubmitting, resetForm }) => {
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      setSubmitting(false);

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Login Successful!",
          text: "Redirecting to Dashboard...",
          timer: 2000,
          showConfirmButton: false,
        });
        setTimeout(() => router.push("/dashboard"), 2000);
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: data.msg || "Invalid credentials!",
        });
        resetForm(); // ✅ Clear fields when login fails
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Something went wrong. Please try again later.",
      });
      setSubmitting(false);
      resetForm(); // ✅ Also clear on server error
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-[380px] transition-all duration-300 hover:shadow-blue-200">
        <h1 className="text-2xl font-extrabold text-center text-blue-700 mb-6">
          Welcome Back 👋
        </h1>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              {/* Email */}
              <div>
                <Field
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Password with Eye Toggle */}
              <div className="relative">
                <Field
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-blue-600"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
                <ErrorMessage
                  name="password"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 text-white font-semibold rounded-lg transition ${
                  isSubmitting
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>

        <p className="text-sm mt-6 text-center text-gray-600">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:underline font-medium">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
