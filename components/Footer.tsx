import Link from "next/link";
import { nav } from "@/lib/data";
import type { SiteSettings } from "@/lib/settings";

export default function Footer({ site }: { site: SiteSettings }) {
  return (
    <footer className="border-t border-white/10 bg-ink">
      <div className="container-px py-16">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-lg border border-gold/50 font-heading text-sm font-bold text-gold">
                {site.name.charAt(0) || "M"}
              </span>
              <span className="font-heading text-lg font-bold">{site.name}</span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
              {site.intro}
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-muted">
              Navigate
            </h4>
            <ul className="mt-5 space-y-3 text-sm">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-muted hover:text-gold">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-muted">
              Contact
            </h4>
            <ul className="mt-5 space-y-3 text-sm text-muted">
              <li>
                <a href={`mailto:${site.email}`} className="hover:text-gold">
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${site.phone.replace(/\s/g, "")}`}
                  className="hover:text-gold"
                >
                  {site.phone}
                </a>
              </li>
              <li className="max-w-xs">{site.address}</li>
            </ul>
          </div>
        </div>

        <div className="hairline my-12" />

        <div className="flex flex-col items-center justify-between gap-4 text-xs text-muted md:flex-row">
          <p>
            © {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gold">
              Privacy
            </a>
            <a href="#" className="hover:text-gold">
              Terms
            </a>
            <a href="#" className="hover:text-gold">
              Careers
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
