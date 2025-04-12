import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";

import { Navbar } from "./_components/navbar";
import { Hero } from "./_components/hero";
import { FeatureSection } from "./_components/feature-selection";
import { TestimonialSection } from "./_components/testimonial";
import { Footer } from "./_components/footer";

export default async function Home() {
  const session = await auth();

  return (
    <HydrateClient>
      <main className="min-h-screen bg-gradient-to-br from-blue-100 to-yellow-100 text-gray-800">
        <Navbar session={session} />
        <Hero />
        <FeatureSection />
        <TestimonialSection />
        <Footer />
      </main>
    </HydrateClient>
  );
}
