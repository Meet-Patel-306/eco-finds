"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import CartCard from "@/components/CartCard";
import { toast } from "sonner";

type CartItem = {
  cartId: string;
  quantity: number;
  addedAt: string;
  product: {
    id: string;
    title: string;
    description: string;
    price: number;
    category:
      | "electronics"
      | "fashion"
      | "books"
      | "home"
      | "toys"
      | "sports"
      | "other";
    imageUrl: string;
  };
};

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch cart items from API
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch("/api/cart");
        const data = await res.json();
        console.log(data);
        if (data.success && Array.isArray(data.res)) {
          setCart(data.res);
        } else {
          setCart([]); // ✅ fallback to empty array
        }
      } catch (err) {
        console.error("Failed to fetch cart:", err);
        setCart([]); // ✅ prevent undefined
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const handleBuyNow = () => {
    toast.promise(
      fetch("/api/buy", {
        method: "POST",
      }).then(async (res) => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || "Purchase failed");
        }
        return res.json();
      }),
      {
        loading: "Processing your purchase...",
        success: (data) => data.message || "Purchase successful!",
        error: (err) => err.message || "Something went wrong",
      }
    );
  };

  // 🔹 Calculate total cart value
  const totalValue = useMemo(() => {
    return (cart ?? []).reduce(
      (acc, item) => acc + (item?.product?.price || 0) * (item?.quantity || 1),
      0
    );
  }, [cart]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {loading ? (
        <p className="text-neutral-400">Loading cart...</p>
      ) : cart.length > 0 ? (
        <>
          {/* Cart Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {cart.map((item) => (
              <CartCard
                key={item.cartId}
                id={item.product.id}
                title={item.product.title}
                description={item.product.description}
                price={item.product.price}
                category={item.product.category}
                imageUrl={item.product.imageUrl}
              />
            ))}
          </div>

          {/* Cart Summary */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-700 pt-6">
            <h2 className="text-xl font-semibold">
              Total: <span className="text-blue-400">₹{totalValue}</span>
            </h2>
            <Button
              size="lg"
              onClick={handleBuyNow}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
            >
              Buy Now
            </Button>
          </div>
        </>
      ) : (
        <p className="text-neutral-400">Your cart is empty.</p>
      )}
    </div>
  );
}
