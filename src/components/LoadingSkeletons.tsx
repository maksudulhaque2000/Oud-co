function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`animate-pulse rounded-2xl bg-gradient-to-r from-[#1b130c] via-[#2b1f17] to-[#1b130c] ${className}`} />;
}

function PageSectionShell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-[#d6b36a]/20 bg-[#130e0a] ${className}`}>{children}</section>;
}

export function PageLoadingSkeleton({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6">
      <PageSectionShell className="overflow-hidden p-0">
        <div className="grid gap-0 md:grid-cols-2">
          <div className="space-y-4 px-6 py-20 md:px-8 md:py-28">
            <SkeletonBlock className="h-4 w-44 rounded-full" />
            <SkeletonBlock className="h-14 w-11/12 rounded-2xl md:h-16" />
            <SkeletonBlock className="h-4 w-full rounded-full" />
            <SkeletonBlock className="h-4 w-5/6 rounded-full" />
            <SkeletonBlock className="mt-6 h-11 w-40 rounded-xl" />
          </div>
          <div className="relative px-6 py-10 md:px-8 md:py-12">
            <SkeletonBlock className="h-[320px] w-full rounded-3xl md:h-[420px]" />
          </div>
        </div>
      </PageSectionShell>

      <section className="mt-14">
        <div className="mb-6 flex items-end justify-between">
          <div className="space-y-3">
            <SkeletonBlock className="h-8 w-44 rounded-full" />
            <SkeletonBlock className="h-4 w-56 rounded-full" />
          </div>
          <SkeletonBlock className="h-4 w-28 rounded-full" />
        </div>
        <ProductGridSkeleton count={3} />
      </section>

      <section className="mt-14 grid gap-4 border-y border-[#d6b36a]/20 bg-[#120d08] py-14 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <article key={index} className="rounded-xl border border-[#d6b36a]/20 bg-[#1a120b] p-5">
            <SkeletonBlock className="h-10 w-10 rounded-xl" />
            <SkeletonBlock className="mt-4 h-5 w-40 rounded-full" />
            <SkeletonBlock className="mt-3 h-4 w-full rounded-full" />
            <SkeletonBlock className="mt-2 h-4 w-5/6 rounded-full" />
          </article>
        ))}
      </section>

      <section className="mt-14 grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <article key={index} className="rounded-xl border border-[#d6b36a]/20 bg-[#1a120b] p-5">
            <SkeletonBlock className="h-4 w-20 rounded-full" />
            <SkeletonBlock className="mt-3 h-4 w-full rounded-full" />
            <SkeletonBlock className="mt-4 h-4 w-4/5 rounded-full" />
          </article>
        ))}
      </section>

      <section className="mt-14 mb-14 rounded-2xl border border-[#d6b36a]/30 bg-linear-to-r from-[#2b1d12] to-[#181008] p-8 text-center md:p-12">
        <SkeletonBlock className="mx-auto h-4 w-36 rounded-full" />
        <SkeletonBlock className="mx-auto mt-3 h-10 w-96 max-w-full rounded-2xl" />
        <SkeletonBlock className="mx-auto mt-6 h-11 w-40 rounded-xl" />
      </section>
    </main>
  );
}

export function AuthGateSkeleton() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4 py-16">
      <section className="w-full max-w-md rounded-3xl border border-[#d6b36a]/20 bg-[#130e0a] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.28)] md:p-8">
        <div className="flex items-center gap-4">
          <SkeletonBlock className="h-12 w-12 rounded-2xl" />
          <div className="space-y-2 flex-1">
            <SkeletonBlock className="h-5 w-40 rounded-full" />
            <SkeletonBlock className="h-4 w-56 rounded-full" />
          </div>
        </div>
        <div className="mt-6 space-y-3">
          <SkeletonBlock className="h-12 w-full rounded-xl" />
          <SkeletonBlock className="h-12 w-full rounded-xl" />
          <SkeletonBlock className="h-12 w-full rounded-xl" />
        </div>
      </section>
    </div>
  );
}

