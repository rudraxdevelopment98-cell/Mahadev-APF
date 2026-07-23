import { Fragment } from "react";
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
import { normalizeSections } from "@/lib/sections";

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

  // Which homepage sections this business shows, and in what order.
  const sections: Record<string, React.ReactNode> = {
    hero: <Hero site={site} />,
    about: <About site={site} />,
    stats: <Stats stats={site.stats} />,
    products: <Products />,
    industries: <Industries spaces={spaces} />,
    why: <WhyChooseUs />,
    gallery: <Gallery items={gallery} />,
    testimonials: <Testimonials reviews={reviews} googleUrl={site.googleReviewUrl} />,
    contact: <Contact site={site} />,
  };
  const enabled = normalizeSections(site.sections);

  return (
    <>
      <Preloader />
      <main>
        {enabled.map((key) => (
          <Fragment key={key}>{sections[key]}</Fragment>
        ))}
      </main>
    </>
  );
}
