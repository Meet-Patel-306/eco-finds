import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db"; // your Drizzle DB instance
import { purchases, products } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    // Join purchases with products table to get product info
    const userPurchases = await db
      .select({
        id: purchases.id,
        purchasedAt: purchases.purchasedAt,
        productId: products.id,
        title: products.title,
        description: products.description,
        price: products.price,
        category: products.category,
        imageUrl: products.imageUrl,
      })
      .from(purchases)
      .leftJoin(products, eq(products.id, purchases.productId))
      .where(eq(purchases.userId, userId));

    return NextResponse.json({ success: true, purchases: userPurchases });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
