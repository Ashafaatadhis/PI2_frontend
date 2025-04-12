// components/Hero.tsx
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const Hero = () => (
  <section className="flex h-[100vh] flex-col items-center justify-center px-6 text-center">
    <h2 className="text-5xl font-bold text-blue-800 md:text-6xl">
      Find Your Daily Balance
    </h2>
    <p className="mt-6 max-w-2xl text-lg text-gray-700">
      An AI-powered companion to help you track your habits, monitor stress, and
      maintain a healthy lifestyle.
    </p>
    <Link href="/dashboard">
      <Button className="mt-8 bg-yellow-400 px-8 py-6 text-lg font-semibold text-blue-900 hover:bg-yellow-500">
        Get Started
      </Button>
    </Link>
  </section>
);
