export const dynamic = "force-dynamic";

import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return Response.json({ msg: "User not found" }, { status: 404 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return Response.json({ msg: "Invalid credentials" }, { status: 400 });
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ FIX: Await cookies() before setting
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 24 * 60 * 60,
    });

    return Response.json({ msg: "Login successful" }, { status: 200 });
  } catch (error) {
    console.error("Login Error:", error);
    return Response.json({ msg: "Server error" }, { status: 500 });
  }
}
