import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import ProductDashboard from "@/components/ProductDashboard";
import PriceTicker from "@/components/PriceTicker";
import { Suspense } from "react";
import {
  getBangladeshDateLabel,
  getBazaarCategories,
} from "@/lib/bazardor";
import { connection } from "next/server";

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#edf2ee] px-3 py-5 text-[#46514c] sm:px-6">
          <div className="mx-auto max-w-7xl">
            <div className="h-16 animate-pulse rounded-xl bg-[#f8faf8]" />
            <div className="mt-4 h-9 animate-pulse rounded-lg bg-[#f8faf8]" />
            <div className="mt-5 h-64 animate-pulse rounded-2xl bg-[#f8faf8] sm:h-72" />
            <div className="mt-7 h-7 w-48 animate-pulse rounded bg-[#dfe7e0]" />
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }, (_, index) => (
                <div
                  key={index}
                  className="h-32 animate-pulse rounded-xl bg-[#f8faf8]"
                />
              ))}
            </div>
          </div>
        </main>
      }
    >
      <HomePageContent />
    </Suspense>
  );
}

async function HomePageContent() {
  await connection();
  const dateLabel = getBangladeshDateLabel();
  const categories = await getBazaarCategories();

  const navItems = categories.map(({ slug, nameBn, icon }) => ({
    slug,
    label: nameBn,
    icon,
  }));

  return (
    <main className="min-h-screen bg-[#edf2ee] text-[#1f2328]">
      <Navbar navItems={navItems} dateLabel={dateLabel} ticker={<PriceTicker />} />

      <div className="mx-auto w-full max-w-7xl px-3 sm:px-4">
        <HeroSection dateLabel={dateLabel} />
        <ProductDashboard />

        <footer className="flex flex-col gap-2 border-t border-[#dfe5df] py-5 text-xs leading-5 text-[#58615e] sm:flex-row sm:items-center sm:justify-between">
          <p>বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।</p>
          <p>সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।</p>
        </footer>
      </div>
    </main>
  );
}