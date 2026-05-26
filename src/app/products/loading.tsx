import { ProductGridSkeleton, SkeletonCatalogPage } from "@/components/LoadingSkeletons";

export default function Loading() {
  return (
    <SkeletonCatalogPage>
      <ProductGridSkeleton count={6} />
    </SkeletonCatalogPage>
  );
}