export function FormSkeleton() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 md:px-6">
      <section className="rounded-2xl border border-[#d6b36a]/20 bg-[#130e0a] p-6 md:p-8">
        <div className="flex items-center gap-3">
          <SkeletonBlock className="h-12 w-12 rounded-2xl" />
          <div className="space-y-2">
            <SkeletonBlock className="h-6 w-44 rounded-full" />
            <SkeletonBlock className="h-4 w-72 rounded-full" />
          </div>
        </div>
        <div className="mt-8 space-y-4">
          <SkeletonBlock className="h-12 w-full rounded-xl" />
          <SkeletonBlock className="h-12 w-full rounded-xl" />
          <SkeletonBlock className="h-12 w-full rounded-xl" />
          <SkeletonBlock className="h-32 w-full rounded-2xl" />
          <div className="flex justify-end">
            <SkeletonBlock className="h-12 w-40 rounded-xl" />
          </div>
        </div>
      </section>
    </main>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <article key={index} className="overflow-hidden rounded-2xl border border-[#d6b36a]/20 bg-[#130e0a]">
          <SkeletonBlock className="aspect-[4/3] w-full rounded-none" />
          <div className="space-y-3 p-5">
            <SkeletonBlock className="h-5 w-24 rounded-full" />
            <SkeletonBlock className="h-6 w-3/4 rounded-full" />
            <SkeletonBlock className="h-4 w-full rounded-full" />
            <SkeletonBlock className="h-4 w-5/6 rounded-full" />
            <div className="flex items-center justify-between pt-2">
              <SkeletonBlock className="h-4 w-20 rounded-full" />
              <SkeletonBlock className="h-10 w-28 rounded-xl" />
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}

export function SkeletonCatalogPage({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6">
      <header className="mb-8 space-y-3">
        <SkeletonBlock className="h-10 w-64 rounded-full" />
        <SkeletonBlock className="h-4 w-96 max-w-full rounded-full" />
      </header>

      <section className="mb-8 grid gap-3 md:grid-cols-3">
        <SkeletonBlock className="h-12 w-full rounded-xl" />
        <SkeletonBlock className="h-12 w-full rounded-xl" />
        <SkeletonBlock className="h-12 w-full rounded-xl" />
      </section>

      {children}
    </main>
  );
}

export function ProductDetailSkeleton() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6">
      <SkeletonBlock className="mb-6 h-4 w-32 rounded-full" />
      <section className="grid gap-8 rounded-3xl border border-[#d6b36a]/20 bg-[#130e0a] p-6 md:grid-cols-2 md:p-8">
        <SkeletonBlock className="aspect-square w-full rounded-2xl md:aspect-[4/5]" />
        <div className="space-y-4">
          <SkeletonBlock className="h-6 w-28 rounded-full" />
          <SkeletonBlock className="h-10 w-5/6 rounded-xl" />
          <SkeletonBlock className="h-8 w-40 rounded-full" />
          <SkeletonBlock className="h-4 w-full rounded-full" />
          <SkeletonBlock className="h-4 w-11/12 rounded-full" />
          <SkeletonBlock className="h-4 w-4/5 rounded-full" />
          <div className="rounded-2xl border border-[#d6b36a]/15 bg-[#1a120b] p-4">
            <SkeletonBlock className="h-4 w-24 rounded-full" />
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <SkeletonBlock key={index} className="h-10 w-full rounded-xl" />
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <SkeletonBlock className="h-12 w-36 rounded-xl" />
            <SkeletonBlock className="h-12 w-36 rounded-xl" />
          </div>
        </div>
      </section>
    </main>
  );
}

