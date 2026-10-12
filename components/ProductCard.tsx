import Link from "next/link";

export type ProductCardData = {
  slug: string;
  title: string;
  icon: string;
  price: string;
  priceValue?: number;
  unit: string;
  changeDirection: "up" | "down" | "flat";
  change: string;
  subtitle?: string;
};

type ProductCardProps = {
  item: ProductCardData;
  compact?: boolean;
};

export default function ProductCard({
  item,
  compact = false,
}: ProductCardProps) {
  const badgeStyles = {
    up: "bg-[#eaf8f0] text-[#078c4b]",
    down: "bg-[#fff0ee] text-[#d9473b]",
    flat: "bg-[#eff2ef] text-[#66716c]",
  }[item.changeDirection];

  return (
    <Link
      href={`/product/${encodeURIComponent(item.slug)}`}
      className={`group border border-[#dfe5df] bg-[#f8faf8] shadow-[0_10px_20px_rgba(17,24,39,0.02)] transition hover:-translate-y-0.5 hover:border-[#c8dfd0] hover:shadow-[0_12px_24px_rgba(17,24,39,0.06)] focus:outline-none focus:ring-2 focus:ring-[#138c5a]/30 ${
        compact
          ? "flex min-h-24 flex-col justify-between rounded-xl p-2.5"
          : "rounded-[18px] p-4"
      }`}
    >
      <div className={`flex items-center ${compact ? "gap-2.5" : "gap-3"}`}>
        <span
          aria-hidden="true"
          className={`flex shrink-0 items-center justify-center rounded-lg bg-[#edf2ef] ${
            compact ? "h-8 w-8 text-base" : "h-11 w-11 rounded-xl text-2xl"
          }`}
        >
          {item.icon}
        </span>

        <span className="min-w-0">
          <span
            className={`block truncate font-black text-[#1a2122] group-hover:text-[#087b4b] ${
              compact ? "text-sm leading-tight" : "text-[1.05rem]"
            }`}
          >
            {item.title}
          </span>
          <span className="mt-0.5 block text-xs text-[#5d6b67]">
            প্রতি {item.unit}
          </span>
        </span>
      </div>

      <div
        className={`flex items-end justify-between gap-2 ${
          compact ? "mt-3" : "mt-4 gap-2 border-t border-[#e2e8e4] pt-3"
        }`}
      >
        <span>
          <span className="block text-xs leading-tight text-[#5d6663]">
            আজকের দাম
          </span>
          <span
            className={`mt-0.5 block font-black leading-tight text-[#202927] ${
              compact ? "text-base" : "text-lg"
            }`}
          >
            {item.price}
          </span>
        </span>

        <span
          className={`shrink-0 rounded-full px-2 py-1 text-xs font-bold ${badgeStyles}`}
        >
          {item.change}
        </span>
      </div>
    </Link>
  );
}