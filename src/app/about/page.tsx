import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-16 md:px-6">
      <section className="relative min-h-[560px] overflow-hidden rounded-2xl border border-[#d6b36a]/25 bg-[#130e0a] p-8 md:p-10">
        <div className="absolute inset-0">
          <Image
            src="/hero.png"
            alt="Oud background"
            fill
            className="object-contain opacity-45 blur-[1px]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#130e0a]/65 via-[#130e0a]/55 to-[#130e0a]/70" />
        </div>

        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-[#f5e6c2]">Our Story</h1>
          <div className="mt-6 space-y-4 text-[#dccba6]">
          <p>
            Oud.co was founded with one goal: to make premium perfume oils and attars accessible to
            fragrance lovers who value authenticity, depth, and craftsmanship.
          </p>
          <p>
            We source from trusted artisans and heritage producers across the Arabian Peninsula and
            beyond, curating oils that carry tradition while fitting modern lifestyles.
          </p>
          <p>
            Every bottle is selected for quality, longevity, and character. Whether you prefer bold
            oud profiles or soft floral signatures, Oud.co helps you discover scents that feel
            personal and memorable.
          </p>
          </div>
        </div>
      </section>
    </main>
  );
}
