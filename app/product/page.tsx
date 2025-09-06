"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";

type Product = {
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

export default function ProductPage() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/product");
        const data = await res.json();
        console.log(data.res);
        if (data.success) {
          setProducts(data.res);
          setFiltered(data.res);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter products whenever query changes
  useEffect(() => {
    if (!query.trim()) {
      setFiltered(products);
    } else {
      setFiltered(
        products.filter(
          (p) =>
            p.title.toLowerCase().includes(query.toLowerCase()) ||
            p.description.toLowerCase().includes(query.toLowerCase()) ||
            p.category.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  }, [query, products]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Search bar */}
      <div className="mb-6 flex justify-center px-4">
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full sm:w-3/4 md:w-1/2 px-4 py-2 rounded-xl border border-neutral-700 bg-neutral-800 text-neutral-10 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      {/* Product grid */}
      {loading ? (
        <p className="text-neutral-400">Loading products...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.length > 0 ? (
            filtered.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                title={p.title}
                description={p.description}
                price={p.price}
                category={p.category || "other"}
                imageUrl={p.imageUrl}
              />
            ))
          ) : (
            <p className="text-neutral-400">No products found.</p>
          )}
        </div>
      )}
    </div>
  );
}
