import { Hero } from "@/components/ui/hero-1";
import { Features } from "@/components/features";
import { Benefits } from "@/components/benefits";
import { HowItWorks } from "@/components/how-it-works";
import { Stats } from "@/components/stats";
import { Testimonials } from "@/components/testimonials";
import { CTA } from "@/components/cta";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Hero
        title="Fundraising. Simplified."
        subtitle="Track investors, measure outreach, and close deals—all in one place."
        eyebrow="For Startups"
        ctaLabel="Get Started"
        ctaHref="/signup"
      />
      <Features />
      <Benefits />
      <HowItWorks />
      <Stats />
      <Testimonials />
      <CTA />
      <Footer />
    </>
  );
}