export function TableSkeleton({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <section className="mt-6 overflow-hidden rounded-xl border border-[#d6b36a]/20 bg-[#130e0a]">
      <div className="border-b border-[#d6b36a]/15 bg-[#1a120b] px-4 py-3">
        <SkeletonBlock className="h-5 w-48 rounded-full" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#d6b36a]/15 bg-[#1a120b] text-left">
              {Array.from({ length: columns }).map((_, index) => (
                <th key={index} className="px-4 py-3">
                  <SkeletonBlock className={index === 0 ? "h-4 w-24 rounded-full" : index === columns - 1 ? "h-4 w-20 rounded-full" : "h-4 w-28 rounded-full"} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex} className="border-t border-[#d6b36a]/15">
                {Array.from({ length: columns }).map((_, columnIndex) => (
                  <td key={columnIndex} className="px-4 py-5 align-top">
                    <SkeletonBlock
                      className={
                        columnIndex === 0
                          ? "h-4 w-28 rounded-full"
                          : columnIndex === columns - 1
                            ? "h-10 w-28 rounded-xl"
                            : columnIndex === 1
                              ? "h-4 w-40 rounded-full"
                              : "h-4 w-24 rounded-full"
                      }
                    />
                    {columnIndex === 0 ? <SkeletonBlock className="mt-2 h-3 w-20 rounded-full" /> : null}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function PaymentValidationSkeleton() {
  return (
    <section className="w-full rounded-3xl border border-[#d6b36a]/20 bg-[#130e0a] p-8 text-center shadow-[0_24px_70px_rgba(0,0,0,0.32)]">
      <SkeletonBlock className="mx-auto h-4 w-40 rounded-full" />
      <SkeletonBlock className="mx-auto mt-4 h-8 w-72 rounded-xl" />
      <SkeletonBlock className="mx-auto mt-4 h-4 w-full max-w-md rounded-full" />
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <SkeletonBlock className="h-12 w-36 rounded-full" />
        <SkeletonBlock className="h-12 w-40 rounded-full" />
      </div>
    </section>
  );
}

export function AdminShellSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6">
      <div className="space-y-3">
        <SkeletonBlock className="h-8 w-56 rounded-full" />
        <SkeletonBlock className="h-4 w-80 rounded-full" />
      </div>

      <section className="mt-6 rounded-2xl border border-[#d6b36a]/20 bg-[#130e0a] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-2">
            <SkeletonBlock className="h-4 w-32 rounded-full" />
            <SkeletonBlock className="h-4 w-64 rounded-full" />
          </div>
          <div className="flex flex-wrap gap-2">
            <SkeletonBlock className="h-10 w-24 rounded-xl" />
            <SkeletonBlock className="h-10 w-32 rounded-xl" />
            <SkeletonBlock className="h-10 w-28 rounded-xl" />
          </div>
        </div>
      </section>

      <TableSkeleton rows={5} columns={columns} />
    </main>
  );
}

export function AdminOrdersSkeleton() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6">
      <div className="space-y-3">
        <SkeletonBlock className="h-8 w-56 rounded-full" />
        <SkeletonBlock className="h-4 w-80 rounded-full" />
      </div>

      <section className="mt-6 rounded-2xl border border-[#d6b36a]/20 bg-[#130e0a] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-2">
            <SkeletonBlock className="h-4 w-32 rounded-full" />
            <SkeletonBlock className="h-4 w-64 rounded-full" />
          </div>
          <div className="flex flex-wrap gap-2">
            <SkeletonBlock className="h-10 w-24 rounded-xl" />
            <SkeletonBlock className="h-10 w-32 rounded-xl" />
            <SkeletonBlock className="h-10 w-28 rounded-xl" />
          </div>
        </div>
      </section>

      <section className="mt-6 overflow-hidden rounded-xl border border-[#d6b36a]/20 bg-[#130e0a]">
        <div className="grid grid-cols-5 gap-0 border-b border-[#d6b36a]/15 bg-[#1a120b] px-4 py-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonBlock key={index} className={index === 0 ? "h-4 w-20 rounded-full" : "h-4 w-28 rounded-full"} />
          ))}
        </div>
        <div className="space-y-0">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="grid grid-cols-5 gap-0 border-t border-[#d6b36a]/15 px-4 py-4">
              <div className="space-y-2">
                <SkeletonBlock className="h-4 w-28 rounded-full" />
                <SkeletonBlock className="h-3 w-20 rounded-full" />
              </div>
              <div className="space-y-2">
                <SkeletonBlock className="h-4 w-32 rounded-full" />
                <SkeletonBlock className="h-3 w-24 rounded-full" />
                <SkeletonBlock className="h-3 w-20 rounded-full" />
              </div>
              <div className="space-y-2">
                <SkeletonBlock className="h-4 w-24 rounded-full" />
                <SkeletonBlock className="h-5 w-20 rounded-full" />
              </div>
              <div className="space-y-2">
                <SkeletonBlock className="h-5 w-24 rounded-full" />
              </div>
              <div className="grid gap-2 min-w-[260px]">
                <SkeletonBlock className="h-10 w-full rounded-xl" />
                <SkeletonBlock className="h-10 w-full rounded-xl" />
                <div className="flex items-center gap-2">
                  <SkeletonBlock className="h-10 w-20 rounded-xl" />
                  <SkeletonBlock className="h-10 w-20 rounded-xl" />
                  <SkeletonBlock className="h-10 w-16 rounded-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export function AdminUsersSkeleton() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6">
      <div className="space-y-3">
        <SkeletonBlock className="h-8 w-52 rounded-full" />
        <SkeletonBlock className="h-4 w-80 rounded-full" />
      </div>

      <section className="mt-6 overflow-hidden rounded-xl border border-[#d6b36a]/20 bg-[#130e0a]">
        <div className="grid grid-cols-4 gap-0 border-b border-[#d6b36a]/15 bg-[#1a120b] px-4 py-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonBlock key={index} className={index === 0 ? "h-4 w-24 rounded-full" : "h-4 w-28 rounded-full"} />
          ))}
        </div>
        <div>
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="grid grid-cols-4 gap-0 border-t border-[#d6b36a]/15 px-4 py-4">
              <SkeletonBlock className="h-4 w-36 rounded-full" />
              <SkeletonBlock className="h-4 w-44 rounded-full" />
              <SkeletonBlock className="h-10 w-28 rounded-xl" />
              <SkeletonBlock className="h-4 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export function ProductFormSkeleton({ headingWidth = "w-44" }: { headingWidth?: string }) {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 md:px-6">
      <section className="rounded-2xl border border-[#d6b36a]/25 bg-[#130e0a] p-6 md:p-8">
        <SkeletonBlock className={`h-8 ${headingWidth} rounded-full`} />
        <SkeletonBlock className="mt-3 h-4 w-80 max-w-full rounded-full" />
        <div className="mt-6 space-y-4">
          <SkeletonBlock className="h-12 w-full rounded-xl" />
          <SkeletonBlock className="h-12 w-full rounded-xl" />
          <SkeletonBlock className="h-32 w-full rounded-2xl" />
          <div className="grid gap-4 md:grid-cols-2">
            <SkeletonBlock className="h-12 w-full rounded-xl" />
            <SkeletonBlock className="h-12 w-full rounded-xl" />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <SkeletonBlock className="h-12 w-full rounded-xl" />
            <SkeletonBlock className="h-12 w-full rounded-xl" />
            <SkeletonBlock className="h-12 w-full rounded-xl" />
          </div>
          <SkeletonBlock className="h-12 w-full rounded-xl" />
          <SkeletonBlock className="h-12 w-full rounded-xl" />
          <SkeletonBlock className="h-48 w-full rounded-2xl" />
          <div className="flex justify-end">
            <SkeletonBlock className="h-12 w-40 rounded-xl" />
          </div>
        </div>
      </section>
    </main>
  );
}
