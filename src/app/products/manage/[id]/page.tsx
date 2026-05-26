"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { ProductFormSkeleton } from "@/components/LoadingSkeletons";
import ProductForm from "@/components/ProductForm";
import { useProducts } from "@/context/ProductsContext";
import { Product } from "@/types/product";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { pushToast } = useToast();
  const { getProductById, saveProduct, loading } = useProducts();
  const product = getProductById(params.id) as Product | undefined;

  if (loading && !product) {
    return <ProtectedRoute requireAdmin><ProductFormSkeleton headingWidth="w-40" /></ProtectedRoute>;
  }

  if (!product) {
    return (
      <ProtectedRoute requireAdmin>
        <main className="mx-auto w-full max-w-3xl px-4 py-12 md:px-6">
          <p className="rounded-lg border border-[#d6b36a]/25 bg-[#130e0a] p-6 text-[#dccba6]">Product not found.</p>
        </main>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAdmin>
      <main className="mx-auto w-full max-w-3xl px-4 py-12 md:px-6">
        <ProductForm
          initialProduct={product}
          heading="Edit Product"
          description="Update product details and save your changes."
          submitLabel="Update Product"
          onSubmit={async (values) => {
            try {
              await saveProduct({
                ...product,
                title: values.title,
                shortDescription: values.shortDescription,
                fullDescription: values.fullDescription,
                category: values.category,
                price: values.price,
                imageUrl: values.imageUrl,
                vatPercent: values.vatPercent,
                discountPercent: values.discountPercent,
                shippingCharge: values.shippingCharge,
              });
              pushToast({
                title: "Product Updated",
                message: "Your changes were saved successfully.",
                variant: "success",
              });
              router.push(`/products/${product.id}`);
            } catch (error) {
              pushToast({
                title: "Unable to Update Product",
                message: error instanceof Error ? error.message : "Please try again.",
                variant: "error",
              });
              throw error instanceof Error ? error : new Error("Unable to update product.");
            }
          }}
        />
      </main>
    </ProtectedRoute>
  );
}
