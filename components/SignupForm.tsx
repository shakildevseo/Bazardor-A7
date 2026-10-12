"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "অ্যাকাউন্ট তৈরি করা যায়নি। আবার চেষ্টা করুন।";
}

export default function SignupForm() {
  const router = useRouter();
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
      setErrorMessage("নাম অন্তত ২ অক্ষরের হতে হবে।");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage("সঠিক ইমেইল ঠিকানা লিখুন।");
      return;
    }
    if (password.length < 8) {
      setErrorMessage("পাসওয়ার্ড অন্তত ৮ অক্ষরের হতে হবে।");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("দুটি পাসওয়ার্ড একই হতে হবে।");
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
        setErrorMessage(result.error.message ?? "অ্যাকাউন্ট তৈরি করা যায়নি।");
        return;
      }

      router.push("/signin");
      router.refresh();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
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
        className="flex h-11 w-full items-center justify-center rounded-lg bg-[#078c4b] text-sm font-bold text-white transition hover:bg-[#067b42] disabled:cursor-wait disabled:opacity-70"
      >
        {isLoading ? "অপেক্ষা করুন..." : "অ্যাকাউন্ট তৈরি করুন"}
      </button>
    </form>
  );
}