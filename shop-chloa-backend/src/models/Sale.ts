import mongoose, { Schema, Document } from 'mongoose';

export interface ISaleItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  qty: number;
  price: number;
}

export interface ISale extends Document {
  customerId?: mongoose.Types.ObjectId;
  customerName?: string;
  items: ISaleItem[];
  total: number;
  paidAmount: number;
  udhaarAmount: number;
  paymentMethod: string;
  date: Date;
  attachments?: string[];
}

const SaleItemSchema = new Schema<ISaleItem>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product' },
  name: String,
  qty: Number,
  price: Number
});

const SaleSchema = new Schema<ISale>({
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer' },
  customerName: String,
  items: { type: [SaleItemSchema], default: [] },
  total: Number,
  paidAmount: { type: Number, default: 0 },
  udhaarAmount: { type: Number, default: 0 },
  paymentMethod: String,
  date: { type: Date, default: Date.now },
  attachments: { type: [String], default: [] }
});

export default mongoose.models.Sale || mongoose.model<ISale>('Sale', SaleSchema);
