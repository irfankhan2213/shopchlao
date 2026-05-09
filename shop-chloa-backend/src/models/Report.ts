import mongoose, { Schema, Document } from 'mongoose';

export interface IReport extends Document {
  type: string;
  data: any;
  date: Date;
}

const ReportSchema = new Schema<IReport>({
  type: { type: String, required: true },
  data: Schema.Types.Mixed,
  date: { type: Date, default: Date.now }
});

export default mongoose.models.Report || mongoose.model<IReport>('Report', ReportSchema);
