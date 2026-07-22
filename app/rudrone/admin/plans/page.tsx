import type { Metadata } from "next";
import { requireSuperAdmin } from "@/lib/superadmin";
import { PLANS, PLAN_ORDER, type Feature } from "@/lib/plans";
import { PLATFORM } from "@/lib/platform";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: `${PLATFORM.name} — Plans`, robots: { index: false } };

const FEATURE_LABEL: Record<Feature, string> = {
  invoices: "GST billing",
  reports: "Reports",
  estimates: "Quotations",
  whatsappShare: "WhatsApp sharing",
  multiUser: "Staff accounts",
  website: "Website",
  gallery: "Gallery",
  reviews: "Reviews",
  customDomain: "Custom domain",
  removeBranding: "Remove branding",
  prioritySupport: "Priority support",
};

function limitText(n: number): string {
  return n < 0 ? "Unlimited" : String(n);
}

export default async function PlansPage() {
  await requireSuperAdmin();

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-bold">Plans</h1>
        <p className="mt-1 text-sm text-muted">
          What each subscription tier unlocks. These drive access across every business — a business&apos;s
          plan is set on the Businesses tab.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {PLAN_ORDER.map((id) => {
          const plan = PLANS[id];
          return (
            <div key={id} className="flex flex-col rounded-2xl border border-white/10 bg-ink-soft/40 p-5">
              <div className="flex items-baseline justify-between">
                <h2 className="font-heading text-xl font-bold">{plan.name}</h2>
                <span className="font-heading text-lg font-bold text-gold">
                  {plan.priceInr === null ? "Custom" : plan.priceInr === 0 ? "Free" : `₹${plan.priceInr}`}
                  {plan.priceInr ? <span className="text-xs font-normal text-muted">/mo</span> : null}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted">{plan.blurb}</p>

              <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl border border-white/10 bg-ink/40 p-3 text-center">
                <div>
                  <p className="text-xs text-muted">Invoices/mo</p>
                  <p className="font-heading font-bold">{limitText(plan.limits.invoicesPerMonth)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted">Users</p>
                  <p className="font-heading font-bold">{limitText(plan.limits.users)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted">Storage</p>
                  <p className="font-heading font-bold">{plan.limits.storageMb < 0 ? "∞" : `${plan.limits.storageMb}MB`}</p>
                </div>
              </div>

              <ul className="mt-4 grid gap-1.5 text-sm">
                {(Object.keys(FEATURE_LABEL) as Feature[]).map((f) => {
                  const on = plan.features.includes(f);
                  return (
                    <li key={f} className={`flex items-center gap-2 ${on ? "" : "text-muted/50"}`}>
                      <span className={on ? "text-gold" : "text-muted/40"}>{on ? "✓" : "·"}</span>
                      {FEATURE_LABEL[f]}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
