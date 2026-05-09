import { Schema, model, Document } from "mongoose";

import { Types } from "mongoose";

export interface IUser extends Document {
  email: string;
  shopName: string;
  first_name: string;
  last_name: string;
  password: string;
  phone: string;
  otp: string;
  expiresAt: Date;
  city?: string;
  address?: string;
  state?: string;
  brands?: Types.ObjectId[];
  categories?: Types.ObjectId[];
  products?: Types.ObjectId[];
  profileCompleted: boolean;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    shopName: { type: String, required: false },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    password: { type: String, required: true },
    otp: { type: String, required: false },
    expiresAt: { type: Date, required: false },
    phone: { type: String, required: false },
    address: { type: String, required: false },
    city: { type: String, required: false },
    state: { type: String, required: false },
    brands: [{ type: Schema.Types.ObjectId, ref: "Brand" }],
    categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    profileCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default model<IUser>("User", userSchema);
