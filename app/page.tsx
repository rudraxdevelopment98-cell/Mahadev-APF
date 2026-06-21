import Preloader from "@/components/Preloader";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Stats from "@/components/Stats";
import Products from "@/components/Products";
import Industries from "@/components/Industries";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import Gallery from "@/components/Gallery";
import Contact from "@/components/Contact";
import { getSettings } from "@/lib/settings-server";
import { getGallery } from "@/lib/gallery-server";
import { getReviews } from "@/lib/reviews-server";

export default async function Home() {
  const [site, gallery, reviews] = await Promise.all([
    getSettings(),
    getGallery(),
    getReviews(),
  ]);
  return (
    <>
      <Preloader />
      <main>
        <Hero site={site} />
        <About site={site} />
        <Stats stats={site.stats} />
        <Products />
        <Industries />
        <WhyChooseUs />
        <Gallery items={gallery} />
        <Testimonials reviews={reviews} googleUrl={site.googleReviewUrl} />
        <Contact site={site} />
      </main>
    </>
  );
}
