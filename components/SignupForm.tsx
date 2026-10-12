"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import SocialAuthButtons from "@/components/SocialAuthButtons";
import { useToast } from "@/components/ToastProvider";

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "অ্যাকাউন্ট তৈরি করা যায়নি। আবার চেষ্টা করুন।";
}

export default function SignupForm() {
  const router = useRouter();
  const showToast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (name.length < 2) {
      const message = "নাম অন্তত ২ অক্ষরের হতে হবে।";
      setErrorMessage(message);
      showToast(message, "error");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      const message = "সঠিক ইমেইল ঠিকানা লিখুন।";
      setErrorMessage(message);
      showToast(message, "error");
      return;
    }
    if (password.length < 8) {
      const message = "পাসওয়ার্ড অন্তত ৮ অক্ষরের হতে হবে।";
      setErrorMessage(message);
      showToast(message, "error");
      return;
    }
    if (password !== confirmPassword) {
      const message = "দুটি পাসওয়ার্ড একই হতে হবে।";
      setErrorMessage(message);
      showToast(message, "error");
      return;
    }

    setIsLoading(true);

    try {
      const result = await authClient.signUp.email({
        name,
        email,
        password,
      });

      if (result.error) {
        const message =
          result.error.message ?? "অ্যাকাউন্ট তৈরি করা যায়নি।";
        setErrorMessage(message);
        showToast(message, "error");
        return;
      }

      showToast("অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে। এখন সাইন ইন করুন।", "success");
      router.push("/signin");
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
        নাম
        <input
          name="name"
          type="text"
          autoComplete="name"
          placeholder="যেমন: রহিম উদ্দিন"
          minLength={2}
          required
          disabled={isLoading}
          className="mt-1.5 h-11 w-full rounded-lg border border-[#dce4dd] bg-[#fbfcfb] px-3 text-sm outline-none focus:border-[#14915b] focus:ring-2 focus:ring-[#14915b]/15 disabled:opacity-60"
        />
      </label>

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
          autoComplete="new-password"
          placeholder="কমপক্ষে ৮ অক্ষর"
          minLength={8}
          required
          disabled={isLoading}
          className="mt-1.5 h-11 w-full rounded-lg border border-[#dce4dd] bg-[#fbfcfb] px-3 text-sm outline-none focus:border-[#14915b] focus:ring-2 focus:ring-[#14915b]/15 disabled:opacity-60"
        />
      </label>

      <label className="block text-sm font-medium text-[#26312d]">
        পাসওয়ার্ড নিশ্চিত করুন
        <input
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="আবার লিখুন"
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
        {isLoading ? "অপেক্ষা করুন..." : "অ্যাকাউন্ট তৈরি করুন"}
      </button>

      <SocialAuthButtons mode="signup" />
    </form>
  );
}