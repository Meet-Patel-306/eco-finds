import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createProduct } from "@/server-actions/products";
import { z } from "zod";

const ProductSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(1),
  price: z.number().nonnegative(),
  category: z.enum([
    "electronics",
    "fashion",
    "books",
    "home",
    "toys",
    "sports",
    "other",
  ]),
  imageUrl: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const vaildData = ProductSchema.parse(body);
    const res = await createProduct(vaildData);
    return NextResponse.json({ success: true, res });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: error.message || "Something went wrong" },
      { status: 400 }
    );
  }
}
