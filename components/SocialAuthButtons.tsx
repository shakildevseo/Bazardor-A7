"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useToast } from "@/components/ToastProvider";

type SocialAuthButtonsProps = {
  mode: "signin" | "signup";
  callbackURL?: string;
};

export default function SocialAuthButtons({
  mode,
  callbackURL = "/",
}: SocialAuthButtonsProps) {
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const showToast = useToast();

  async function handleSocialSignIn(provider: "google" | "github") {
    setErrorMessage("");
    setIsLoading(true);

    try {
      const result = await authClient.signIn.social({
        provider,
        requestSignUp: mode === "signup",
        callbackURL,
        errorCallbackURL:
          mode === "signin"
            ? "/signin?socialError=signup-required"
            : "/signup?socialError=oauth-failed",
      });

      if (result.error) {
        const message =
          result.error.message ??
          "সোশ্যাল সাইন ইন করা যায়নি। আবার চেষ্টা করুন।";
        setErrorMessage(message);
        showToast(message, "error");
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "সোশ্যাল সাইন ইন করা যায়নি। আবার চেষ্টা করুন।";
      setErrorMessage(message);
      showToast(message, "error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-xs text-[#7a8580]">
        <span className="h-px flex-1 bg-[#dfe7e0]" />
        অথবা
        <span className="h-px flex-1 bg-[#dfe7e0]" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled={isLoading}
          onClick={() => void handleSocialSignIn("google")}
          className="flex min-h-10 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-[#dce4dd] bg-[#fbfcfb] px-2 text-xs font-semibold text-[#303a36] transition hover:bg-[#f1f5f2] disabled:cursor-wait disabled:opacity-60 sm:text-sm"
        >
          <svg aria-hidden="true" viewBox="0 0 48 48" className="size-4">
            <path
              fill="#FFC107"
              d="M43.6 20.5H42V20H24v8h11.3A12 12 0 1 1 32 15.1l5.7-5.7A20 20 0 1 0 44 24c0-1.2-.1-2.4-.4-3.5Z"
            />
            <path
              fill="#FF3D00"
              d="m6.3 14.8 6.6 4.8A12 12 0 0 1 32 15.1l5.7-5.7a20 20 0 0 0-31.4 5.4Z"
            />
            <path
              fill="#4CAF50"
              d="M24 44a20 20 0 0 0 13.5-5.2l-6.2-5.2A12 12 0 0 1 12.8 28l-6.5 5A20 20 0 0 0 24 44Z"
            />
            <path
              fill="#1976D2"
              d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4 5.6l6.2 5.2A20 20 0 0 0 44 24c0-1.2-.1-2.4-.4-3.5Z"
            />
          </svg>
          Google দিয়ে চালিয়ে যান
        </button>
        <button
          type="button"
          disabled={isLoading}
          onClick={() => void handleSocialSignIn("github")}
          className="flex min-h-10 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-[#dce4dd] bg-[#fbfcfb] px-2 text-xs font-semibold text-[#303a36] transition hover:bg-[#f1f5f2] disabled:cursor-wait disabled:opacity-60 sm:text-sm"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-4"
          >
            <path d="M12 .9a11.1 11.1 0 0 0-3.5 21.6c.6.1.8-.2.8-.5v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.6-1.3-1.6-1.1-.8.1-.8.1-.8 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1 .8 2v3c0 .3.2.6.8.5A11.1 11.1 0 0 0 12 .9Z" />
          </svg>
          GitHub দিয়ে চালিয়ে যান
        </button>
      </div>

      {errorMessage && (
        <p role="alert" className="text-sm text-[#b9382e]">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
