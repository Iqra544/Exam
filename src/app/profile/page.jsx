"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", imageFile: null });
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function loadProfile() {
      const res = await fetch("/api/profile");
      const data = await res.json();

      if (!res.ok) {
        Swal.fire("Error", data.error || "Could not load profile", "error");
        router.push("/");
        return;
      }

      setUser(data.user);
      setForm({
        name: data.user.name || "",
        email: data.user.email || "",
        password: "",
        imageFile: null,
      });
      setImagePreview(data.user.image || "/uploads/default.png");
      setLoading(false);
    }
    loadProfile();
  }, [router]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);

    setForm({ ...form, imageFile: file });
  };

  async function save(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    if (form.password) formData.append("password", form.password);
    if (form.imageFile) formData.append("image", form.imageFile);

    const res = await fetch("/api/profile", {
      method: "PATCH",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) return Swal.fire("Error", data.error || "Could not save profile", "error");

    Swal.fire("Success", "Profile updated successfully.", "success");
    setUser(data.user);
    setEditMode(false);
    setForm({ ...form, password: "", imageFile: null });
  }

  if (loading)
    return <div className="p-6 text-center text-gray-600">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 flex flex-col items-center justify-center p-6 relative">
      {/* Dashboard Button (outside card) */}
      <button
        onClick={() => router.push("/dashboard")}
        className="absolute top-6 left-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
      >
        🏠 Go to Dashboard
      </button>

      {/* Profile Card */}
      <div className="bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl w-full max-w-lg p-8 border border-gray-100 mt-10">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
          My Profile
        </h1>

        {/* Profile Image */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative group">
            <img
              src={imagePreview || "/uploads/default.png"}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-300 shadow-md transition-transform group-hover:scale-105"
            />
            {editMode && (
              <label
                htmlFor="fileUpload"
                className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 shadow-md transition"
              >
                📷
                <input
                  type="file"
                  id="fileUpload"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={save} className="space-y-4">
          {/* Name */}
          <div>
            <label className="text-sm text-gray-600">Full Name</label>
            <input
              type="text"
              disabled={!editMode}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={`w-full p-3 border rounded-lg mt-1 ${
                editMode
                  ? "border-blue-400 focus:ring-2 focus:ring-blue-500"
                  : "bg-gray-100 cursor-not-allowed"
              }`}
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              disabled={!editMode}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={`w-full p-3 border rounded-lg mt-1 ${
                editMode
                  ? "border-blue-400 focus:ring-2 focus:ring-blue-500"
                  : "bg-gray-100 cursor-not-allowed"
              }`}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="text-sm text-gray-600">New Password</label>
            <input
              type={showPassword ? "text" : "password"}
              disabled={!editMode}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Leave blank to keep current"
              className={`w-full p-3 border rounded-lg mt-1 pr-10 ${
                editMode
                  ? "border-blue-400 focus:ring-2 focus:ring-blue-500"
                  : "bg-gray-100 cursor-not-allowed"
              }`}
            />
            {editMode && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-500 hover:text-blue-600"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            {editMode ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setEditMode(false);
                    setForm({ ...form, password: "", imageFile: null });
                    setImagePreview(user.image || "/uploads/default.png");
                  }}
                  className="px-4 py-2 border border-gray-400 rounded-lg text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setEditMode(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                ✏️ Edit Profile
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
