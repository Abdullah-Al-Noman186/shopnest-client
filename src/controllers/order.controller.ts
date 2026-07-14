import { Response } from "express";
import { z } from "zod";
import Order from "../models/Order";
import Product from "../models/Product";
import type { AuthRequest } from "../types";

const createOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().min(1),
    })
  ),
  shippingAddress: z.object({
    fullName: z.string().min(1),
    address: z.string().min(1),
    city: z.string().min(1),
    postalCode: z.string().min(1),
    country: z.string().min(1),
  }),
});

// POST /api/orders — buyer places order
export async function createOrder(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const result = createOrderSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ message: result.error.issues[0].message });
      return;
    }

    const { items, shippingAddress } = result.data;

    // Fetch all products
    const productIds = items.map((i) => i.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== items.length) {
      res.status(400).json({ message: "One or more products not found." });
      return;
    }

    // Group by seller (one order per seller)
    const sellerMap = new Map<
  string,
  {
    items: IOrderItemInput[];
    total: number;
  }
>();

    for (const item of items) {
      const product = products.find(
        (p) => p._id.toString() === item.productId
      );
      if (!product) continue;

      if (product.stock < item.quantity) {
        res.status(400).json({
          message: `Not enough stock for "${product.title}".`,
        });
        return;
      }

      const sellerId = product.seller.toString();
      if (!sellerMap.has(sellerId)) {
        sellerMap.set(sellerId, { items: [], total: 0 });
      }

      const entry = sellerMap.get(sellerId)!;
      entry.items.push({
        product: product._id,
        title: product.title,
        image: product.images?.[0] ?? "",
        price: product.price,
        quantity: item.quantity,
      });
      entry.total += product.price * item.quantity;
    }

    // Create one order per seller and decrement stock
    const orders = [];
    for (const [sellerId, { items: orderItems, total }] of sellerMap) {
      const order = await Order.create({
        buyer: req.user?.userId,
        seller: sellerId,
        items: orderItems,
        totalAmount: total,
        shippingAddress,
      });
      orders.push(order);

      // Decrement stock
      for (const item of orderItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity },
        });
      }
    }

    res.status(201).json({ message: "Order placed successfully.", orders });
  } catch {
    res.status(500).json({ message: "Failed to place order." });
  }
}

// GET /api/orders/my-orders — buyer sees their orders
export async function getMyOrders(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const orders = await Order.find({ buyer: req.user?.userId })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ orders });
  } catch {
    res.status(500).json({ message: "Failed to fetch orders." });
  }
}

// GET /api/orders/seller-orders — seller sees orders for their products
export async function getSellerOrders(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const orders = await Order.find({ seller: req.user?.userId })
      .populate("buyer", "name email")
      .sort({ createdAt: -1 })
      .lean();

    res.json({ orders });
  } catch {
    res.status(500).json({ message: "Failed to fetch seller orders." });
  }
}

// GET /api/orders/seller-stats — seller sales statistics
export async function getSellerStats(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const orders = await Order.find({ seller: req.user?.userId }).lean();

    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalOrders = orders.length;
    const delivered = orders.filter((o) => o.status === "delivered").length;
    const pending = orders.filter((o) => o.status === "pending").length;

    // Revenue by month (last 6 months)
    const now = new Date();
    const monthlyRevenue = Array.from({ length: 6 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const label = date.toLocaleString("default", {
        month: "short",
        year: "2-digit",
      });
      const revenue = orders
        .filter((o) => {
          const d = new Date(o.createdAt);
          return (
            d.getMonth() === date.getMonth() &&
            d.getFullYear() === date.getFullYear()
          );
        })
        .reduce((sum, o) => sum + o.totalAmount, 0);
      return { month: label, revenue };
    });

    // Top products
    const productSales = new Map<string, { title: string; sold: number; revenue: number }>();
    for (const order of orders) {
      for (const item of order.items) {
        const key = item.product.toString();
        if (!productSales.has(key)) {
          productSales.set(key, { title: item.title, sold: 0, revenue: 0 });
        }
        const entry = productSales.get(key)!;
        entry.sold += item.quantity;
        entry.revenue += item.price * item.quantity;
      }
    }

    const topProducts = [...productSales.values()]
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    res.json({
      totalRevenue,
      totalOrders,
      delivered,
      pending,
      monthlyRevenue,
      topProducts,
    });
  } catch {
    res.status(500).json({ message: "Failed to fetch stats." });
  }
}

// PATCH /api/orders/:id/status — seller updates order status
export async function updateOrderStatus(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const { status } = req.body;
    const validStatuses = [
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!validStatuses.includes(status)) {
      res.status(400).json({ message: "Invalid status." });
      return;
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404).json({ message: "Order not found." });
      return;
    }

    const isSeller = order.seller.toString() === req.user?.userId;
    const isAdmin = req.user?.role === "admin";

    if (!isSeller && !isAdmin) {
      res.status(403).json({ message: "Not authorized." });
      return;
    }

    order.status = status;
    await order.save();

    res.json({ message: "Order status updated.", order });
  } catch {
    res.status(500).json({ message: "Failed to update status." });
  }
}

// GET /api/orders/admin-stats — admin analytics
export async function getAdminStats(
  _req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const [orders, products, users] = await Promise.all([
      Order.find().lean(),
      Product.find().lean(),
      (await import("../models/User")).default.find().lean(),
    ]);

    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const totalUsers = users.length;
    const totalSellers = users.filter((u) => u.role === "seller").length;
    const totalBuyers = users.filter((u) => u.role === "buyer").length;

    // Monthly revenue last 6 months
    const now = new Date();
    const monthlyRevenue = Array.from({ length: 6 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const label = date.toLocaleString("default", {
        month: "short",
        year: "2-digit",
      });
      const revenue = orders
        .filter((o) => {
          const d = new Date(o.createdAt);
          return (
            d.getMonth() === date.getMonth() &&
            d.getFullYear() === date.getFullYear()
          );
        })
        .reduce((sum, o) => sum + o.totalAmount, 0);
      return { month: label, revenue };
    });

    // Orders by status
    const ordersByStatus = [
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled",
    ].map((status) => ({
      status,
      count: orders.filter((o) => o.status === status).length,
    }));

    // Users by role
    const usersByRole = [
      { role: "buyer", count: totalBuyers },
      { role: "seller", count: totalSellers },
      { role: "admin", count: users.filter((u) => u.role === "admin").length },
    ];

    res.json({
      totalRevenue,
      totalOrders,
      totalProducts,
      totalUsers,
      totalSellers,
      totalBuyers,
      monthlyRevenue,
      ordersByStatus,
      usersByRole,
    });
  } catch {
    res.status(500).json({ message: "Failed to fetch admin stats." });
  }
}

// GET /api/orders — admin sees all orders
export async function getAllOrders(
  _req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const orders = await Order.find()
      .populate("buyer", "name email")
      .populate("seller", "name email")
      .sort({ createdAt: -1 })
      .lean();

    res.json({ orders });
  } catch {
    res.status(500).json({ message: "Failed to fetch all orders." });
  }
}

// needed for type inside createOrder
interface IOrderItemInput {
  product: unknown;
  title: string;
  image: string;
  price: number;
  quantity: number;
}