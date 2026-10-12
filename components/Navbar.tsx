"use client";

import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useToast } from "@/components/ToastProvider";

export type NavItem = {
  slug: string;
  label: string;
  icon: string;
};

type NavbarProps = {
  activeCategory?: string;
  navItems?: NavItem[];
  dateLabel?: string;
  homePage?: boolean;
  ticker?: ReactNode;
};

const defaultNavItems: NavItem[] = [
  { slug: "chal", label: "চাল", icon: "🍚" },
  { slug: "dal", label: "ডাল", icon: "🫘" },
  { slug: "tel", label: "তেল", icon: "🛢️" },
  { slug: "sobji", label: "সবজি", icon: "🥬" },
  { slug: "mach", label: "মাছ", icon: "🐟" },
  { slug: "mangsho", label: "মাংস", icon: "🍗" },
  { slug: "dim-dui", label: "ডিম-দুধ", icon: "🥛" },
  { slug: "mosla", label: "মসলা", icon: "🌶️" },
];

export default function Navbar({
  activeCategory,
  navItems = defaultNavItems,
  dateLabel = "নিত্যপ্রয়োজনীয় পণ্যের বাজারদর",
  ticker,
}: NavbarProps) {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const showToast = useToast();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!profileMenuOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !profileMenuRef.current?.contains(event.target)
      ) {
        setProfileMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setProfileMenuOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [profileMenuOpen]);

  async function handleSignOut() {
    try {
      const result = await authClient.signOut();
      if (result.error) {
        showToast(result.error.message ?? "সাইন আউট করা যায়নি।", "error");
        return;
      }

      showToast("সাইন আউট সফল হয়েছে।", "success");
      setProfileMenuOpen(false);
      router.push("/signin");
      router.refresh();
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "সাইন আউট করা যায়নি। আবার চেষ্টা করুন।",
        "error",
      );
    }
  }

  return (
    <header className="w-full border-b border-[#e4e9e4] bg-[#f8faf8]">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 py-2">
        <Link href="/" className="flex shrink-0 cursor-pointer items-center gap-2">
          <span
            aria-hidden="true"
            className="flex size-10 items-center justify-center rounded-lg bg-[#078c4b] text-xl"
          >
            🛒
          </span>
          <span>
            <span className="block text-base font-black leading-tight text-[#1b2422]">
              বাজার দর
            </span>
            <span className="mt-0.5 block text-xs text-[#67726f]">
              {dateLabel}
            </span>
          </span>
        </Link>
        {isPending ? (
          <div
            aria-label="অ্যাকাউন্টের অবস্থা লোড হচ্ছে"
            className="h-9 w-28 animate-pulse rounded-lg bg-[#e9eeea]"
          />
        ) : session ? (
          <div ref={profileMenuRef} className="relative z-50 shrink-0">
            <button
              type="button"
              aria-expanded={profileMenuOpen}
              aria-haspopup="menu"
              onClick={() => setProfileMenuOpen((open) => !open)}
              className="flex max-w-44 cursor-pointer items-center gap-2 rounded-xl px-2 py-1.5 text-left text-sm font-semibold text-[#303a36] transition hover:bg-[#edf2ef]"
            >
              <span className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#e5eee7] text-sm font-bold text-[#087b4b]">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt=""
                    fill
                    unoptimized
                    sizes="36px"
                    className="object-cover"
                  />
                ) : (
                  session.user.name.trim().charAt(0).toUpperCase()
                )}
              </span>
              <span className="truncate">{session.user.name}</span>
              <span
                aria-hidden="true"
                className="shrink-0 text-xs text-[#77817d]"
              >
                ⌄
              </span>
            </button>

            {profileMenuOpen && (
              <div
                role="menu"
                aria-label="প্রোফাইল মেনু"
                className="absolute right-0 top-full mt-2 w-56 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-2xl border border-[#dfe7e0] bg-[#fbfcfb] py-1.5 shadow-[0_8px_24px_rgba(32,40,37,0.14)]"
              >
                <div className="border-b border-[#e7ece8] px-4 py-3">
                  <p className="truncate text-sm font-bold text-[#26312d]">
                    {session.user.name}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-[#77817d]">
                    {session.user.email}
                  </p>
                </div>
                <Link
                  href="/profile"
                  role="menuitem"
                  onClick={() => setProfileMenuOpen(false)}
                  className="flex cursor-pointer items-center gap-2 px-4 py-2.5 text-sm text-[#303a36] transition hover:bg-[#edf5ef]"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="size-4 text-[#728078]"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM3 16a7 7 0 1 1 14 0v1H3v-1Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>আমার প্রোফাইল</span>
                </Link>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => void handleSignOut()}
                  className="flex w-full cursor-pointer items-center gap-2 px-4 py-2.5 text-left text-sm text-[#d7473b] transition hover:bg-[#fff0ee]"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="size-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 10a1 1 0 0 1 1-1h8.586l-2.293-2.293a1 1 0 0 1 1.414-1.414l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414-1.414L12.586 11H4a1 1 0 0 1-1-1Z"
                      clipRule="evenodd"
                    />
                    <path d="M4 3a1 1 0 0 1 1-1h5a1 1 0 1 1 0 2H5v12h5a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1V3Z" />
                  </svg>
                  সাইন আউট
                </button>
              </div>
            )}
          </div>
        ) : (
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
        )}
      </div>

      <nav
        aria-label="পণ্যের বিভাগ"
        className="hide-scrollbar overflow-x-auto border-y border-[#edf0ed]"
      >
        <div className="mx-auto flex w-max min-w-full max-w-7xl items-center justify-start gap-1 px-3 py-2 sm:justify-center sm:gap-2">
          {navItems.map(({ slug, label, icon }) => {
            const isActive = slug === activeCategory;

            return (
              <Link
                key={slug}
                href={`/category/${encodeURIComponent(slug)}`}
                aria-current={isActive ? "page" : undefined}
                className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium transition sm:text-sm ${
                  isActive
                    ? "border-[#b9e4ce] bg-[#e8f8ef] text-[#087b4b] shadow-sm"
                    : "border-transparent text-[#46514c] hover:border-[#d9e8de] hover:bg-white"
                } cursor-pointer`}
              >
                <span aria-hidden="true">{icon}</span>
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
      {ticker}
    </header>
  );
}