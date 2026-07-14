import { Schema, model, models, Model } from "mongoose";

export interface ICart {
  user: Schema.Types.ObjectId;
  product: Schema.Types.ObjectId;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

const cartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate products in the same user's cart
cartSchema.index(
  {
    user: 1,
    product: 1,
  },
  {
    unique: true,
  }
);

const Cart: Model<ICart> =
  models.Cart || model<ICart>("Cart", cartSchema);

export default Cart;