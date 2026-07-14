import { apiFetch } from "./api";

export async function addToWishlist(productId: string) {
  const res = await apiFetch("/api/wishlist", {
    method: "POST",
    body: JSON.stringify({
      productId,
    }),
  });

  return res;
}

export async function getWishlist() {
  const res = await apiFetch("/api/wishlist");

  return res.json();
}

export async function removeFromWishlist(productId: string) {
  const res = await apiFetch(`/api/wishlist/${productId}`, {
    method: "DELETE",
  });

  return res;
}