import mongoose, { Schema, Document } from 'mongoose';

import { Types } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  description?: string;
  userId: Types.ObjectId;
}

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
