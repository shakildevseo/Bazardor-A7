import { Suspense } from "react";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import PriceTicker from "@/components/PriceTicker";
import { auth } from "@/lib/auth";

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileLoading />}>
      <ProfileContent />
    </Suspense>
  );
}

async function ProfileContent() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/signin?callbackUrl=%2Fprofile&authRequired=1");
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#edf3ee] text-[#202825]">
      <Navbar ticker={<PriceTicker />} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-3 py-8 sm:px-6 sm:py-12">
        <section className="mx-auto max-w-xl rounded-2xl border border-[#dfe7e0] bg-[#f8faf8] p-5 shadow-sm sm:p-8">
          <p className="text-sm font-semibold text-[#0e8d5d]">
            আমার অ্যাকাউন্ট
          </p>
          <h1 className="mt-1 text-2xl font-black">আমার প্রোফাইল</h1>

          <dl className="mt-6 divide-y divide-[#e3e9e3] rounded-xl border border-[#e3e9e3] bg-white px-4">
            <div className="py-3">
              <dt className="text-xs text-[#77817d]">নাম</dt>
              <dd className="mt-1 text-sm font-semibold">
                {session.user.name}
              </dd>
            </div>
            <div className="py-3">
              <dt className="text-xs text-[#77817d]">ইমেইল</dt>
              <dd className="mt-1 break-all text-sm font-semibold">
                {session.user.email}
              </dd>
            </div>
          </dl>

          <Link
            href="/profile/update"
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#078c4b] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#067b42]"
          >
            তথ্য আপডেট করুন
          </Link>
        </section>
      </main>
    </div>
  );
}

function ProfileLoading() {
  return (
    <main className="min-h-screen bg-[#edf3ee] px-3 py-6 sm:px-6">
      <div className="mx-auto max-w-xl animate-pulse rounded-2xl border border-[#dfe7e0] bg-[#f8faf8] p-8">
        <div className="h-8 w-48 rounded bg-[#e5ebe6]" />
        <div className="mt-6 h-24 rounded-xl bg-[#e5ebe6]" />
        <div className="mt-5 h-11 w-40 rounded-xl bg-[#e5ebe6]" />
      </div>
    </main>
  );
}
