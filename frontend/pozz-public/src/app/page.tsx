import { Hero } from "@/components/ui/hero-1";
import { Features } from "@/components/features";
import { Benefits } from "@/components/benefits";
import { Stats } from "@/components/stats";
import { CTA } from "@/components/cta";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { AUTH_CONFIG } from "@/lib/config";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero
        title="Fundraising. Simplified."
        subtitle="Track investors, measure outreach, and close deals—all in one place."
        eyebrow="For Startups"
        ctaLabel="Get Started"
        ctaHref={AUTH_CONFIG.SIGNUP_URL}
      />
      <Features />
      <Benefits />
      <Stats />
      <CTA />
      <Footer />
    </>
  );
}
