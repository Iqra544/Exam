"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { PlusCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Dashboard() {
const [user, setUser] = useState(null);
const [items, setItems] = useState([
{ title: "Project Plan", desc: "Initial roadmap and deliverables.", date: "2025-10-23" },
{ title: "UI Design", desc: "Figma mockups for login & dashboard.", date: "2025-10-21" },
]);
const [showModal, setShowModal] = useState(false);
const [form, setForm] = useState({ title: "", desc: "" });
const router = useRouter();

// Redirect if not logged in
useEffect(() => {
fetch("/api/me")
.then((r) => r.json())
.then((d) => {
if (d.user) setUser(d.user);
else router.push("/");
})
.catch(() => router.push("/login"));
}, [router]);

const logout = async () => {
await fetch("/api/logout", { method: "POST" });
router.push("/");
};

const itemSchema = Yup.object().shape({
title: Yup.string().required("Title is required").min(3, "Title must be at least 3 characters"),
desc: Yup.string().required("Description is required").min(5, "Description must be at least 5 characters"),
});

const handleAddItem = async (e) => {
e.preventDefault();
try {
await itemSchema.validate(form, { abortEarly: false });
const newItem = {
...form,
date: new Date().toISOString().split("T")[0],
};
setItems([newItem, ...items]);
setForm({ title: "", desc: "" });
setShowModal(false);
Swal.fire({
icon: "success",
title: "Item added!",
text: "Your item has been successfully added.",
timer: 1500,
showConfirmButton: false,
});
} catch (error) {
Swal.fire({
icon: "error",
title: "Validation Error",
text: error.errors[0],
});
}
};

if (!user) {
return (
<div className="flex items-center justify-center h-screen text-lg font-semibold text-gray-600">
Loading your dashboard...
</div>
);
}

return (
<div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-8">
{/* Header */}
<div className="flex justify-between items-center mb-8 border-b pb-4">
<h1 className="text-3xl font-bold text-gray-800">
Welcome, <span className="text-blue-600">{user.name}</span> 👋
</h1>
<button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-medium shadow-sm transition-all" >
Logout
</button>
</div>

  {/* Items Section */}
  <div className="bg-white rounded-2xl shadow-md p-6">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold text-gray-700">Your Items</h2>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all shadow-sm"
      >
        <PlusCircleIcon className="w-5 h-5" />
        Add Item
      </button>
    </div>

    {items.length === 0 ? (
      <div className="text-center text-gray-500 py-8 border rounded-xl">
        <p className="text-lg font-medium">No items found</p>
        <p className="text-sm mt-1">Start by adding your first item!</p>
      </div>
    ) : (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="bg-gray-50 border rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
          >
            <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
            <p className="text-gray-600 text-sm mt-1 mb-3">{item.desc}</p>
            <p className="text-xs text-gray-400">Created on: {item.date}</p>
          </div>
        ))}
      </div>
    )}
  </div>

  {/* Add Item Modal */}
  {showModal && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-96 relative">
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-gray-700 mb-4 text-center">Add New Item</h2>
        <form onSubmit={handleAddItem}>
          <input
            type="text"
            placeholder="Title"
            className="w-full mb-3 p-2 border rounded"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            placeholder="Description"
            className="w-full mb-3 p-2 border rounded"
            value={form.desc}
            onChange={(e) => setForm({ ...form, desc: e.target.value })}
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-all"
          >
            Add Item
          </button>
        </form>
      </div>
    </div>
  )}
</div>


);
}