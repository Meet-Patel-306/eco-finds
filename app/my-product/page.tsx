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

export default function MyProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/my-products");
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              title={p.title}
              description={p.description}
              price={p.price}
              category={p.category}
              imageUrl={p.imageUrl}
            />
          ))}
        </div>
      )}
    </div>
  );
}
