import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import ProductDashboard from "@/components/ProductDashboard";
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
        <main className="min-h-screen bg-[#edf2ee] p-6 text-[#46514c]">
          বাজারদর লোড হচ্ছে...
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
      <Navbar navItems={navItems} dateLabel={dateLabel} />

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