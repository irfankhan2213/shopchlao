import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  customerId: mongoose.Types.ObjectId;
  amount: number;
  paymentMethod: string;
  notes?: string;
  date: Date;
  attachments?: string[];
}

const PaymentSchema = new Schema<IPayment>({
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  notes: String,
  date: { type: Date, default: Date.now },
  attachments: { type: [String], default: [] }
});

export default mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);
