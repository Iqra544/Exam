import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
}, { timestamps: true });

export default mongoose.models.Item || mongoose.model('Item', ItemSchema);
