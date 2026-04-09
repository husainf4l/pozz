import { Pricing } from "@/components/pricing";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <div className="pt-24">
        <Pricing />
      </div>
      <Footer />
    </>
  );
}
