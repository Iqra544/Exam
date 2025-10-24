import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Item from "@/models/Item";
import Comment from "@/models/Comment";

export async function GET(req, context) {
  try {
    const { id } = await context.params; // ✅ must await
    await connectDB();

    const comments = await Comment.find({ item: id }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, comments });
  } catch (err) {
    console.error("Error loading comments:", err);
    return NextResponse.json(
      { success: false, msg: "Server error while loading comments" },
      { status: 500 }
    );
  }
}

export async function POST(req, context) {
  try {
    const { id } = await context.params; // ✅ await here too
    const body = await req.json();
    const { author, text } = body;

    if (!author || !text) {
      return NextResponse.json(
        { success: false, msg: "Author and comment text are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const item = await Item.findById(id);
    if (!item) {
      return NextResponse.json(
        { success: false, msg: "Item not found" },
        { status: 404 }
      );
    }

    const comment = new Comment({
      author,
      text,
      item: item._id,
    });
    await comment.save();

    return NextResponse.json({
      success: true,
      msg: "Comment added successfully",
      comment,
    });
  } catch (err) {
    console.error("Error adding comment:", err);
    return NextResponse.json(
      { success: false, msg: "Server error while adding comment" },
      { status: 500 }
    );
  }
}
