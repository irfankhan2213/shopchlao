import mongoose, { Schema, Document } from 'mongoose';

import { Types } from 'mongoose';

export interface IBrand extends Document {
  name: string;
  description?: string;
  userId: Types.ObjectId;
}

const BrandSchema = new Schema<IBrand>({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

export default mongoose.models.Brand || mongoose.model<IBrand>('Brand', BrandSchema);
