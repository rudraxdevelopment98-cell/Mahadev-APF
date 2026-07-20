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
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSettings } from "@/lib/settings-server";
import { getGallery } from "@/lib/gallery-server";
import { getReviews } from "@/lib/reviews-server";
import { getSpaces } from "@/lib/spaces-server";
import { isPortalHost } from "@/lib/host";

export default async function Home() {
  // On the RudrOne portal host, the homepage is the platform landing, not a
  // business site.
  if (isPortalHost((await headers()).get("host"))) redirect("/rudrone");

  const [site, gallery, reviews, spaces] = await Promise.all([
    getSettings(),
    getGallery(),
    getReviews(),
    getSpaces(),
  ]);
  return (
    <>
      <Preloader />
      <main>
        <Hero site={site} />
        <About site={site} />
        <Stats stats={site.stats} />
        <Products />
        <Industries spaces={spaces} />
        <WhyChooseUs />
        <Gallery items={gallery} />
        <Testimonials reviews={reviews} googleUrl={site.googleReviewUrl} />
        <Contact site={site} />
      </main>
    </>
  );
}
