import { Hero } from "@/components/ui/hero-1";
import { Features } from "@/components/features";

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
    </>
  );
}
