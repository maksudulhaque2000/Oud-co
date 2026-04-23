"use client";

import { Product, ProductCategory } from "@/types/product";
import {
  isValidImageSource,
  normalizeImageSource,
  createProductImagePreview,
  getProductFormDefaults,
  categories,
} from "@/lib/products";
import { ChangeEvent, FormEvent, useState } from "react";

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
  const [fileName, setFileName] = useState("");

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
    if (!imageUrl.trim()) {
      nextErrors.imageUrl = "Please upload an image or provide an image URL.";
    } else if (!isValidImageSource(imageUrl)) {
      nextErrors.imageUrl = "Image must be a valid URL or uploaded image file.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const dataUrl = await createProductImagePreview(file);
      setImageUrl(dataUrl);
      setPreview(dataUrl);
      setFileName(file.name);
      setErrors((current) => {
        const next = { ...current };
        delete next.imageUrl;
        return next;
      });
    } catch {
      setErrors((current) => ({ ...current, imageUrl: "Unable to read the selected image file." }));
    }
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
            {errors.category ? <p className="mt-1 text-xs text-rose-300">{errors.category}</p> : null}
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

        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          <input
            value={imageUrl}
            onChange={(event) => {
              const nextUrl = event.target.value;
              setImageUrl(nextUrl);
              setPreview(isValidImageSource(nextUrl) ? nextUrl : "");
              setFileName("");
            }}
            placeholder="Image URL"
            className="w-full rounded-lg border border-[#d6b36a]/30 bg-[#1c140f] px-4 py-3 text-[#f8ecd0] outline-none ring-[#c9a84c] placeholder:text-[#a89267] focus:ring-2"
          />
          <label className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-[#d6b36a]/40 px-4 py-3 text-sm font-semibold text-[#f0dca7] transition hover:border-[#d6b36a]">
            Upload Image
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>
        </div>
        {errors.imageUrl ? <p className="text-xs text-rose-300">{errors.imageUrl}</p> : null}

        {preview ? (
          <div className="overflow-hidden rounded-lg border border-[#d6b36a]/20 bg-[#1c140f]">
            <p className="border-b border-[#d6b36a]/20 px-4 py-2 text-xs text-[#cdb890]">
              {fileName ? `Uploaded: ${fileName}` : "Image preview"}
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
