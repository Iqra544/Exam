"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Search, Edit2, Trash2 } from "lucide-react";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [form, setForm] = useState({ title: "", description: "" });
  const [editItem, setEditItem] = useState(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;
  const router = useRouter();

  useEffect(() => {
    async function init() {
      const res = await fetch("/api/me");
      const data = await res.json();
      if (!data.user) return router.push("/");
      setUser(data.user);
      await loadItems();
      setLoading(false);
    }
    init();
  }, [router]);

  async function loadItems() {
    const res = await fetch("/api/items");
    const data = await res.json();
    setItems(data.items || []);
    setFiltered(data.items || []);
  }

  // Search filter
  useEffect(() => {
    if (!search.trim()) {
      setFiltered(items);
    } else {
      const lower = search.toLowerCase();
      setFiltered(
        items.filter(
          (it) =>
            it.title.toLowerCase().includes(lower) ||
            it.description?.toLowerCase().includes(lower)
        )
      );
    }
    setPage(1); // reset to first page after search
  }, [search, items]);

  async function handleAdd(e) {
    e.preventDefault();
    if (!form.title.trim()) {
      return Swal.fire("Validation Error", "Title is required", "error");
    }

    const res = await fetch("/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) return Swal.fire("Error", data.error || "Add failed", "error");

    Swal.fire("Success", "Item added successfully", "success");
    setItems((prev) => [data.item, ...prev]);
    setForm({ title: "", description: "" });
    setShowAdd(false);
  }

  async function handleDelete(id) {
    const confirm = await Swal.fire({
      title: "Delete this item?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });
    if (!confirm.isConfirmed) return;

    const res = await fetch(`/api/items/${id}`, { method: "DELETE" });
    if (!res.ok) return Swal.fire("Error", "Delete failed", "error");

    Swal.fire("Deleted!", "Item has been deleted", "success");
    setItems((prev) => prev.filter((it) => it._id !== id));
  }

  async function handleEdit(e) {
    e.preventDefault();

    const res = await fetch(`/api/items/${editItem._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) return Swal.fire("Error", data.error || "Update failed", "error");

    Swal.fire("Success", "Item updated", "success");
    setItems((prev) =>
      prev.map((it) => (it._id === editItem._id ? data.item : it))
    );
    setShowEdit(false);
  }

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/");
  }

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-gray-600 text-lg">
        Loading dashboard...
      </div>
    );

  // Pagination logic
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedItems = filtered.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md py-4 px-8 flex justify-between items-center sticky top-0 z-20">
        <h1 className="text-2xl font-bold text-blue-700">Dashboard</h1>
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/profile")}
            className="px-4 py-2 border border-blue-400 text-blue-700 rounded-lg hover:bg-blue-50 transition"
          >
            Profile
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3">
            <h2 className="text-xl font-semibold text-gray-800">
              Welcome, <span className="text-blue-700">{user.name}</span>
            </h2>
            <button
              onClick={() => setShowAdd(true)}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition shadow-md"
            >
              + Add Item
            </button>
          </div>

          {/* Search bar */}
          <div className="relative mb-6 max-w-md mx-auto sm:mx-0">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search items..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Items Grid */}
          {paginatedItems.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              <p>No items found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             {paginatedItems.map((it) => (
  <div
    key={it._id}
    onClick={() => router.push(`/items/${it._id}`)}
    className="bg-white rounded-2xl shadow hover:shadow-xl p-5 border border-gray-100 transition transform hover:-translate-y-1 cursor-pointer relative group"
  >
    <div>
      <h3 className="text-lg font-bold text-gray-800 mb-2">
        {it.title}
      </h3>
      <p className="text-sm text-gray-600 mb-3">
        {it.description?.slice(0, 100)}...
      </p>
      <p className="text-xs text-gray-400 mb-4">
        {new Date(it.createdAt).toLocaleString()}
      </p>
    </div>

    {/* Buttons */}
    <div
      className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition"
      onClick={(e) => e.stopPropagation()} // ✅ stops navigation when clicking buttons
    >
      <button
        onClick={() => {
          setEditItem(it);
          setForm({ title: it.title, description: it.description });
          setShowEdit(true);
        }}
        className="text-blue-600 hover:text-blue-800 bg-white p-1.5 rounded-full shadow"
      >
        <Edit2 size={16} />
      </button>
      <button
        onClick={() => handleDelete(it._id)}
        className="text-red-500 hover:text-red-700 bg-white p-1.5 rounded-full shadow"
      >
        <Trash2 size={16} />
      </button>
    </div>
  </div>
))}

            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 gap-3">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 border rounded-lg hover:bg-blue-50 disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-gray-700 font-medium">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 border rounded-lg hover:bg-blue-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Add Modal */}
      {showAdd && (
        <Modal title="Add New Item" onClose={() => setShowAdd(false)}>
          <form onSubmit={handleAdd} className="space-y-3">
            <input
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <textarea
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Add
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Modal */}
      {showEdit && (
        <Modal title="Edit Item" onClose={() => setShowEdit(false)}>
          <form onSubmit={handleEdit} className="space-y-3">
            <input
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <textarea
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setShowEdit(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Update
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-96 p-6 animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-blue-700">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✖
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
