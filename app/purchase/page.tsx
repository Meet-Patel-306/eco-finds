"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import CartCard from "@/components/CartCard";
import { toast } from "sonner";

type PurchaseItem = {
  id: string; // purchase id
  productId: string;
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
  quantity: number;
  purchasedAt: string;
};

export default function PurchasePage() {
  const [purchases, setPurchases] = useState<PurchaseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await fetch("/api/purchase");
        const data = await res.json();
        if (data.success && Array.isArray(data.purchases)) {
          setPurchases(data.purchases);
        } else {
          setPurchases([]);
        }
      } catch (err) {
        console.error(err);
        setPurchases([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPurchases();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {loading ? (
        <p className="text-neutral-400">Loading purchases...</p>
      ) : purchases.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {purchases.map((item) => (
              <CartCard
                key={item.id}
                id={item.productId}
                title={item.title}
                description={item.description}
                price={item.price}
                category={item.category}
                imageUrl={item.imageUrl}
              />
            ))}
          </div>
        </>
      ) : (
        <p className="text-neutral-400">No purchases found.</p>
      )}
    </div>
  );
}
