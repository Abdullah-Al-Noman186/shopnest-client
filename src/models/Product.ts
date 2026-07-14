<<<<<<< HEAD
import { Schema, model, models, Model, Types } from "mongoose";
=======
import { Model, Schema, model, models } from "mongoose";
>>>>>>> 072d33795fd39776427cb4e3eccc83eca78e8ad4

export interface IProduct {
  title: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
<<<<<<< HEAD
  seller: Types.ObjectId;
=======
  seller: Schema.Types.ObjectId;
>>>>>>> 072d33795fd39776427cb4e3eccc83eca78e8ad4
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
<<<<<<< HEAD
      min: 0,
=======
      min: [0, "Price cannot be negative."],
>>>>>>> 072d33795fd39776427cb4e3eccc83eca78e8ad4
    },
    category: {
      type: String,
      required: [true, "Category is required."],
<<<<<<< HEAD
      enum: [
        "Electronics",
        "Fashion",
        "Home & Living",
        "Sports",
        "Books",
        "Beauty",
      ],
    },
    stock: {
      type: Number,
      default: 1,
      min: 0,
=======
      enum: ["Electronics", "Fashion", "Home & Living", "Sports", "Books", "Beauty"],
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 1,
>>>>>>> 072d33795fd39776427cb4e3eccc83eca78e8ad4
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
<<<<<<< HEAD
  {
    timestamps: true,
  }
=======
  { timestamps: true }
>>>>>>> 072d33795fd39776427cb4e3eccc83eca78e8ad4
);

const Product: Model<IProduct> =
  models.Product || model<IProduct>("Product", productSchema);

export default Product;