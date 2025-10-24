import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req) {
  const token = req.cookies.get("token")?.value;

  // If no token → redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    // Verify token validity
    await jwtVerify(token, secret);
    return NextResponse.next(); // Allow access
  } catch (err) {
    // Invalid/expired token → redirect to login
    return NextResponse.redirect(new URL("/", req.url));
  }
}

// Protect only dashboard route (you can add more)
export const config = { matcher: ['/dashboard/:path*', '/profile/:path*', '/items/:path*'] };
