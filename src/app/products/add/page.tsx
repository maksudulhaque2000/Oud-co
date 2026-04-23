"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import ProductForm from "@/components/ProductForm";
import { addCustomProduct } from "@/lib/products";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";

export default function AddProductPage() {
  const router = useRouter();
  const { pushToast } = useToast();

  return (
    <ProtectedRoute>
      <main className="mx-auto w-full max-w-3xl px-4 py-12 md:px-6">
        <ProductForm
          heading="Add Product"
          description="Create a new custom product entry."
          submitLabel="Save Product"
          onSubmit={async (values) => {
            addCustomProduct(values);
            pushToast({
              title: "Product Added",
              message: "New product has been published successfully.",
              variant: "success",
            });
            router.push("/products");
          }}
        />
      </main>
    </ProtectedRoute>
  );
}
