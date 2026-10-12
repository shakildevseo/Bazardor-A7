import { Suspense } from "react";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import PriceTicker from "@/components/PriceTicker";
import UpdateProfileForm from "@/components/UpdateProfileForm";
import { auth } from "@/lib/auth";

export default function UpdateProfilePage() {
  return (
    <Suspense fallback={<UpdateProfileLoading />}>
      <UpdateProfileContent />
    </Suspense>
  );
}

async function UpdateProfileContent() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/signin?callbackUrl=%2Fprofile%2Fupdate&authRequired=1");
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#edf3ee] text-[#202825]">
      <Navbar ticker={<PriceTicker />} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-3 py-8 sm:px-6 sm:py-12">
        <section className="mx-auto max-w-xl rounded-2xl border border-[#dfe7e0] bg-[#f8faf8] p-5 shadow-sm sm:p-8">
          <Link
            href="/profile"
            className="text-sm font-semibold text-[#087b4b] hover:underline"
          >
            ← আমার প্রোফাইলে ফিরুন
          </Link>
          <h1 className="mt-4 text-2xl font-black">
            ব্যক্তিগত তথ্য আপডেট
          </h1>
          <p className="mt-1 text-sm text-[#68736e]">
            আপনার অ্যাকাউন্টের প্রদর্শিত নাম পরিবর্তন করুন।
          </p>
          <UpdateProfileForm initialName={session.user.name} />
        </section>
      </main>
    </div>
  );
}

function UpdateProfileLoading() {
  return (
    <main className="min-h-screen bg-[#edf3ee] px-3 py-6 sm:px-6">
      <div className="mx-auto max-w-xl animate-pulse rounded-2xl border border-[#dfe7e0] bg-[#f8faf8] p-8">
        <div className="h-8 w-56 rounded bg-[#e5ebe6]" />
        <div className="mt-6 h-12 rounded-xl bg-[#e5ebe6]" />
        <div className="mt-4 h-11 w-full rounded-xl bg-[#e5ebe6]" />
      </div>
    </main>
  );
}
