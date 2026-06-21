import { getSettings } from "@/lib/settings-server";
import { saveSettings } from "@/lib/actions/settings-actions";

export const dynamic = "force-dynamic";

const input =
  "w-full rounded-lg border border-white/10 bg-ink/60 px-3 py-2 text-sm outline-none focus:border-gold";
const label = "mb-1.5 block text-xs uppercase tracking-[0.15em] text-muted";

function Field({
  name,
  label: lab,
  defaultValue,
  placeholder,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className={label}>{lab}</label>
      <input name={name} defaultValue={defaultValue} placeholder={placeholder} className={input} />
    </div>
  );
}

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const s = await getSettings();
  const { saved } = await searchParams;

  return (
    <div className="max-w-3xl">
      <h1 className="font-heading text-3xl font-bold">Website &amp; Business Settings</h1>
      <p className="mt-1 text-sm text-muted">
        These appear across your website and on your printed bills. Changes go live as soon as you save.
      </p>

      {saved && (
        <div className="mt-4 rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
          ✓ Saved. Your website and bills are updated.
        </div>
      )}

      <form action={saveSettings} className="mt-8 space-y-10">
        {/* Business */}
        <section className="space-y-4 rounded-2xl border border-white/10 bg-ink-soft/40 p-6">
          <h2 className="font-heading text-lg font-bold">Business</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="name" label="Short name" defaultValue={s.name} placeholder="Mahadev APF" />
            <Field name="legalName" label="Full / legal name" defaultValue={s.legalName} />
          </div>
          <Field name="tagline" label="Tagline" defaultValue={s.tagline} />
          <div>
            <label className={label}>Short intro (1–2 lines)</label>
            <textarea name="intro" defaultValue={s.intro} rows={3} className={input} />
          </div>
        </section>

        {/* Branding & reviews */}
        <section className="space-y-4 rounded-2xl border border-white/10 bg-ink-soft/40 p-6">
          <h2 className="font-heading text-lg font-bold">Logo &amp; Reviews</h2>
          <input type="hidden" name="logoUrl" defaultValue={s.logoUrl} />
          <div>
            <label className={label}>Shop logo</label>
            {s.logoUrl && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={s.logoUrl}
                alt="Current logo"
                className="mb-2 h-12 w-auto rounded bg-white/10 p-1"
              />
            )}
            <input
              name="logo"
              type="file"
              accept="image/*"
              className="w-full text-sm text-muted file:mr-3 file:rounded-full file:border-0 file:bg-gold file:px-4 file:py-2 file:text-sm file:font-semibold file:text-ink"
            />
            <p className="mt-1 text-xs text-muted">
              Optional. Shown in the header, footer and on bills. Leave empty to use the letter mark.
            </p>
          </div>
          <div>
            <label className={label}>Google review link</label>
            <input
              name="googleReviewUrl"
              defaultValue={s.googleReviewUrl}
              placeholder="https://g.page/r/…  (your 'write a review' link)"
              className={input}
            />
            <p className="mt-1 text-xs text-muted">
              Adds a &ldquo;Review us on Google&rdquo; button on the website.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="space-y-4 rounded-2xl border border-white/10 bg-ink-soft/40 p-6">
          <h2 className="font-heading text-lg font-bold">Contact</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="phone" label="Phone" defaultValue={s.phone} placeholder="+91 90000 00000" />
            <Field name="whatsapp" label="WhatsApp number (digits only)" defaultValue={s.whatsapp} placeholder="919000000000" />
            <Field name="email" label="Email" defaultValue={s.email} />
            <Field name="address" label="Address" defaultValue={s.address} />
          </div>
        </section>

        {/* GST / invoice */}
        <section className="space-y-4 rounded-2xl border border-white/10 bg-ink-soft/40 p-6">
          <h2 className="font-heading text-lg font-bold">GST &amp; Invoice</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field name="gstin" label="GSTIN" defaultValue={s.gstin} />
            <Field name="pan" label="PAN" defaultValue={s.pan} />
            <Field name="invoicePrefix" label="Invoice prefix" defaultValue={s.invoicePrefix} placeholder="MAPF" />
          </div>
        </section>

        {/* Bank */}
        <section className="space-y-4 rounded-2xl border border-white/10 bg-ink-soft/40 p-6">
          <h2 className="font-heading text-lg font-bold">Bank details (shown on tax invoices)</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="bankName" label="Bank name" defaultValue={s.bankName} />
            <Field name="bankAccount" label="Account number" defaultValue={s.bankAccount} />
            <Field name="bankIfsc" label="IFSC" defaultValue={s.bankIfsc} />
            <Field name="bankHolder" label="Account holder" defaultValue={s.bankHolder} />
          </div>
        </section>

        {/* Terms */}
        <section className="space-y-4 rounded-2xl border border-white/10 bg-ink-soft/40 p-6">
          <h2 className="font-heading text-lg font-bold">Invoice terms &amp; conditions</h2>
          <Field name="term1" label="Term 1" defaultValue={s.terms[0] ?? ""} />
          <Field name="term2" label="Term 2" defaultValue={s.terms[1] ?? ""} />
          <Field name="term3" label="Term 3" defaultValue={s.terms[2] ?? ""} />
        </section>

        {/* Homepage hero */}
        <section className="space-y-4 rounded-2xl border border-white/10 bg-ink-soft/40 p-6">
          <h2 className="font-heading text-lg font-bold">Homepage — big headline</h2>
          <Field name="heroBadge" label="Small badge above headline" defaultValue={s.heroBadge} />
          <div className="grid gap-4 sm:grid-cols-3">
            <Field name="heroLine1" label="Headline line 1" defaultValue={s.heroLine1} />
            <Field name="heroLine2" label="Line 2 (gold)" defaultValue={s.heroLine2} />
            <Field name="heroLine3" label="Headline line 3" defaultValue={s.heroLine3} />
          </div>
          <div>
            <label className={label}>Intro line under the headline</label>
            <textarea name="heroIntro" defaultValue={s.heroIntro} rows={2} className={input} />
          </div>
        </section>

        {/* Homepage about */}
        <section className="space-y-4 rounded-2xl border border-white/10 bg-ink-soft/40 p-6">
          <h2 className="font-heading text-lg font-bold">Homepage — about section</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="aboutHeading" label="Heading start" defaultValue={s.aboutHeading} />
            <Field name="aboutHeadingGold" label="Heading highlight (gold)" defaultValue={s.aboutHeadingGold} />
          </div>
          <div>
            <label className={label}>Paragraph 1</label>
            <textarea name="aboutPara1" defaultValue={s.aboutPara1} rows={3} className={input} />
          </div>
          <div>
            <label className={label}>Paragraph 2</label>
            <textarea name="aboutPara2" defaultValue={s.aboutPara2} rows={3} className={input} />
          </div>
        </section>

        {/* Homepage stats */}
        <section className="space-y-4 rounded-2xl border border-white/10 bg-ink-soft/40 p-6">
          <h2 className="font-heading text-lg font-bold">Homepage — number counters</h2>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_2fr]">
              <div>
                <label className={label}>Number {i + 1}</label>
                <input name={`stat${i}value`} type="number" defaultValue={s.stats[i]?.value ?? 0} className={input} />
              </div>
              <div>
                <label className={label}>Suffix (e.g. +)</label>
                <input name={`stat${i}suffix`} defaultValue={s.stats[i]?.suffix ?? ""} className={input} />
              </div>
              <div>
                <label className={label}>Label</label>
                <input name={`stat${i}label`} defaultValue={s.stats[i]?.label ?? ""} className={input} />
              </div>
            </div>
          ))}
        </section>

        <div className="sticky bottom-0 -mx-1 bg-ink/80 py-3 backdrop-blur">
          <button className="w-full rounded-full bg-gold py-3 text-sm font-semibold text-ink hover:bg-gold-soft sm:w-auto sm:px-10">
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
}
