export const dynamic = "force-dynamic";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return new Response(JSON.stringify({ user: null }), { status: 200 });

    const payload = verifyToken(token);
    if (!payload) return new Response(JSON.stringify({ user: null }), { status: 200 });

    const user = await User.findById(payload.id).select("-password").lean();
    return new Response(JSON.stringify({ user }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ user: null }), { status: 200 });
  }
}
