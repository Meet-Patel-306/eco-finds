import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getProduct } from "@/server-actions/products";
import ProductDetail from "@/components/ProductDetail";

interface ProductPageProps {
  params: { id: string };
}

export default async function ProductDetails({ params }: ProductPageProps) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }
  const { id } = await params;
  const data = await getProduct({ id });
  return (
    <ProductDetail
      id={data.data?.product.id as string}
      title={data.data?.product.title as string}
      description={data.data?.product.description as string}
      price={data.data?.product.price as number}
      category={data.data?.product.category || "other"}
      imageUrl={data.data?.product.imageUrl as string}
    />
  );
}
