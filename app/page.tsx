import Preloader from "@/components/Preloader";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Stats from "@/components/Stats";
import Products from "@/components/Products";
import Industries from "@/components/Industries";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import { getSettings } from "@/lib/settings-server";

export default async function Home() {
  const site = await getSettings();
  return (
    <>
      <Preloader />
      <main>
        <Hero />
        <About />
        <Stats />
        <Products />
        <Industries />
        <WhyChooseUs />
        <Testimonials />
        <Contact site={site} />
      </main>
    </>
  );
}
