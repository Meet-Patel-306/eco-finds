"use client";

import { useState } from "react";
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
  return (
    <div className="relative max-w-md rounded-xl bg-gradient-to-r from-zinc-600 to-violet-300 pt-0 shadow-lg">
      <div className="flex h-60 items-center justify-center">
        <img src={imageUrl} alt="img" className="w-75" />
      </div>
      <Card className="border-none">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            <Badge>{category}</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>{description}</p>
        </CardContent>
        <CardFooter className="justify-between gap-3 max-sm:flex-col max-sm:items-stretch">
          <div className="flex flex-col">
            <span className="text-sm font-medium uppercase">Price</span>
            <span className="text-xl font-semibold">{price} INR</span>
          </div>
          <Button size="lg">Add to cart</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProductCard;
