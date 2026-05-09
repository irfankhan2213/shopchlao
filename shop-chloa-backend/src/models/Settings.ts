import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  lowStockThreshold?: number;
  enableBatchTracking?: boolean;
  enableSupplierTracking?: boolean;
  notifyExpiry?: boolean;
}

const SettingsSchema = new Schema<ISettings>({
  lowStockThreshold: Number,
  enableBatchTracking: Boolean,
  enableSupplierTracking: Boolean,
  notifyExpiry: Boolean
});

export default mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);
