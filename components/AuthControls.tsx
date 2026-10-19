"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useToast } from "@/components/ToastProvider";

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2) || "U";
}

export default function AuthControls() {
  const router = useRouter();
  const showToast = useToast();
  const { data: session, isPending, error } = authClient.useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (menuRef.current && !menuRef.current.contains(target)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  async function handleSignOut() {
    setIsSigningOut(true);

    try {
      const result = await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            setIsMenuOpen(false);
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

  const displayName = session.user.name || "ব্যবহারকারী";
  const email = session.user.email || "";
  const initials = getInitials(displayName);
  const avatarUrl = session.user.image || "";

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsMenuOpen((value) => !value)}
        className="flex items-center gap-2 rounded-full border border-transparent bg-transparent px-1.5 py-1 text-left transition hover:border-[#dde7e0] hover:bg-white"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="size-8 rounded-full object-cover shadow-sm"
          />
        ) : (
          <span className="flex size-8 items-center justify-center rounded-full bg-[#1f2423] text-[11px] font-bold text-white shadow-sm">
            {initials}
          </span>
        )}
        <span className="max-w-28 truncate text-sm font-semibold text-[#303a36]">
          {displayName}
        </span>
        <span aria-hidden="true" className="text-xs text-[#6b766f]">
          ▾
        </span>
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-2xl border border-[#e4e8e5] bg-white p-3 shadow-[0_12px_32px_rgba(23,30,27,0.12)]">
          <div className="flex items-center gap-3 rounded-xl bg-[#f7f9f8] p-2.5">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="size-11 rounded-full object-cover"
              />
            ) : (
              <span className="flex size-11 items-center justify-center rounded-full bg-[#1f2423] text-sm font-bold text-white">
                {initials}
              </span>
            )}
            <div className="min-w-0">
              <p className="truncate text-base font-bold text-[#1f2a28]">
                {displayName}
              </p>
              <p className="truncate text-xs text-[#68736f]">{email}</p>
            </div>
          </div>

          <div className="mt-3 space-y-2">
            <Link
              href="/profile"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium text-[#21302d] transition hover:bg-[#f3f7f4]"
            >
              <span aria-hidden="true">👤</span>
              আমার প্রোফাইল
            </Link>

            <button
              type="button"
              onClick={() => void handleSignOut()}
              disabled={isSigningOut}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#f0b9b5] bg-[#fff4f4] px-3 py-2 text-sm font-semibold text-[#d7473b] transition hover:bg-[#ffe9e8] disabled:cursor-wait disabled:opacity-70"
            >
              <span aria-hidden="true">↩</span>
              {isSigningOut ? "অপেক্ষা করুন..." : "সাইন আউট"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
