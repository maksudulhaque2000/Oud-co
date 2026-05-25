"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import ProductForm from "@/components/ProductForm";
import { useAuth } from "@/context/AuthContext";
import { useProducts } from "@/context/ProductsContext";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";

export default function AddProductPage() {
  const router = useRouter();
  const { pushToast } = useToast();
  const { addProduct } = useProducts();
  const { user } = useAuth();

  return (
    <ProtectedRoute requireAdmin>
      <main className="mx-auto w-full max-w-3xl px-4 py-12 md:px-6">
        <ProductForm
          heading="Add Product"
          description="Create a new product entry and save it to the live database."
          submitLabel="Save Product"
          onSubmit={async (values) => {
            try {
              await addProduct({
                ...values,
                publishedByAdminEmail: user?.email || undefined,
                publishedByAdminUid: user?.uid || undefined,
                publishedByAdminName: user?.displayName || undefined,
              });
              pushToast({
                title: "Product Added",
                message: "New product has been published to the database.",
                variant: "success",
              });
              router.push("/products");
            } catch (error) {
              pushToast({
                title: "Unable to Save Product",
                message: error instanceof Error ? error.message : "Please try again.",
                variant: "error",
              });
              throw error instanceof Error ? error : new Error("Unable to save product.");
            }
          }}
        />
      </main>
    </ProtectedRoute>
  );
}
