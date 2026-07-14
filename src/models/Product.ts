import { Model, Schema, model, models } from "mongoose";

export interface IProduct {
  title: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  seller: Schema.Types.ObjectId;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    title: {
      type: String,
      required: [true, "Product title is required."],
      trim: true,
      minlength: 3,
    },
    description: {
      type: String,
      required: [true, "Description is required."],
      trim: true,
      minlength: 10,
    },
    price: {
      type: Number,
      required: [true, "Price is required."],
      min: [0, "Price cannot be negative."],
    },
    category: {
      type: String,
      required: [true, "Category is required."],
      enum: ["Electronics", "Fashion", "Home & Living", "Sports", "Books", "Beauty"],
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 1,
    },
    images: {
      type: [String],
      default: [],
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

const Product: Model<IProduct> =
  models.Product || model<IProduct>("Product", productSchema);

export default Product;