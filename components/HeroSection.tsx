import Image from "next/image";

type HeroSectionProps = {
  dateLabel?: string;
};

export default function HeroSection({
  dateLabel = "বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের বাজারদর",
}: HeroSectionProps) {
  return (
    <section className="mt-3 overflow-hidden rounded-2xl border border-[#dfe5df] bg-[#f8faf8] px-5 py-6 shadow-[0_12px_24px_rgba(17,24,39,0.03)] sm:px-8 sm:py-8">
      <div className="grid items-center gap-5 sm:grid-cols-[1fr_auto] sm:gap-8">
        <div className="min-w-0">
          <p className="inline-flex rounded-full bg-[#edfdf5] px-3 py-1 text-xs font-bold text-[#0e8d5d]">
            {dateLabel}
          </p>

          <h1 className="mt-3 max-w-2xl text-2xl font-black leading-tight tracking-tight text-[#1b2223] sm:text-4xl">
            আজকের বাজারের দাম এক নজরে
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#4d5956] sm:text-base">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম বাজারভিত্তিক
            বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
          </p>

          <a
            href="#সব-পণ্য"
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#0f8e5d] px-5 py-2.5 text-sm font-bold text-white shadow-[0_4px_10px_rgba(15,142,93,0.2)] transition hover:-translate-y-0.5 hover:bg-[#0b7c50] focus:outline-none focus:ring-2 focus:ring-[#0f8e5d] focus:ring-offset-2"
          >
            সব দাম দেখুন
          </a>
        </div>

        <div
          aria-hidden="true"
          className="relative flex min-h-36 items-center justify-center overflow-hidden rounded-2xl bg-[#edf5ef] sm:min-h-48 sm:min-w-56"
        >
          <Image
            src="/bazar-hero.png"
            alt=""
            width={224}
            height={192}
            loading="eager"
            className="h-36 w-full object-contain sm:h-48 sm:w-56"
          />
        </div>
      </div>
    </section>
  );
}