import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#d6b36a]/20 bg-[#17100b] shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="h-56 overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.title}
          width={1200}
          height={900}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex h-full flex-col p-4">
        <span className="mb-2 inline-flex w-fit rounded-full bg-[#2f2114] px-2.5 py-1 text-xs font-semibold text-[#eecf8b]">
          {product.category}
        </span>
        <h3 className="text-lg font-semibold text-[#f8ecd0]">{product.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-[#d8c59b]">{product.shortDescription}</p>
        <div className="mt-auto flex items-center justify-between pt-4">
          <p className="text-xl font-bold text-[#d6b36a]">Tk {product.price}</p>
          <Link
            href={`/products/${product.id}`}
            className="rounded-md bg-[#c9a84c] px-3 py-2 text-sm font-semibold text-[#1f1300] transition hover:bg-[#d8b760]"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
