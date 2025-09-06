import { ProductAddForm } from "@/components/ProductAddForm";
import ProductCard from "@/components/ProductCard";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }
  if (userId) {
    redirect("/product");
  }
  return <></>;
}
