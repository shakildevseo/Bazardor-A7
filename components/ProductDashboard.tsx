import ProductCard, {
  type ProductCardData,
} from "@/components/ProductCard";
import {
  formatChangePercent,
  formatTaka,
  getBazaarProducts,
  getUnitLabel,
} from "@/lib/bazardor";
import type { BazaarProduct } from "@/lib/bazardor";

function toProductCard(product: BazaarProduct): ProductCardData {
  const change =
    product.change.dir === "flat"
      ? "— ০.০%"
      : `${product.change.dir === "up" ? "▲" : "▼"} ${formatChangePercent(
          Math.abs(product.change.pct),
        )}%`;

  return {
    slug: product.slug,
    title: product.nameBn,
    icon: product.image,
    price: `${formatTaka(product.today)} টাকা`,
    priceValue: product.today,
    unit: getUnitLabel(product.unit),
    changeDirection: product.change.dir,
    change,
    subtitle: product.categoryNameBn,
  };
}

export default async function ProductDashboard() {
  const bazaarProducts = await getBazaarProducts();
  const products = bazaarProducts.map(toProductCard);
  const risingProducts = bazaarProducts
    .filter((product) => product.change.dir === "up")
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, 6);
  const fallingProducts = bazaarProducts
    .filter((product) => product.change.dir === "down")
    .sort((a, b) => a.change.pct - b.change.pct)
    .slice(0, 6);

  return (
    <div className="mt-7">
      <PriceSection
        title="আজ দাম বেড়েছে"
        indicator="▲"
        indicatorClass="text-[#dc4c43]"
        products={risingProducts.map(toProductCard)}
      />

      <PriceSection
        title="আজ দাম কমেছে"
        indicator="▼"
        indicatorClass="text-[#15934f]"
        products={fallingProducts.map(toProductCard)}
      />

      <section id="সব-পণ্য" className="mt-8 scroll-mt-4 pb-6">
        <div className="mb-2 text-[#1f2a2a]">
          <h2 className="text-lg font-black leading-tight">সব পণ্য</h2>
          <p className="mt-1 text-xs text-[#65716c]">
            মোট {new Intl.NumberFormat("bn-BD").format(products.length)} টি
            নিত্যপ্রয়োজনীয় পণ্য
          </p>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.slug} item={product} compact />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-[#dfe5df] bg-[#f8faf8] p-5 text-sm text-[#65716c]">
            এই মুহূর্তে কোনো পণ্যের তথ্য পাওয়া যায়নি।
          </p>
        )}
      </section>
    </div>
  );
}

function PriceSection({
  title,
  indicator,
  indicatorClass,
  products,
}: {
  title: string;
  indicator: string;
  indicatorClass: string;
  products: ProductCardData[];
}) {
  return (
    <section className="mt-7">
      <div className="mb-2 flex items-center gap-1.5 text-[#1f2a2a]">
        <span aria-hidden="true" className={`text-xs ${indicatorClass}`}>
          {indicator}
        </span>
        <h2 className="text-lg font-black leading-tight">{title}</h2>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.slug} item={product} compact />
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-[#dfe5df] bg-[#f8faf8] p-4 text-sm text-[#65716c]">
          এই তালিকায় কোনো পণ্য নেই।
        </p>
      )}
    </section>
  );
}