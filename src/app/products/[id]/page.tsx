"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { ProductDetailSkeleton } from "@/components/LoadingSkeletons";
import { useCart } from "@/context/CartContext";
import { normalizeImageSource } from "@/lib/products";
import { useProducts } from "@/context/ProductsContext";
import { useToast } from "@/context/ToastContext";

export default function ProductDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { addToCart } = useCart();
  const { pushToast } = useToast();
  const { products, loading, error } = useProducts();
  const product = products.find((item) => item.id === params.id);

  if (loading && !product) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-16 md:px-6">
        <p className="rounded-lg border border-[#d6b36a]/25 bg-[#130e0a] p-6 text-[#dccba6]">{error ?? "Product not found."}</p>
      </main>
    );
  }

  const related = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 3);
  const imageSrc = normalizeImageSource(product.imageUrl);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6">
      <Link href="/products" className="mb-6 inline-block text-sm font-semibold text-[#d6b36a] hover:text-[#f5e6c2]">
        Back to Products
      </Link>

      <section className="grid gap-8 rounded-2xl border border-[#d6b36a]/20 bg-[#130e0a] p-6 md:grid-cols-2 md:p-8">
        <div className="overflow-hidden rounded-xl">
          <img src={imageSrc} alt={product.title} className="h-full w-full object-cover" />
        </div>

        <div>
          <span className="rounded-full bg-[#2f2114] px-3 py-1 text-xs font-semibold text-[#eecf8b]">{product.category}</span>
          <h1 className="mt-4 text-3xl font-bold text-[#f5e6c2]">{product.title}</h1>
          <p className="mt-2 text-2xl font-bold text-[#d6b36a]">Tk {product.price}</p>
          <p className="mt-4 text-[#dccba6]">{product.shortDescription}</p>
          <p className="mt-4 text-[#cdb890]">{product.fullDescription}</p>

          <div className="mt-6 grid gap-3 rounded-lg bg-[#1b140f] p-4 text-sm text-[#ead9b4]">
            <p>Volume: {product.volume}</p>
            <p>Notes: {product.notes}</p>
            <p>Origin: {product.origin}</p>
            <p>Longevity: {product.longevity}</p>
            {product.publishedByAdminName || product.publishedByAdminEmail ? (
              <p>
                Published by: {product.publishedByAdminName || product.publishedByAdminEmail}
              </p>
            ) : null}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                addToCart(product, 1);
                pushToast({
                  title: "Added to cart",
                  message: `${product.title} is ready in your cart.`,
                  variant: "success",
                });
              }}
              className="rounded-md border border-[#d6b36a]/40 px-4 py-3 font-semibold text-[#f0dca7] transition hover:border-[#d6b36a]"
            >
              Add to Cart
            </button>
            <button
              type="button"
              onClick={() => {
                addToCart(product, 1);
                pushToast({
                  title: "Proceeding to checkout",
                  message: "Your item has been moved to checkout.",
                  variant: "success",
                });
                router.push("/checkout");
              }}
              className="rounded-md bg-[#c9a84c] px-4 py-3 font-semibold text-[#1f1300] transition hover:bg-[#d8b760]"
            >
              Buy Now
            </button>
          </div>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="mt-10">
          <h2 className="mb-5 text-2xl font-bold text-[#f5e6c2]">Related Products</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
