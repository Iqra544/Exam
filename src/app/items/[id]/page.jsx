"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Swal from "sweetalert2";

export default function ItemDetail() {
  const params = useParams();
  const id = params.id;
  const router = useRouter();
  const [item, setItem] = useState(null);
  const [comments, setComments] = useState([]);
  const [form, setForm] = useState({ author: "", text: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [r1, r2] = await Promise.all([
          fetch(`/api/items/${id}`),
          fetch(`/api/items/${id}/comments`),
        ]);
        if (!r1.ok) throw new Error("Item not found");
        const itemData = await r1.json();
        const commentsData = await r2.json();
        setItem(itemData.item);
        setComments(commentsData.comments || []);
      } catch (err) {
        Swal.fire("Error", "Could not load item", "error");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, router]);

  async function submitComment(e) {
    e.preventDefault();
    if (!form.author.trim()) return Swal.fire("Error", "Name required", "error");
    if (!form.text.trim()) return Swal.fire("Error", "Comment required", "error");

    const res = await fetch(`/api/items/${id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok)
      return Swal.fire("Error", data.error || "Could not post comment", "error");

    setComments((prev) => [...prev, data.comment]);
    setForm({ author: "", text: "" });
  }

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );

  if (!item) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6 md:p-10">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Back Button */}
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <span className="text-xl mr-2">←</span>
          Back to Dashboard
        </button>

        {/* Item Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 transition hover:shadow-xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-3">{item.title}</h1>
          <p className="text-gray-600 leading-relaxed mb-6">{item.description}</p>

          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>📅 {new Date(item.createdAt).toLocaleString()}</span>
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">
              Item ID: {item._id.slice(-6)}
            </span>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
            💬 Comments
            <span className="ml-2 text-gray-400 text-sm">
              ({comments.length})
            </span>
          </h2>

          {comments.length === 0 ? (
            <p className="text-gray-500 italic mb-6 text-center">
              No comments yet. Be the first to share your thoughts!
            </p>
          ) : (
            <ul className="space-y-4 mb-8">
              {comments.map((c) => (
                <li
                  key={c._id}
                  className="flex items-start space-x-3 p-4 border border-gray-200 rounded-xl bg-gray-50 hover:shadow-sm transition"
                >
                  <div className="w-10 h-10 flex-shrink-0 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-semibold">
                    {c.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-gray-800">
                        {c.author}
                      </span>
                      <small className="text-xs text-gray-400">
                        {new Date(c.createdAt).toLocaleString()}
                      </small>
                    </div>
                    <p className="text-gray-700">{c.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Add Comment Form */}
          <form
            onSubmit={submitComment}
            className="bg-gray-50 border border-gray-200 p-5 rounded-xl"
          >
            <h3 className="text-lg font-medium mb-3 text-gray-800">
              Add a Comment
            </h3>
            <div className="grid gap-3">
              <input
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                placeholder="Your name"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <textarea
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
                placeholder="Write something nice..."
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <div className="text-right">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-2 rounded-xl hover:from-blue-700 hover:to-blue-600 transition font-medium shadow-md"
                >
                  Post Comment
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
