"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import SocialAuthButtons from "@/components/SocialAuthButtons";
import { useToast } from "@/components/ToastProvider";

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "সাইন ইন করা যায়নি। আবার চেষ্টা করুন।";
}

export default function SigninForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = "/";
  const showToast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(() =>
    searchParams.get("socialError") === "signup-required"
      ? "এই Google/GitHub অ্যাকাউন্টে এখনো সাইন আপ করা হয়নি। আগে সাইন আপ করুন।"
      : "",
  );

  useEffect(() => {
    if (searchParams.get("authRequired") === "1") {
      showToast("এই পৃষ্ঠাটি দেখতে সাইন ইন করুন।", "error");
    }
  }, [searchParams, showToast]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      const message = "সঠিক ইমেইল ঠিকানা লিখুন।";
      setErrorMessage(message);
      showToast(message, "error");
      return;
    }

    if (!password) {
      const message = "পাসওয়ার্ড লিখুন।";
      setErrorMessage(message);
      showToast(message, "error");
      return;
    }

    setIsLoading(true);

    try {
      const result = await authClient.signIn.email({
        email,
        password,
        callbackURL: callbackUrl,
      });

      if (result.error) {
        const message =
          result.error.message ?? "ইমেইল বা পাসওয়ার্ড সঠিক নয়।";
        setErrorMessage(message);
        showToast(message, "error");
        return;
      }

      showToast("সাইন ইন সফল হয়েছে।", "success");
      router.push(callbackUrl);
      router.refresh();
    } catch (error) {
      const message = getErrorMessage(error);
      setErrorMessage(message);
      showToast(message, "error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <label className="block text-sm font-medium text-[#26312d]">
        ইমেইল
        <input
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          disabled={isLoading}
          className="mt-1.5 h-11 w-full rounded-lg border border-[#dce4dd] bg-[#fbfcfb] px-3 text-sm outline-none focus:border-[#14915b] focus:ring-2 focus:ring-[#14915b]/15 disabled:opacity-60"
        />
      </label>

      <label className="block text-sm font-medium text-[#26312d]">
        পাসওয়ার্ড
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="কমপক্ষে ৮ অক্ষর"
          required
          disabled={isLoading}
          className="mt-1.5 h-11 w-full rounded-lg border border-[#dce4dd] bg-[#fbfcfb] px-3 text-sm outline-none focus:border-[#14915b] focus:ring-2 focus:ring-[#14915b]/15 disabled:opacity-60"
        />
      </label>

      {errorMessage && (
        <p role="alert" className="text-sm text-[#b9382e]">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="flex h-11 w-full cursor-pointer items-center justify-center rounded-lg bg-[#078c4b] text-sm font-bold text-white transition hover:bg-[#067b42] disabled:cursor-wait disabled:opacity-70"
      >
        {isLoading ? "অপেক্ষা করুন..." : "সাইন ইন করুন"}
      </button>

      <SocialAuthButtons mode="signin" callbackURL={callbackUrl} />
    </form>
  );
}