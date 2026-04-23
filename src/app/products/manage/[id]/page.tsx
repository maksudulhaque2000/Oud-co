"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import ProductForm from "@/components/ProductForm";
import { getProductById, updateProduct } from "@/lib/products";
import { Product } from "@/types/product";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { pushToast } = useToast();
  const product = getProductById(params.id) as Product | undefined;

  if (!product) {
    return (
      <ProtectedRoute>
        <main className="mx-auto w-full max-w-3xl px-4 py-12 md:px-6">
          <p className="rounded-lg border border-[#d6b36a]/25 bg-[#130e0a] p-6 text-[#dccba6]">Product not found.</p>
        </main>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <main className="mx-auto w-full max-w-3xl px-4 py-12 md:px-6">
        <ProductForm
          initialProduct={product}
          heading="Edit Product"
          description="Update product details and save your changes."
          submitLabel="Update Product"
          onSubmit={async (values) => {
            updateProduct({
              ...product,
              title: values.title,
              shortDescription: values.shortDescription,
              fullDescription: values.fullDescription,
              category: values.category,
              price: values.price,
              imageUrl: values.imageUrl,
            });
            pushToast({
              title: "Product Updated",
              message: "Your changes were saved successfully.",
              variant: "success",
            });
            router.push(`/products/${product.id}`);
          }}
        />
      </main>
    </ProtectedRoute>
  );
}
