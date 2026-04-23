import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import { staticProducts } from "@/lib/products";
import { Gem, Globe2, Sparkles, Truck } from "lucide-react";

export default function Home() {
  const featured = staticProducts.slice(0, 6);

  const testimonials = [
    {
      name: "Afsana Rahman",
      rating: "★★★★★",
      quote: "Exceptional quality. The oud projection lasts all day and feels truly premium.",
    },
    {
      name: "Imran Hossain",
      rating: "★★★★★",
      quote: "Elegant packaging and authentic oils. I keep coming back for every new release.",
    },
    {
      name: "Nabila Karim",
      rating: "★★★★☆",
      quote: "Loved the floral line. Smooth, long-lasting, and perfect for daily wear.",
    },
  ];

  return (
    <div>
      <section className="relative overflow-hidden border-b border-[#d6b36a]/20">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-20 md:grid-cols-2 md:px-6 md:py-28">
          <div>
            <p className="mb-3 text-sm uppercase tracking-[0.25em] text-[#d6b36a]">Luxury Attar Collection</p>
            <h1 className="text-5xl leading-tight text-[#f7ecd1] md:text-6xl">
              The Soul of the Orient, Bottled for You
            </h1>
            <p className="mt-5 max-w-lg text-[#ddc9a1]">
              Oud.co brings heritage perfume oils and modern curation together, delivering pure,
              long-lasting attars crafted for bold identity.
            </p>
            <Link
              href="/products"
              className="mt-8 inline-flex rounded-md bg-[#c9a84c] px-6 py-3 text-sm font-semibold text-[#1f1300] transition hover:bg-[#d8b760]"
            >
              Explore Products
            </Link>
          </div>

          <div className="relative">
            <div className="absolute -left-6 top-8 h-32 w-32 rounded-full bg-[#c9a84c]/20 blur-2xl" />
            <Image
              src="https://images.unsplash.com/photo-1619994403073-2cecbe7dd117?auto=format&fit=crop&w=1200&q=80"
              alt="Luxury attar bottles"
              width={1200}
              height={800}
              className="h-[440px] w-full rounded-2xl object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14 md:px-6">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-3xl text-[#f5e6c2]">Bestsellers</h2>
          <Link href="/products" className="text-sm font-semibold text-[#d6b36a] hover:text-[#f5e6c2]">
            View all products
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="border-y border-[#d6b36a]/20 bg-[#120d08]">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 md:px-6">
          <h2 className="mb-6 text-3xl text-[#f5e6c2]">Why Oud.co?</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <Sparkles size={20} />,
                title: "100% Pure & Natural Oils",
                description: "Authentic ingredients with uncompromised quality.",
              },
              {
                icon: <Globe2 size={20} />,
                title: "Sourced from Arabian Peninsula",
                description: "Handpicked blends from trusted regional producers.",
              },
              {
                icon: <Gem size={20} />,
                title: "Long-lasting Fragrance",
                description: "Designed to project beautifully and linger for hours.",
              },
              {
                icon: <Truck size={20} />,
                title: "Free Delivery Above Tk 2000",
                description: "Fast and reliable nationwide doorstep delivery.",
              },
            ].map((item) => (
              <article key={item.title} className="rounded-xl border border-[#d6b36a]/20 bg-[#1a120b] p-5">
                <div className="mb-3 w-fit rounded-md bg-[#2f2114] p-2 text-[#eecf8b]">{item.icon}</div>
                <h3 className="text-lg font-semibold text-[#f8ecd0]">{item.title}</h3>
                <p className="mt-2 text-sm text-[#d8c59b]">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14 md:px-6">
        <h2 className="mb-6 text-3xl text-[#f5e6c2]">What Our Customers Say</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((item) => (
            <article key={item.name} className="rounded-xl border border-[#d6b36a]/20 bg-[#1a120b] p-5">
              <p className="text-sm text-[#e8cb88]">{item.rating}</p>
              <p className="mt-3 text-[#dccba6]">&ldquo;{item.quote}&rdquo;</p>
              <p className="mt-4 text-sm font-semibold text-[#f8ecd0]">{item.name}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mb-14 w-full max-w-6xl px-4 md:px-6">
        <div className="rounded-2xl border border-[#d6b36a]/30 bg-gradient-to-r from-[#2b1d12] to-[#181008] p-8 text-center md:p-12">
          <p className="text-sm uppercase tracking-[0.2em] text-[#d6b36a]">Limited Launch</p>
          <h2 className="mt-2 text-4xl text-[#f5e6c2]">Explore Our New Arrivals</h2>
          <Link
            href="/products"
            className="mt-6 inline-flex rounded-md bg-[#c9a84c] px-6 py-3 text-sm font-semibold text-[#1f1300] transition hover:bg-[#d8b760]"
          >
            Shop Collection
          </Link>
        </div>
      </section>
    </div>
  );
}
