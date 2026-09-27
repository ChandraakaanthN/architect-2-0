import { LandingNavbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { DualAudience } from "@/components/landing/dual-audience";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { LandingFooter } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <LandingNavbar />
      <main className="flex-1">
        <Hero />
        <DualAudience />
        <Features />
        <HowItWorks />
      </main>
      <LandingFooter />
    </div>
  );
}
