import Link from "next/link";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import SigninForm from "@/components/SigninForm";

export default function SigninPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#edf3ee] text-[#202825]">
      <Navbar />

      <main className="flex flex-1 flex-col items-center px-3 py-8">
        <header className="mb-4 text-center">
          <h1 className="text-2xl font-black">সাইন ইন</h1>
          <p className="mt-2 text-sm text-[#7a8580]">
            আপনার অ্যাকাউন্টে প্রবেশ করুন।
          </p>
        </header>

        <section className="w-full max-w-md rounded-2xl border border-[#dfe7e0] bg-[#f8faf8] p-5 shadow-sm sm:p-6">
          <Suspense
            fallback={
              <div
                aria-label="সাইন ইন ফর্ম লোড হচ্ছে"
                className="h-48 animate-pulse rounded-xl bg-[#eef3ef]"
              />
            }
          >
            <SigninForm />
          </Suspense>
        </section>

        <p className="mt-5 text-sm text-[#64706b]">
          অ্যাকাউন্ট নেই?{" "}
          <Link
            href="/signup"
            className="font-semibold text-[#0b9857] hover:underline"
          >
            সাইন আপ করুন
          </Link>
        </p>
      </main>
    </div>
  );
}