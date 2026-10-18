import Link from "next/link";
import type { ReactNode } from "react";
import AuthControls from "@/components/AuthControls";

export type NavItem = {
  slug: string;
  label: string;
  icon: string;
};

type NavbarProps = {
  activeCategory?: string;
  navItems?: NavItem[];
  dateLabel?: string;
  homePage?: boolean;
  ticker?: ReactNode;
};

const defaultNavItems: NavItem[] = [
  { slug: "chal", label: "চাল", icon: "🍚" },
  { slug: "dal", label: "ডাল", icon: "🫘" },
  { slug: "tel", label: "তেল", icon: "🛢️" },
  { slug: "sobji", label: "সবজি", icon: "🥬" },
  { slug: "mach", label: "মাছ", icon: "🐟" },
  { slug: "mangsho", label: "মাংস", icon: "🍗" },
  { slug: "dim-dui", label: "ডিম-দুধ", icon: "🥛" },
  { slug: "mosla", label: "মসলা", icon: "🌶️" },
];

export default function Navbar({
  activeCategory,
  navItems = defaultNavItems,
  dateLabel = "নিত্যপ্রয়োজনীয় পণ্যের বাজারদর",
  ticker,
}: NavbarProps) {
  return (
    <header className="w-full border-b border-[#e4e9e4] bg-[#f8faf8]">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 py-2">
        <Link href="/" className="flex shrink-0 cursor-pointer items-center gap-2">
          <span
            aria-hidden="true"
            className="flex size-10 items-center justify-center rounded-lg bg-[#078c4b] text-xl"
          >
            🛒
          </span>
          <span>
            <span className="block text-base font-black leading-tight text-[#1b2422]">
              বাজার দর
            </span>
            <span className="mt-0.5 block text-xs text-[#67726f]">
              {dateLabel}
            </span>
          </span>
        </Link>
        <AuthControls />
      </div>

      <nav
        aria-label="পণ্যের বিভাগ"
        className="hide-scrollbar overflow-x-auto border-y border-[#edf0ed]"
      >
        <div className="mx-auto flex w-max min-w-full max-w-7xl items-center justify-start gap-1 px-3 py-2 sm:justify-center sm:gap-2">
          {navItems.map(({ slug, label, icon }) => {
            const isActive = slug === activeCategory;

            return (
              <Link
                key={slug}
                href={`/category/${encodeURIComponent(slug)}`}
                aria-current={isActive ? "page" : undefined}
                className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium transition sm:text-sm ${
                  isActive
                    ? "border-[#b9e4ce] bg-[#e8f8ef] text-[#087b4b] shadow-sm"
                    : "border-transparent text-[#46514c] hover:border-[#d9e8de] hover:bg-white"
                } cursor-pointer`}
              >
                <span aria-hidden="true">{icon}</span>
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
      {ticker}
    </header>
  );
}