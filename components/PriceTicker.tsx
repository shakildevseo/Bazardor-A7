import { Suspense } from "react";
import {
  formatChangePercent,
  formatTaka,
  getBazaarProducts,
  getUnitLabel,
} from "@/lib/bazardor";

export default function PriceTicker() {
  return (
    <Suspense
      fallback={
        <div
          aria-label="বাজারদর লোড হচ্ছে"
          className="h-9 animate-pulse border-b border-[#e4e9e4] bg-[#f1f5f1]"
        />
      }
    >
      <PriceTickerItems />
    </Suspense>
  );
}

async function PriceTickerItems() {
  const products = await getBazaarProducts();
  const items = products.map((product) => {
    const change =
      product.change.dir === "flat"
        ? "— ০.০%"
        : `${product.change.dir === "up" ? "▲" : "▼"} ${formatChangePercent(
            Math.abs(product.change.pct),
          )}%`;

    return {
      key: product.slug,
      icon: product.image,
      name: product.nameBn,
      price: formatTaka(product.today),
      unit: getUnitLabel(product.unit),
      change,
      changeClass:
        product.change.dir === "up"
          ? "text-[#078c4b]"
          : product.change.dir === "down"
            ? "text-[#d7473b]"
            : "text-[#77817d]",
    };
  });

  return (
    <div
      aria-label="আজকের বাজারদরের সংক্ষিপ্ত তালিকা"
      className="overflow-hidden border-b border-[#e4e9e4] bg-[#fbfcfb]"
    >
      <div className="price-ticker-track flex w-max items-center">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            aria-hidden={copy === 1}
            className="flex shrink-0 items-center"
          >
            {items.map((item) => (
              <span
                key={`${copy}-${item.key}`}
                className="flex min-h-9 shrink-0 items-center gap-1.5 border-r border-[#e7ece8] px-4 text-xs text-[#46514c]"
              >
                <span aria-hidden="true">{item.icon}</span>
                <span className="font-semibold">{item.name}</span>
                <span className="text-[#77817d]">
                  {item.price} টাকা/{item.unit}
                </span>
                <span className={`font-bold ${item.changeClass}`}>
                  {item.change}
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
