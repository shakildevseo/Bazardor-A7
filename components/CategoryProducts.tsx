"use client";

import { useState } from "react";
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

  const sortedProducts = [...products];

  if (sortBy === "price-low") {
    sortedProducts.sort(
      (a, b) => (a.priceValue ?? 0) - (b.priceValue ?? 0),
    );
  } else if (sortBy === "price-high") {
    sortedProducts.sort(
      (a, b) => (b.priceValue ?? 0) - (a.priceValue ?? 0),
    );
  }

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
          <span className="relative">
            <select
              value={sortBy}
              onChange={(event) => {
                const value = event.target.value;
                if (
                  value === "default" ||
                  value === "price-low" ||
                  value === "price-high"
                ) {
                  setSortBy(value);
                }
              }}
              className="min-h-10 appearance-none rounded-lg border border-[#dce4dd] bg-[#fbfcfb] py-2 pl-3 pr-9 text-sm text-[#303a35] outline-none focus:border-[#168d5b] focus:ring-2 focus:ring-[#168d5b]/15"
              aria-label="পণ্যের দাম অনুযায়ী সাজান"
            >
              <option value="default">ডিফল্ট</option>
              <option value="price-low">দাম: কম থেকে বেশি</option>
              <option value="price-high">দাম: বেশি থেকে কম</option>
            </select>
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#68736e]"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.09 1.03l-4.25 4.5a.75.75 0 0 1-1.09 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </span>
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