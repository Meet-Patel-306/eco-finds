"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardFooter,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "./ui/badge";
import Link from "next/link";
import { toast } from "sonner";

interface ProductCardProps {
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
}

const ProductCard = ({
  id,
  title,
  description,
  price,
  category,
  imageUrl,
}: ProductCardProps) => {
  const handleAddToCart = () => {
    toast.promise(
      fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id, quantity: 1 }),
      }).then(async (res) => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Failed to add to cart");
        }
        return res.json();
      }),
      {
        loading: "Adding product to cart...",
        success: (data) => data.message || "Product added to cart!",
        error: (err) => err.message || "Something went wrong",
      }
    );
  };

  return (
    <div className="relative max-w-md rounded-xl bg-gradient-to-r from-zinc-600 to-violet-300 pt-0 shadow-lg">
      <div className="flex h-60 items-center justify-center">
        <img src={imageUrl} alt="img" className="w-75" />
      </div>
      <Card className="border-none">
        <Link href={`/product/${id}`}>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>
              <Badge>{category}</Badge>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>{description.substring(0, 20)}...</p>
          </CardContent>
        </Link>
        <CardFooter className="justify-between gap-3 max-sm:flex-col max-sm:items-stretch">
          <Link href={`/product/${id}`}>
            <div className="flex flex-col">
              <span className="text-sm font-medium uppercase">Price</span>
              <span className="text-xl font-semibold">{price} INR</span>
            </div>
          </Link>
          <Button size="lg" onClick={handleAddToCart}>
            Add to cart
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProductCard;
