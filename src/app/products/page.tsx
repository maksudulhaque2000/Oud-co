"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { categories, getAllProducts } from "@/lib/products";
import { ProductCategory } from "@/types/product";

type PriceFilter = "all" | "under500" | "500to1000" | "above1000";

export default function ProductsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | ProductCategory>("all");
  const [price, setPrice] = useState<PriceFilter>("all");

  const products = getAllProducts();

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const searchMatch = product.title.toLowerCase().includes(query.toLowerCase());
      const categoryMatch = category === "all" || product.category === category;
      const priceMatch =
        price === "all" ||
        (price === "under500" && product.price < 500) ||
        (price === "500to1000" && product.price >= 500 && product.price <= 1000) ||
        (price === "above1000" && product.price > 1000);

      return searchMatch && categoryMatch && priceMatch;
    });
  }, [category, price, products, query]);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-[#f5e6c2]">Our Collection</h1>
        <p className="mt-2 text-[#dccba6]">Discover premium attars and perfume oils curated for every mood.</p>
      </header>

      <section className="mb-8 grid gap-3 md:grid-cols-3">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by product name"
          className="w-full rounded-lg border border-[#d6b36a]/30 bg-[#130e0a] px-4 py-3 text-[#f8ecd0] outline-none ring-[#c9a84c] placeholder:text-[#a89267] focus:ring-2"
        />

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value as "all" | ProductCategory)}
          className="w-full rounded-lg border border-[#d6b36a]/30 bg-[#130e0a] px-4 py-3 text-[#f8ecd0] outline-none ring-[#c9a84c] focus:ring-2"
        >
          <option value="all">All Categories</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={price}
          onChange={(event) => setPrice(event.target.value as PriceFilter)}
          className="w-full rounded-lg border border-[#d6b36a]/30 bg-[#130e0a] px-4 py-3 text-[#f8ecd0] outline-none ring-[#c9a84c] focus:ring-2"
        >
          <option value="all">All Prices</option>
          <option value="under500">Under Tk 500</option>
          <option value="500to1000">Tk 500 - Tk 1000</option>
          <option value="above1000">Above Tk 1000</option>
        </select>
      </section>

      {filtered.length > 0 ? (
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      ) : (
        <p className="rounded-lg border border-[#d6b36a]/25 bg-[#130e0a] p-6 text-center text-[#dccba6]">
          No products found for your filters.
        </p>
      )}
    </main>
  );
}
