"use client";

import { Product, ProductCategory } from "@/types/product";
import {
  isValidImageSource,
  normalizeImageSource,
  getProductFormDefaults,
  categories,
} from "@/lib/products";
import { FormEvent, useState } from "react";

type ProductFormValues = {
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: ProductCategory;
  price: number;
  imageUrl: string;
};

type Props = {
  initialProduct?: Product | null;
  heading: string;
  description: string;
  submitLabel: string;
  onSubmit: (values: ProductFormValues) => Promise<void> | void;
};

export default function ProductForm({
  initialProduct,
  heading,
  description,
  submitLabel,
  onSubmit,
}: Props) {
  const defaults = getProductFormDefaults(initialProduct);

  const [title, setTitle] = useState(defaults.title);
  const [shortDescription, setShortDescription] = useState(defaults.shortDescription);
  const [fullDescription, setFullDescription] = useState(defaults.fullDescription);
  const [category, setCategory] = useState<ProductCategory>(defaults.category);
  const [price, setPrice] = useState(defaults.price);
  const [imageUrl, setImageUrl] = useState(defaults.imageUrl);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(isValidImageSource(defaults.imageUrl) ? defaults.imageUrl : "");

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
    if (imageUrl.trim() && !isValidImageSource(imageUrl)) {
      nextErrors.imageUrl = "Image must be a valid URL or uploaded image file.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        title: title.trim(),
        shortDescription: shortDescription.trim(),
        fullDescription: fullDescription.trim(),
        category,
        price: Number(price),
        imageUrl: normalizeImageSource(imageUrl),
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-[#d6b36a]/25 bg-[#130e0a] p-6 md:p-8">
      <h1 className="text-3xl font-bold text-[#f5e6c2]">{heading}</h1>
      <p className="mt-2 text-sm text-[#dccba6]">{description}</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-1 block text-sm font-medium text-[#f0dca7]">Title</label>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Royal Oud Al-Maliki"
            className="w-full rounded-lg border border-[#d6b36a]/30 bg-[#1c140f] px-4 py-3 text-[#f8ecd0] outline-none ring-[#c9a84c] placeholder:text-[#a89267] focus:ring-2"
          />
          {errors.title ? <p className="mt-1 text-xs text-rose-300">{errors.title}</p> : null}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-[#f0dca7]">Short Description</label>
          <input
            value={shortDescription}
            onChange={(event) => setShortDescription(event.target.value)}
            placeholder="A rich and deep oud fragrance with a regal signature."
            className="w-full rounded-lg border border-[#d6b36a]/30 bg-[#1c140f] px-4 py-3 text-[#f8ecd0] outline-none ring-[#c9a84c] placeholder:text-[#a89267] focus:ring-2"
          />
          {errors.shortDescription ? <p className="mt-1 text-xs text-rose-300">{errors.shortDescription}</p> : null}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-[#f0dca7]">Full Description</label>
          <textarea
            value={fullDescription}
            onChange={(event) => setFullDescription(event.target.value)}
            placeholder="Add the full product story, ingredients, scent profile, and usage notes."
            rows={5}
            className="w-full rounded-lg border border-[#d6b36a]/30 bg-[#1c140f] px-4 py-3 text-[#f8ecd0] outline-none ring-[#c9a84c] placeholder:text-[#a89267] focus:ring-2"
          />
          {errors.fullDescription ? <p className="mt-1 text-xs text-rose-300">{errors.fullDescription}</p> : null}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-[#f0dca7]">Category</label>
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
            {errors.category ? <p className="mt-1 text-xs text-rose-300">{errors.category}</p> : null}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[#f0dca7]">Price (Tk)</label>
            <input
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              type="number"
              min="1"
              placeholder="1850"
              className="w-full rounded-lg border border-[#d6b36a]/30 bg-[#1c140f] px-4 py-3 text-[#f8ecd0] outline-none ring-[#c9a84c] placeholder:text-[#a89267] focus:ring-2"
            />
            {errors.price ? <p className="mt-1 text-xs text-rose-300">{errors.price}</p> : null}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-[#f0dca7]">Image URL</label>
          <input
            value={imageUrl}
            onChange={(event) => {
              const nextUrl = event.target.value;
              setImageUrl(nextUrl);
              setPreview(isValidImageSource(nextUrl) ? nextUrl : "");
            }}
            placeholder="https://images.unsplash.com/..."
            className="w-full rounded-lg border border-[#d6b36a]/30 bg-[#1c140f] px-4 py-3 text-[#f8ecd0] outline-none ring-[#c9a84c] placeholder:text-[#a89267] focus:ring-2"
          />
          <p className="mt-1 text-xs text-[#bca475]">Optional. Leave blank to use the default product image.</p>
        </div>
        {errors.imageUrl ? <p className="text-xs text-rose-300">{errors.imageUrl}</p> : null}

        {preview ? (
          <div className="overflow-hidden rounded-lg border border-[#d6b36a]/20 bg-[#1c140f]">
            <p className="border-b border-[#d6b36a]/20 px-4 py-2 text-xs text-[#cdb890]">
              Image preview
            </p>
            <img src={preview} alt="Preview" className="h-48 w-full object-cover" />
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-[#c9a84c] px-5 py-3 font-semibold text-[#1f1300] transition hover:bg-[#d8b760] disabled:opacity-60"
        >
          {loading ? "Saving..." : submitLabel}
        </button>
      </form>
    </section>
  );
}
