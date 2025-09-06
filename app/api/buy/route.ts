import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db"; // your Drizzle/Prisma db instance
import { eq } from "drizzle-orm";
import { carts, purchases } from "@/db/schema"; // import your tables
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Get all cart items for user
    const userCart = await db
      .select()
      .from(carts)
      .where(eq(carts.userId, userId));

    if (userCart.length === 0) {
      return NextResponse.json({ success: false, message: "Cart is empty" });
    }

    // 2. Move items to purchases table
    const purchaseData = userCart.map((item) => ({
      userId,
      productId: item.productId,
      quantity: item.quantity,
      purchasedAt: new Date(),
    }));

    await db.insert(purchases).values(purchaseData);

    // 3. Delete items from cart
    await db.delete(carts).where(eq(carts.userId, userId));

    return NextResponse.json({
      success: true,
      message: "Purchase completed successfully",
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
