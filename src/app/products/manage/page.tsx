"use client";

import Link from "next/link";
import Image from "next/image";
import ProtectedRoute from "@/components/ProtectedRoute";
import ConfirmModal from "@/components/ConfirmModal";
import { useToast } from "@/context/ToastContext";
import { getAllProducts, removeCustomProduct } from "@/lib/products";
import { useState } from "react";

export default function ManageProductsPage() {
  const [, setRefreshKey] = useState(0);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { pushToast } = useToast();
  const products = getAllProducts();

  function openDeleteModal(id: string) {
    setPendingDeleteId(id);
  }

  async function handleDeleteConfirmed() {
    if (!pendingDeleteId) {
      return;
    }

    try {
      setDeleting(true);
      removeCustomProduct(pendingDeleteId);
      setRefreshKey((previous) => previous + 1);
      setPendingDeleteId(null);
      pushToast({
        title: "Product Deleted",
        message: "Selected product has been removed.",
        variant: "success",
      });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <ProtectedRoute>
      <main className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6">
        <h1 className="text-3xl font-bold text-[#f5e6c2]">Manage Products</h1>
        <p className="mt-2 text-sm text-[#dccba6]">View, edit, and remove products stored in local storage.</p>

        <section className="mt-6 hidden overflow-hidden rounded-xl border border-[#d6b36a]/20 md:block">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#1a120b] text-left text-sm text-[#f5e6c2]">
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t border-[#d6b36a]/20 text-sm text-[#dccba6]">
                  <td className="px-4 py-3">
                    <Image
                      src={product.imageUrl}
                      alt={product.title}
                      width={56}
                      height={56}
                      className="h-14 w-14 rounded object-cover"
                    />
                  </td>
                  <td className="px-4 py-3">{product.title}</td>
                  <td className="px-4 py-3">{product.category}</td>
                  <td className="px-4 py-3">Tk {product.price}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link
                        href={`/products/${product.id}`}
                        className="rounded-md border border-[#d6b36a]/40 px-3 py-1.5 text-xs text-[#f0dca7]"
                      >
                        View
                      </Link>
                      <Link
                        href={`/products/manage/${product.id}`}
                        className="rounded-md border border-[#d6b36a]/40 px-3 py-1.5 text-xs text-[#f0dca7]"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => openDeleteModal(product.id)}
                        disabled={!product.id.startsWith("custom-")}
                        className="rounded-md border border-rose-400/40 px-3 py-1.5 text-xs text-rose-300 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="mt-6 grid gap-4 md:hidden">
          {products.map((product) => (
            <article key={product.id} className="rounded-xl border border-[#d6b36a]/20 bg-[#130e0a] p-4">
              <div className="flex gap-3">
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded object-cover"
                />
                <div>
                  <h2 className="font-semibold text-[#f5e6c2]">{product.title}</h2>
                  <p className="text-sm text-[#dccba6]">{product.category}</p>
                  <p className="text-sm font-bold text-[#d6b36a]">Tk {product.price}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Link
                  href={`/products/${product.id}`}
                  className="rounded-md border border-[#d6b36a]/40 px-3 py-2 text-xs text-[#f0dca7]"
                >
                  View
                </Link>
                <Link
                  href={`/products/manage/${product.id}`}
                  className="rounded-md border border-[#d6b36a]/40 px-3 py-2 text-xs text-[#f0dca7]"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => openDeleteModal(product.id)}
                  disabled={!product.id.startsWith("custom-")}
                  className="rounded-md border border-rose-400/40 px-3 py-2 text-xs text-rose-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </section>

        <ConfirmModal
          isOpen={Boolean(pendingDeleteId)}
          title="Delete Product"
          message="Are you sure you want to delete this product? This action cannot be undone."
          confirmText="Yes, Delete"
          cancelText="No"
          loading={deleting}
          onCancel={() => setPendingDeleteId(null)}
          onConfirm={handleDeleteConfirmed}
        />
      </main>
    </ProtectedRoute>
  );
}
