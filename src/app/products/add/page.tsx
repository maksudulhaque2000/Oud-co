"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { addCustomProduct, categories } from "@/lib/products";
import { ProductCategory } from "@/types/product";
import { FormEvent, useState } from "react";

const defaultCategory = categories[0];

export default function AddProductPage() {
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [category, setCategory] = useState<ProductCategory>(defaultCategory);
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  function validate() {
    const nextErrors: Record<string, string> = {};

    if (!title.trim()) {
      nextErrors.title = "Title is required.";
    }
    if (!shortDescription.trim()) {
      nextErrors.shortDescription = "Short description is required.";
    }
    if (!fullDescription.trim()) {
      nextErrors.fullDescription = "Full description is required.";
    }
    if (!category) {
      nextErrors.category = "Category is required.";
    }
    if (!price || Number(price) <= 0) {
      nextErrors.price = "Price must be greater than 0.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccess("");

    if (!validate()) {
      return;
    }

    try {
      setLoading(true);
      addCustomProduct({
        title,
        shortDescription,
        fullDescription,
        category,
        price: Number(price),
        imageUrl,
      });
      setSuccess("Product added successfully.");
      setTitle("");
      setShortDescription("");
      setFullDescription("");
      setCategory(defaultCategory);
      setPrice("");
      setImageUrl("");
      setErrors({});
    } finally {
      setLoading(false);
    }
  }

  return (
    <ProtectedRoute>
      <main className="mx-auto w-full max-w-3xl px-4 py-12 md:px-6">
        <section className="rounded-2xl border border-[#d6b36a]/25 bg-[#130e0a] p-6 md:p-8">
          <h1 className="text-3xl font-bold text-[#f5e6c2]">Add Product</h1>
          <p className="mt-2 text-sm text-[#dccba6]">Create a new custom product entry.</p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Title"
                className="w-full rounded-lg border border-[#d6b36a]/30 bg-[#1c140f] px-4 py-3 text-[#f8ecd0] outline-none ring-[#c9a84c] placeholder:text-[#a89267] focus:ring-2"
              />
              {errors.title ? <p className="mt-1 text-xs text-rose-300">{errors.title}</p> : null}
            </div>

            <div>
              <input
                value={shortDescription}
                onChange={(event) => setShortDescription(event.target.value)}
                placeholder="Short Description"
                className="w-full rounded-lg border border-[#d6b36a]/30 bg-[#1c140f] px-4 py-3 text-[#f8ecd0] outline-none ring-[#c9a84c] placeholder:text-[#a89267] focus:ring-2"
              />
              {errors.shortDescription ? <p className="mt-1 text-xs text-rose-300">{errors.shortDescription}</p> : null}
            </div>

            <div>
              <textarea
                value={fullDescription}
                onChange={(event) => setFullDescription(event.target.value)}
                placeholder="Full Description"
                rows={5}
                className="w-full rounded-lg border border-[#d6b36a]/30 bg-[#1c140f] px-4 py-3 text-[#f8ecd0] outline-none ring-[#c9a84c] placeholder:text-[#a89267] focus:ring-2"
              />
              {errors.fullDescription ? <p className="mt-1 text-xs text-rose-300">{errors.fullDescription}</p> : null}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value as ProductCategory)}
                  className="w-full rounded-lg border border-[#d6b36a]/30 bg-[#1c140f] px-4 py-3 text-[#f8ecd0] outline-none ring-[#c9a84c] focus:ring-2"
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <input
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  type="number"
                  min="1"
                  placeholder="Price (Tk)"
                  className="w-full rounded-lg border border-[#d6b36a]/30 bg-[#1c140f] px-4 py-3 text-[#f8ecd0] outline-none ring-[#c9a84c] placeholder:text-[#a89267] focus:ring-2"
                />
                {errors.price ? <p className="mt-1 text-xs text-rose-300">{errors.price}</p> : null}
              </div>
            </div>

            <input
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              placeholder="Image URL (optional)"
              className="w-full rounded-lg border border-[#d6b36a]/30 bg-[#1c140f] px-4 py-3 text-[#f8ecd0] outline-none ring-[#c9a84c] placeholder:text-[#a89267] focus:ring-2"
            />

            {success ? <p className="text-sm text-emerald-300">{success}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-[#c9a84c] px-5 py-3 font-semibold text-[#1f1300] transition hover:bg-[#d8b760] disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Product"}
            </button>
          </form>
        </section>
      </main>
    </ProtectedRoute>
  );
}
