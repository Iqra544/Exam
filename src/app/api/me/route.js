import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json({ user: null }, { status: 401 });
    }

    // Verify JWT
    const { payload } = await jwtVerify(token, secret);

    // Return user info from payload
    return Response.json({
      user: {
        id: payload.id,
        name: payload.name,
        email: payload.email,
      },
    });
  } catch (err) {
    console.error("JWT decode error:", err);
    return Response.json({ user: null }, { status: 401 });
  }
}
