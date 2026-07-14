import { apiFetch } from "./api";

export async function addToCart(productId: string) {
  return apiFetch("/api/cart", {
    method: "POST",
    body: JSON.stringify({ productId }),
  });
}

export async function getCart() {
  const res = await apiFetch("/api/cart");

  if (!res.ok) {
    throw new Error("Failed to fetch cart");
  }

  return res.json();
}

export async function updateCart(
  cartId: string,
  quantity: number
) {
  return apiFetch(`/api/cart/${cartId}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });
}

export async function removeCart(cartId: string) {
  return apiFetch(`/api/cart/${cartId}`, {
    method: "DELETE",
  });
}

export async function clearCart() {
  return apiFetch("/api/cart", {
    method: "DELETE",
  });
}