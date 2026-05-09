import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IStockLot {
  mrp: number;
  purchasePrice: number;
  sellPrice: number;
  quantity: number;
  batchNumber?: string;
  expiryDate?: Date;
}


  export interface IProduct extends Document {
    name: string;
    description?: string;
    brand: Types.ObjectId; // Reference to Brand
    category: Types.ObjectId; // Reference to Category
    lots: Types.ObjectId[]; // Reference to StockLot documents
    userId: Types.ObjectId;
  }



const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: String,
  brand: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  lots: [{ type: Schema.Types.ObjectId, ref: 'StockLot' }],
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
