import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#edf3ee] px-4 py-12 text-center text-[#202825]">
      <section className="w-full max-w-md rounded-2xl border border-[#dfe7e0] bg-[#f8faf8] p-8 shadow-sm">
        <Image
          src="/bazar-hero.png"
          alt="বাজারের তাজা পণ্য"
          width={224}
          height={192}
          className="mx-auto h-36 w-40 object-contain"
        />
        <h1 className="mt-4 text-2xl font-black">পণ্য বা পৃষ্ঠাটি পাওয়া যায়নি</h1>
        <p className="mt-2 text-sm leading-6 text-[#68736e]">
          ঠিকানাটি যাচাই করুন, অথবা হোম পেজে ফিরে আজকের বাজারদর দেখুন।
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#078c4b] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#067b42]"
        >
          হোম পেজে ফিরে যান
        </Link>
      </section>
    </main>
  );
}
