import { getSettings } from "@/lib/settings-server";
import { gateFeature } from "@/lib/entitlements";
import { setSiteTheme } from "@/lib/actions/settings-actions";
import { THEMES, getTheme } from "@/lib/themes";

export const dynamic = "force-dynamic";

export default async function AppearancePage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  await gateFeature("website");
  const { saved } = await searchParams;
  const settings = await getSettings();
  const current = getTheme(settings.theme).id;

  return (
    <div>
      <h1 className="mb-1 font-heading text-3xl font-bold">Appearance</h1>
      <p className="mb-6 text-sm text-muted">
        Pick a theme for your website. It re-skins your whole site instantly — your content stays exactly the same.
      </p>

      {saved && (
        <div className="mb-6 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-2.5 text-sm text-emerald-300">
          Theme updated — open your site to see it live.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {THEMES.map((t) => {
          const active = t.id === current;
          const c = t.colors;
          return (
            <form key={t.id} action={setSiteTheme}>
              <input type="hidden" name="theme" value={t.id} />
              <button
                type="submit"
                className={`w-full overflow-hidden rounded-2xl border text-left transition-colors ${
                  active ? "border-gold ring-1 ring-gold" : "border-white/10 hover:border-white/25"
                }`}
              >
                {/* Live swatch rendered in the theme's own colours */}
                <div className="p-4" style={{ background: c.ink }}>
                  <div
                    className="flex items-center gap-2 rounded-xl p-3"
                    style={{ background: c.panel }}
                  >
                    <span
                      className="grid h-8 w-8 place-items-center rounded-lg text-sm font-bold"
                      style={{ background: c.gold, color: c.ink }}
                    >
                      A
                    </span>
                    <div className="flex-1">
                      <div className="h-2 w-2/3 rounded-full" style={{ background: c.paper, opacity: 0.9 }} />
                      <div className="mt-1.5 h-2 w-1/2 rounded-full" style={{ background: c.muted }} />
                    </div>
                    <span
                      className="rounded-full px-2.5 py-1 text-[10px] font-semibold"
                      style={{ background: c.gold, color: c.ink }}
                    >
                      Button
                    </span>
                  </div>
                  <div className="mt-3 flex gap-1.5">
                    {[c.gold, c.goldSoft, c.paper, c.muted].map((col, i) => (
                      <span key={i} className="h-4 w-4 rounded-full ring-1 ring-white/10" style={{ background: col }} />
                    ))}
                  </div>
                </div>

                <div className="flex items-start justify-between gap-2 bg-ink-soft/40 p-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading text-base font-bold">{t.name}</h3>
                      {t.id === "artisan" && (
                        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-muted">{t.blurb}</p>
                  </div>
                  <span className={`mt-0.5 shrink-0 text-sm ${active ? "text-gold" : "text-muted"}`}>
                    {active ? "● Active" : "Use"}
                  </span>
                </div>
              </button>
            </form>
          );
        })}
      </div>
    </div>
  );
}
