import { Suspense } from "react";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import CategoryProducts from "@/components/CategoryProducts";
import Navbar from "@/components/Navbar";
import {
  formatChangePercent,
  formatTaka,
  getBangladeshDateLabel,
  getBazaarCategories,
  getBazaarProducts,
  getUnitLabel,
} from "@/lib/bazardor";
import type { ProductCardData } from "@/components/ProductCard";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export default function CategoryPage({ params }: CategoryPageProps) {
  return (
    <Suspense fallback={<CategoryLoading />}>
      <CategoryPageContent params={params} />
    </Suspense>
  );
}

async function CategoryPageContent({ params }: CategoryPageProps) {
  await connection();

  const [{ slug }, categories, products] = await Promise.all([
    params,
    getBazaarCategories(),
    getBazaarProducts(),
  ]);

  const category = categories.find((item) => item.slug === slug);
  if (!category) {
    notFound();
  }

  const categoryProducts: ProductCardData[] = products
    .filter((product) => product.category === slug)
    .map((product) => ({
      slug: product.slug,
      title: product.nameBn,
      icon: product.image,
      price: `${formatTaka(product.today)} টাকা`,
      priceValue: product.today,
      unit: getUnitLabel(product.unit),
      changeDirection: product.change.dir,
      change:
        product.change.dir === "flat"
          ? "— ০.০%"
          : `${product.change.dir === "up" ? "▲" : "▼"} ${formatChangePercent(
              Math.abs(product.change.pct),
            )}%`,
      subtitle: product.categoryNameBn,
    }));

  const navItems = categories.map(({ slug: categorySlug, nameBn, icon }) => ({
    slug: categorySlug,
    label: nameBn,
    icon,
  }));
  const dateLabel = getBangladeshDateLabel();

  return (
    <div className="min-h-screen bg-[#edf3ee] text-[#202825]">
      <Navbar
        activeCategory={slug}
        navItems={navItems}
        dateLabel={dateLabel}
      />

      <main className="mx-auto w-full max-w-7xl px-3 pb-8 pt-5 sm:px-6">
        <section className="flex min-h-28 items-center gap-4 rounded-2xl border border-[#dfe7e0] bg-[#f8faf8] px-4 py-4">
          <span
            aria-hidden="true"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#eff4ef] text-2xl sm:h-14 sm:w-14 sm:text-3xl"
          >
            {category.icon}
          </span>
          <div>
            <h1 className="text-xl font-black leading-tight sm:text-2xl">
              {category.nameBn}
            </h1>
            <p className="mt-1 text-sm text-[#77817d]">
              {category.nameBn} পণ্যের আজকের বাজারদর ও দামের পরিবর্তন
            </p>
          </div>
        </section>

        <CategoryProducts products={categoryProducts} />
      </main>
    </div>
  );
}

function CategoryLoading() {
  return (
    <main className="min-h-screen bg-[#edf3ee] px-3 py-5 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="h-28 animate-pulse rounded-2xl border border-[#dfe7e0] bg-[#f8faf8]" />
        <div className="mt-5 h-14 animate-pulse rounded-xl border border-[#dfe7e0] bg-[#f8faf8]" />
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-2xl border border-[#dfe7e0] bg-[#f8faf8]"
            />
          ))}
        </div>
      </div>
    </main>
  );
}