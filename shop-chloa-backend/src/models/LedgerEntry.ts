import mongoose, { Schema, Document } from 'mongoose';

export interface ILedgerEntry extends Document {
  customerId: mongoose.Types.ObjectId;
  type: 'SALE' | 'PAYMENT';
  amount: number;
  balanceAfter: number;
  referenceId?: mongoose.Types.ObjectId; // points to Sale or Payment
  notes?: string;
  date: Date;
  attachments?: string[];
}

const LedgerEntrySchema = new Schema<ILedgerEntry>({
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  type: { type: String, enum: ['SALE', 'PAYMENT'], required: true },
  amount: { type: Number, required: true },
  balanceAfter: { type: Number, required: true },
  referenceId: { type: Schema.Types.ObjectId },
  notes: String,
  date: { type: Date, default: Date.now },
  attachments: { type: [String], default: [] }
});

export default mongoose.models.LedgerEntry || mongoose.model<ILedgerEntry>('LedgerEntry', LedgerEntrySchema);
