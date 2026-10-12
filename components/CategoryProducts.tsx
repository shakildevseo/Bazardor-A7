"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ProductCard, {
  type ProductCardData,
} from "@/components/ProductCard";

type CategoryProductsProps = {
  products: ProductCardData[];
};

type SortOrder = "default" | "price-low" | "price-high";

const numberFormatter = new Intl.NumberFormat("bn-BD");

export default function CategoryProducts({
  products,
}: CategoryProductsProps) {
  const [sortBy, setSortBy] = useState<SortOrder>("default");

  const sortedProducts = useMemo(() => {
    const sorted = [...products];

    if (sortBy === "price-low") {
      return sorted.sort(
        (a, b) => (a.priceValue ?? 0) - (b.priceValue ?? 0),
      );
    }

    if (sortBy === "price-high") {
      return sorted.sort(
        (a, b) => (b.priceValue ?? 0) - (a.priceValue ?? 0),
      );
    }

    return sorted;
  }, [products, sortBy]);

  return (
    <section aria-label="বিভাগের পণ্য" className="mt-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#dfe7df] bg-[#f8faf8] px-4 py-3">
        <p className="text-sm text-[#65716c]">
          মোট{" "}
          <span className="font-bold text-[#29332f]">
            {numberFormatter.format(products.length)}
          </span>{" "}
          টি পণ্য পাওয়া যাচ্ছে
        </p>

        <label className="flex items-center gap-2 text-sm text-[#68736e]">
          <span>সাজান:</span>
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as SortOrder)}
            className="min-h-10 rounded-lg border border-[#dce4dd] bg-[#fbfcfb] px-3 py-2 text-sm text-[#303a35] outline-none focus:border-[#168d5b] focus:ring-2 focus:ring-[#168d5b]/15"
            aria-label="পণ্যের দাম অনুযায়ী সাজান"
          >
            <option value="default">ডিফল্ট</option>
            <option value="price-low">দাম: কম থেকে বেশি</option>
            <option value="price-high">দাম: বেশি থেকে কম</option>
          </select>
        </label>
      </div>

      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sortedProducts.map((product) => (
            <ProductCard key={product.slug} item={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-[#dfe7df] bg-[#f8faf8] px-5 py-10 text-center">
          <h2 className="text-lg font-bold text-[#29332f]">
            এই বিভাগে কোনো পণ্য পাওয়া যায়নি
          </h2>
          <p className="mt-2 text-sm text-[#65716c]">
            অন্য বিভাগ বেছে নিন অথবা হোম পেজে ফিরে যান।
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex rounded-xl bg-[#078c4b] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#067b42]"
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>
      )}
    </section>
  );
}