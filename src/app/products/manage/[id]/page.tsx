"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import ProductForm from "@/components/ProductForm";
import { getProductById, updateProduct } from "@/lib/products";
import { Product } from "@/types/product";
import { useParams } from "next/navigation";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
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
          successMessage="Product updated successfully."
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
          }}
        />
      </main>
    </ProtectedRoute>
  );
}
