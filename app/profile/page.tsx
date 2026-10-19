import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import PriceTicker from "@/components/PriceTicker";
import UpdateProfileForm from "@/components/UpdateProfileForm";
import { auth } from "@/lib/auth";

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2) || "U";
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#edf2ee]">
          <Navbar ticker={<PriceTicker />} />
          <div className="mx-auto max-w-3xl px-4 py-10">
            <div className="h-8 w-48 animate-pulse rounded bg-[#dfe6e0]" />
            <div className="mt-5 h-28 animate-pulse rounded-2xl bg-[#f3f6f4]" />
          </div>
        </div>
      }
    >
      <ProfilePageContent />
    </Suspense>
  );
}

async function ProfilePageContent() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin");
  }

  const displayName = session.user.name || "ব্যবহারকারী";
  const email = session.user.email || "";
  const initials = getInitials(displayName);
  const avatarUrl = session.user.image || "";

  return (
    <div className="min-h-screen bg-[#edf2ee] text-[#1d2a26]">
      <Navbar ticker={<PriceTicker />} />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[760px]">
          <h1 className="text-3xl font-black leading-tight text-[#1d2a26]">
            আমার প্রোফাইল
          </h1>
          <p className="mt-2 text-sm text-[#65716d]">
            আপনার অ্যাকাউন্টের তথ্য আপডেট করুন।
          </p>

          <section className="mt-8 rounded-2xl border border-[#dfe5df] bg-[#f8faf8] p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="size-14 rounded-full object-cover shadow-sm"
                  />
                ) : (
                  <div className="flex size-14 items-center justify-center rounded-full bg-[#1d2323] text-lg font-bold text-white shadow-sm">
                    {initials}
                  </div>
                )}

                <div className="min-w-0">
                  <p className="truncate text-2xl font-bold text-[#202a27]">
                    {displayName}
                  </p>
                  <p className="truncate text-sm text-[#66736f]">{email}</p>
                </div>
              </div>

              <div className="rounded-xl border border-[#e8ece9] bg-[#f4f7f5] px-3 py-2 text-xs font-medium text-[#4e5e59]">
                প্রোফাইল
              </div>
            </div>
          </section>

          <section className="mt-6 rounded-2xl border border-[#dfe5df] bg-[#f8faf8] p-4 shadow-sm sm:p-6">
            <h2 className="mb-4 text-xl font-bold text-[#1d2a26]">তথ্য</h2>
            <UpdateProfileForm initialName={displayName} />
          </section>
        </div>
      </main>
    </div>
  );
}
