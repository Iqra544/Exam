import { cookies } from "next/headers";

export async function POST() {
  // ✅ Await cookies() before using it
  const cookieStore = await cookies();
  cookieStore.delete("token");

  return Response.json({ msg: "Logged out" }, { status: 200 });
}
