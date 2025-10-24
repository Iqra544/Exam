import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
   image: {
    type: String, // stores file path like "/uploads/filename.jpg"
    default: "/uploads/default.png", // placeholder
  },
});

export default mongoose.models.User || mongoose.model("User", userSchema);
