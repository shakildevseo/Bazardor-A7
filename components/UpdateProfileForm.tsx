"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useToast } from "@/components/ToastProvider";

type UpdateProfileFormProps = {
  initialName: string;
};

export default function UpdateProfileForm({
  initialName,
}: UpdateProfileFormProps) {
  const router = useRouter();
  const showToast = useToast();
  const [name, setName] = useState(initialName);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const updatedName = name.trim();

    if (updatedName.length < 2) {
      showToast("নাম অন্তত ২ অক্ষরের হতে হবে।", "error");
      return;
    }

    if (updatedName === initialName) {
      showToast("নামে কোনো পরিবর্তন করা হয়নি।", "error");
      return;
    }

    setIsLoading(true);

    try {
      const result = await authClient.updateUser({ name: updatedName });
      if (result.error) {
        showToast(result.error.message ?? "তথ্য আপডেট করা যায়নি।", "error");
        return;
      }

      showToast("আপনার নাম সফলভাবে আপডেট হয়েছে।", "success");
      router.push("/profile");
      router.refresh();
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "তথ্য আপডেট করা যায়নি। আবার চেষ্টা করুন।",
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
      <label className="block text-sm font-medium text-[#26312d]">
        নাম
        <input
          name="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          minLength={2}
          disabled={isLoading}
          className="mt-1.5 h-11 w-full rounded-lg border border-[#dce4dd] bg-[#fbfcfb] px-3 text-sm outline-none focus:border-[#14915b] focus:ring-2 focus:ring-[#14915b]/15 disabled:opacity-60"
        />
      </label>

      <button
        type="submit"
        disabled={isLoading}
        className="flex min-h-11 w-full items-center justify-center rounded-xl bg-[#078c4b] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#067b42] disabled:cursor-wait disabled:opacity-70"
      >
        {isLoading ? "আপডেট হচ্ছে..." : "তথ্য আপডেট করুন"}
      </button>
    </form>
  );
}