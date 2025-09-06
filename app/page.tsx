import { ProductAddForm } from "@/components/ProductAddForm";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  return (
    <>
      <ProductAddForm />
      <ProductCard
        id="1230"
        title="hello"
        description="leromandkjdas"
        category="toys"
        price={1000}
        imageUrl="https://ik.imagekit.io/mtptuser/Screenshot_2024-09-15_232455_O9e6hVhkF.png"
      />
    </>
  );
}
