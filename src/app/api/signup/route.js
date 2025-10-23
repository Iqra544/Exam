import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectDB();
    const { name, email, password } = await req.json();

    if (!name || !email || !password)
      return Response.json({ msg: "All fields required" }, { status: 400 });

    const exists = await User.findOne({ email });
    if (exists)
      return Response.json({ msg: "Email already registered" }, { status: 400 });

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashed });

    return Response.json({ msg: "Signup successful" }, { status: 201 });
  } catch {
    return Response.json({ msg: "Server error" }, { status: 500 });
  }
}
