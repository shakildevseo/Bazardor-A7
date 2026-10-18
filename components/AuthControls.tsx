"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useToast } from "@/components/ToastProvider";

export default function AuthControls() {
  const router = useRouter();
  const showToast = useToast();
  const { data: session, isPending, error } = authClient.useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);

    try {
      const result = await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            showToast("সাইন আউট সফল হয়েছে।", "success");
            router.push("/signin");
            router.refresh();
          },
        },
      });

      if (result.error) {
        showToast(result.error.message ?? "সাইন আউট করা যায়নি।", "error");
      }
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "সাইন আউট করা যায়নি। আবার চেষ্টা করুন।",
        "error",
      );
    } finally {
      setIsSigningOut(false);
    }
  }

  if (error) {
    return (
      <p role="alert" className="text-xs text-[#b9382e]">
        সেশনের তথ্য লোড করা যায়নি।
      </p>
    );
  }

  if (isPending) {
    return (
      <div
        aria-label="অ্যাকাউন্টের অবস্থা লোড হচ্ছে"
        className="h-9 w-24 animate-pulse rounded-lg bg-[#e9eeea]"
      />
    );
  }

  if (!session) {
    return (
      <div className="flex shrink-0 items-center gap-2 text-sm font-semibold">
        <Link
          href="/signin"
          className="cursor-pointer rounded-lg px-3 py-2 text-[#303a36] hover:text-[#0e8f5d]"
        >
          সাইন ইন
        </Link>
        <Link
          href="/signup"
          className="cursor-pointer rounded-lg bg-[#078c4b] px-4 py-2 text-white hover:bg-[#067b42]"
        >
          সাইন আপ
        </Link>
      </div>
    );
  }

  return (
    <div className="flex shrink-0 items-center gap-3">
      <span className="max-w-36 truncate text-sm font-semibold text-[#303a36]">
        {session.user.name}
      </span>
      <button
        type="button"
        onClick={() => void handleSignOut()}
        disabled={isSigningOut}
        className="cursor-pointer rounded-lg border border-[#dce4dd] px-3 py-2 text-sm font-medium text-[#d7473b] transition hover:bg-[#fff0ee] disabled:cursor-wait disabled:opacity-60"
      >
        {isSigningOut ? "অপেক্ষা করুন..." : "সাইন আউট"}
      </button>
    </div>
  );
}
