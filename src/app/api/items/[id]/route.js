import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Item from "@/models/Item";

// 🟢 GET single item
export async function GET(req, { params }) {
  try {
    const { id } = await params; // ✅ must await in Next.js 13+/15
    await connectDB();

    const item = await Item.findById(id).lean();
    if (!item) {
      return NextResponse.json(
        { success: false, msg: "Item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, item });
  } catch (err) {
    console.error("Error fetching item:", err);
    return NextResponse.json(
      { success: false, msg: "Server error" },
      { status: 500 }
    );
  }
}

// 🟢 UPDATE item
export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const { id } = await params; // ✅ use params (not context)

    const body = await req.json();

    const updatedItem = await Item.findByIdAndUpdate(
      id,
      {
        title: body.title,
        description: body.description,
      },
      { new: true }
    );

    if (!updatedItem)
      return NextResponse.json({ error: "Item not found" }, { status: 404 });

    return NextResponse.json({
      message: "Item updated successfully",
      item: updatedItem,
    });
  } catch (err) {
    console.error("Error updating item:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// 🔴 DELETE item
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = await params; // ✅ use params (not context)

    const deleted = await Item.findByIdAndDelete(id);
    if (!deleted)
      return NextResponse.json({ error: "Item not found" }, { status: 404 });

    return NextResponse.json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error("Error deleting item:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
