import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  author: { type: String, required: true, trim: true },
  text: { type: String, required: true, trim: true },
}, { timestamps: true });

export default mongoose.models.Comment || mongoose.model('Comment', CommentSchema);
