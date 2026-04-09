import { About } from "@/components/about";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <div className="pt-24">
        <About />
      </div>
      <Footer />
    </>
  );
}
