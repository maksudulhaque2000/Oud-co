"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import ProductForm from "@/components/ProductForm";
import { addCustomProduct } from "@/lib/products";

export default function AddProductPage() {
  return (
    <ProtectedRoute>
      <main className="mx-auto w-full max-w-3xl px-4 py-12 md:px-6">
        <ProductForm
          heading="Add Product"
          description="Create a new custom product entry."
          submitLabel="Save Product"
          successMessage="Product added successfully."
          onSubmit={async (values) => {
            addCustomProduct(values);
          }}
        />
      </main>
    </ProtectedRoute>
  );
}
