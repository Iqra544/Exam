export const dynamic = "force-dynamic";
import connectDB from "@/lib/db";
import Item from "@/models/Item";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function GET(req) {
  try {
    await connectDB();
    // optional: list items for logged-in user if token present; otherwise return empty or public items
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return new Response(JSON.stringify({ items: [] }), { status: 200 });

    const payload = verifyToken(token);
    if (!payload) return new Response(JSON.stringify({ items: [] }), { status: 200 });

    const items = await Item.find({ user: payload.id }).sort({ createdAt: -1 }).lean();
    return new Response(JSON.stringify({ items }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });

    const body = await req.json();
    const title = (body.title || "").trim();
    const description = (body.description || "").trim();

    // Server-side validation
    if (!title || title.length < 3) {
      return new Response(JSON.stringify({ error: "Title must be at least 3 characters" }), { status: 400 });
    }
    if (description.length > 2000) {
      return new Response(JSON.stringify({ error: "Description too long" }), { status: 400 });
    }

    const item = await Item.create({ user: payload.id, title, description });
    return new Response(JSON.stringify({ item }), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
