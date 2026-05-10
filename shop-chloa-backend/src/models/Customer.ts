import mongoose, { Schema, Document } from 'mongoose';

export interface IAttachment {
  _id?: string;
  url: string;
  date: Date;
  description?: string;
}

export interface ICustomer extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  attachments?: IAttachment[];
  totalSpent: number;
  totalPaid: number;
  totalUdhaar: number;
  lastPurchaseDate?: Date;
}

const AttachmentSchema = new Schema<IAttachment>({
  url: { type: String, required: true },
  date: { type: Date, default: Date.now },
  description: String
});

const CustomerSchema = new Schema<ICustomer>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  email: String,
  phone: String,
  address: String,
  attachments: { type: [AttachmentSchema], default: [] },
  totalSpent: { type: Number, default: 0 },
  totalPaid: { type: Number, default: 0 },
  totalUdhaar: { type: Number, default: 0 },
  lastPurchaseDate: { type: Date }
});

export default mongoose.models.Customer || mongoose.model<ICustomer>('Customer', CustomerSchema);
