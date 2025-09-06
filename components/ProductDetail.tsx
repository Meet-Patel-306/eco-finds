"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "./ui/badge";
import { toast } from "sonner";

interface ProductDetailsProps {
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

export default function ProductDetail({
  id,
  title,
  description,
  price,
  category,
  imageUrl,
}: ProductDetailsProps) {
  const handleAddToCart = async () => {
    await toast.promise(
      fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, quantity: 1 }),
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
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-1">
        <section className="grid md:grid-cols-2 gap-6 lg:gap-12 items-start max-w-6xl px-4 mx-auto py-6">
          <div className="grid gap-4">
            <img
              src={imageUrl}
              alt="Product Image"
              width={600}
              height={900}
              className="aspect-[2/3] object-cover border w-full rounded-lg overflow-hidden"
            />
          </div>
          <div className="grid gap-4 md:gap-10">
            <div className="grid gap-2">
              <h1 className="text-3xl font-bold">{title}</h1>
              <p className="text-muted-foreground">
                <Badge>{category}</Badge>
              </p>
            </div>
            <p>{description}</p>
            <div className="grid gap-2">
              <div className="text-2xl font-bold">{price} INR</div>
            </div>
            <form className="grid gap-4">
              <Button size="lg" onClick={handleAddToCart}>
                Add to cart
              </Button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
