import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { allProduct } from "@/server-actions/products";

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const res = (await allProduct()).data?.product;
    return NextResponse.json({ success: true, res });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: error.message || "Something went wrong" },
      { status: 400 }
    );
  }
}
