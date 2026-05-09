import mongoose, { Schema, Document } from 'mongoose';

export interface IAlert extends Document {
  type: string;
  message: string;
  date: Date;
}

const AlertSchema = new Schema<IAlert>({
  type: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

export default mongoose.models.Alert || mongoose.model<IAlert>('Alert', AlertSchema);
