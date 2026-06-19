import Preloader from "@/components/Preloader";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Stats from "@/components/Stats";
import Products from "@/components/Products";
import Industries from "@/components/Industries";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";

export default function Home() {
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
        <Contact />
      </main>
    </>
  );
}
