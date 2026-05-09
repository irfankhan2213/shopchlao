import mongoose, { Schema, Document } from 'mongoose';

export interface IStockLot extends Document {
  mrp: number;
  purchasePrice: number;
  sellPrice: number;
  quantity: number;
  batchNumber?: string;
  expiryDate?: Date;
  product: mongoose.Types.ObjectId; // Reference to Product
}

const StockLotSchema = new Schema<IStockLot>({
  mrp: { type: Number, required: true },
  purchasePrice: { type: Number, required: true },
  sellPrice: { type: Number, required: true },
  quantity: { type: Number, required: true },
  batchNumber: String,
  expiryDate: Date,
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true }
}, { timestamps: true });

export default mongoose.models.StockLot || mongoose.model<IStockLot>('StockLot', StockLotSchema);
