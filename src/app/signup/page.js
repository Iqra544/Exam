"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  // ✅ Formik setup with Yup validation
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, "Name must be at least 3 characters")
        .required("Full name is required"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
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
            text: "Redirecting to login page...",
            timer: 2000,
            showConfirmButton: false,
          });
          resetForm();
          setTimeout(() => router.push("/"), 2000);
        } else {
          Swal.fire({
            icon: "error",
            title: "Signup Failed",
            text: data.msg || "Something went wrong",
          });
        }
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Server error. Please try again later.",
        });
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-200 via-blue-100 to-purple-200">
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-96"
      >
        <h1 className="text-3xl font-extrabold mb-6 text-center text-green-700">
          Create Account
        </h1>

        {/* Full Name */}
        <div className="mb-4">
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
              formik.touched.name && formik.errors.name
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-green-400"
            }`}
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
              formik.touched.email && formik.errors.email
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-green-400"
            }`}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-6">
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
              formik.touched.password && formik.errors.password
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-green-400"
            }`}
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.password}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all duration-200"
        >
          {formik.isSubmitting ? "Creating Account..." : "Sign Up"}
        </button>

        <p className="text-center mt-4 text-gray-600 text-sm">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-green-700 font-semibold hover:underline cursor-pointer"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
