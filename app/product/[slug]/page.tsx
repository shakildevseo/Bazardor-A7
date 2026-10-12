import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import Navbar from "@/components/Navbar";
import {
  formatChangePercent,
  formatTaka,
  getBangladeshDateLabel,
  getProductBySlug,
  getUnitLabel,
} from "@/lib/bazardor";
import type { BazaarProduct } from "@/lib/bazardor";

type ProductDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  return (
    <Suspense fallback={<ProductDetailLoading />}>
      <ProductDetailContent params={params} />
    </Suspense>
  );
}

async function ProductDetailContent({
  params,
}: ProductDetailPageProps) {
  await connection();

  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const dateLabel = getBangladeshDateLabel();
  const marketCount = product.markets.length;
  const lowestPrice = marketCount
    ? Math.min(...product.markets.map((market) => market.min))
    : product.today;
  const highestPrice = marketCount
    ? Math.max(...product.markets.map((market) => market.max))
    : product.today;
  const averagePrice = marketCount
    ? product.markets.reduce(
        (total, market) => total + (market.min + market.max) / 2,
        0,
      ) / marketCount
    : product.today;

  const changeLabel =
    product.change.dir === "up"
      ? `▲ ${formatChangePercent(Math.abs(product.change.pct))}%`
      : product.change.dir === "down"
        ? `▼ ${formatChangePercent(Math.abs(product.change.pct))}%`
        : "— ০.০%";

  const changeClass =
    product.change.dir === "up"
      ? "text-[#078c4b]"
      : product.change.dir === "down"
        ? "text-[#d7473b]"
        : "text-[#66716c]";

  return (
    <div className="flex min-h-screen flex-col bg-[#edf3ee] text-[#202825]">
      <Navbar dateLabel={dateLabel} />

      <main className="mx-auto w-full max-w-7xl flex-1 px-3 pb-8 pt-5 sm:px-6">
        <ProductBreadcrumb product={product} />

        <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#dfe7e0] bg-[#f8faf8] p-4 sm:p-5">
          <div className="flex min-w-0 items-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#eef3ef] text-2xl"
            >
              {product.image}
            </span>
            <div className="min-w-0">
              <h1 className="text-xl font-black sm:text-2xl">
                {product.nameBn}
              </h1>
              <p className="mt-1 text-xs text-[#58645f]">
                {marketCount > 0
                  ? `${formatTaka(marketCount)} টি বাজারের সর্বশেষ মূল্য · ${dateLabel}`
                  : `সর্বশেষ বাজার মূল্য অনুযায়ী দাম দেখুন · ${dateLabel}`}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Link
                  href={`/category/${encodeURIComponent(product.category)}`}
                  className="rounded-full border border-[#d5e9dc] bg-[#edf8f1] px-2.5 py-1 text-xs font-semibold text-[#087b4b]"
                >
                  {product.categoryNameBn}
                </Link>
                <span className="rounded-full border border-[#e1e7e2] bg-white px-2.5 py-1 text-xs">
                  প্রতি {getUnitLabel(product.unit)}
                </span>
              </div>
            </div>
          </div>

          <div className="min-w-32 rounded-xl bg-[#f0f5f0] px-4 py-2 text-center">
            <div className="text-[10px] text-[#74807b]">আজকের দাম</div>
            <div className="text-2xl font-black">
              {formatTaka(product.today)}
            </div>
            <div className="text-[10px] text-[#74807b]">
              টাকা / {getUnitLabel(product.unit)}
            </div>
            <div className={`mt-1 text-xs font-bold ${changeClass}`}>
              {changeLabel}
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-2xl border border-[#dfe7e0] bg-[#f8faf8] p-4">
          <h2 className="mb-3 text-sm font-bold">দামের সারসংক্ষেপ</h2>
          <div className="grid gap-2 sm:grid-cols-3">
            {[
              {
                title: "সর্বনিম্ন দাম",
                price: lowestPrice,
                color: "text-[#078c4b]",
              },
              {
                title: "সর্বোচ্চ দাম",
                price: highestPrice,
                color: "text-[#d8473b]",
              },
              {
                title: "গড় দাম",
                price: averagePrice,
                color: "text-[#078c4b]",
              },
            ].map(({ title, price, color }) => (
              <div
                key={title}
                className="rounded-xl border border-[#e0e8e1] bg-[#fbfcfb] px-4 py-3"
              >
                <div className="text-xs font-medium text-[#606d67]">
                  {title}
                </div>
                <div className={`mt-1 text-lg font-black ${color}`}>
                  {formatTaka(price)} টাকা
                </div>
              </div>
            ))}
          </div>

          <h2 className="mb-2 mt-5 text-sm font-bold">
            বাজারভিত্তিক আজকের দাম
          </h2>

          {marketCount > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-[#e1e8e2]">
              <table className="w-full min-w-[32rem] border-collapse text-left text-xs">
                <thead className="bg-[#f5f8f5] text-[#59655f]">
                  <tr>
                    <th scope="col" className="px-3 py-2.5 font-semibold">
                      বাজার
                    </th>
                    <th scope="col" className="px-3 py-2.5 font-semibold">
                      এলাকা
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2.5 text-right font-semibold"
                    >
                      সর্বনিম্ন
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2.5 text-right font-semibold"
                    >
                      সর্বোচ্চ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {product.markets.map(
                    ({ market, division, min, max }, index) => (
                      <tr
                        key={`${market}-${division}`}
                        className={
                          index % 2 === 0 ? "bg-[#f8faf8]" : "bg-[#f0f5f0]"
                        }
                      >
                        <td className="border-t border-[#dfe6df] px-3 py-2.5 font-medium">
                          {market}
                        </td>
                        <td className="border-t border-[#dfe6df] px-3 py-2.5">
                          {division}
                        </td>
                        <td className="border-t border-[#dfe6df] px-3 py-2.5 text-right">
                          {formatTaka(min)} টাকা
                        </td>
                        <td className="border-t border-[#dfe6df] px-3 py-2.5 text-right">
                          {formatTaka(max)} টাকা
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="rounded-lg border border-[#e1e8e2] bg-[#fbfcfb] px-3 py-4 text-sm text-[#68736e]">
              এই পণ্যের জন্য বাজারভিত্তিক দাম পাওয়া যায়নি।
            </p>
          )}
        </section>
      </main>

      <footer className="border-t border-[#e1e8e1] bg-[#fbfcfb] px-3 py-4 text-center text-xs text-[#58615e]">
        বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।
      </footer>
    </div>
  );
}

function ProductBreadcrumb({ product }: { product: BazaarProduct }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-5 flex items-center gap-2 text-xs text-[#58645f]"
    >
      <Link href="/" className="transition hover:text-[#078c4b]">
        হোম
      </Link>
      <span aria-hidden="true">›</span>
      <Link
        href={`/category/${encodeURIComponent(product.category)}`}
        className="transition hover:text-[#078c4b]"
      >
        {product.categoryNameBn}
      </Link>
      <span aria-hidden="true">›</span>
      <span>{product.nameBn}</span>
    </nav>
  );
}

function ProductDetailLoading() {
  return (
    <main className="min-h-screen bg-[#edf3ee] px-3 py-5 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="h-36 animate-pulse rounded-2xl border border-[#dfe7e0] bg-[#f8faf8]" />
        <div className="mt-4 h-72 animate-pulse rounded-2xl border border-[#dfe7e0] bg-[#f8faf8]" />
      </div>
    </main>
  );
}