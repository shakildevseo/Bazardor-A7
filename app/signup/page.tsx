import Link from "next/link";
import Navbar from "@/components/Navbar";
import SignupForm from "@/components/SignupForm";
import PriceTicker from "@/components/PriceTicker";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#edf3ee] text-[#202825]">
      <Navbar ticker={<PriceTicker />} />

      <main className="flex flex-1 flex-col items-center px-3 py-8">
        <header className="mb-4 text-center">
          <h1 className="text-2xl font-black">অ্যাকাউন্ট তৈরি করুন</h1>
          <p className="mt-2 text-sm text-[#7a8580]">
            ইমেইল দিয়ে নতুন অ্যাকাউন্ট খুলুন।
          </p>
        </header>

        <section className="w-full max-w-md rounded-2xl border border-[#dfe7e0] bg-[#f8faf8] p-5 shadow-sm sm:p-6">
          <SignupForm />
        </section>

        <p className="mt-5 text-sm text-[#64706b]">
          অ্যাকাউন্ট আছে?{" "}
          <Link
            href="/signin"
            className="cursor-pointer font-semibold text-[#0b9857] hover:underline"
          >
            সাইন ইন করুন
          </Link>
        </p>
      </main>
    </div>
  );
}