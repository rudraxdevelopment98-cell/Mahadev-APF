"use client";

import { useState } from "react";
import { PLATFORM } from "@/lib/platform";

/**
 * The RudrOne portal landing (marketing + pricing + sign-up CTA). Fully
 * self-contained and scoped under `.ro` so it never touches the business
 * sites' styles. Shown at /rudrone and on the RudrOne portal host.
 */

const CSS = `
.ro{
  --bg:#15120e;--panel:#1e1a14;--panel-2:#241f17;--text:#f3ece0;--muted:#a99a83;
  --gold:#e7b34d;--gold-soft:#f2ca79;--ember:#e4622d;--line:rgba(240,220,180,.12);
  --line-strong:rgba(240,220,180,.22);--good:#6cc39a;--shadow:0 24px 60px -30px rgba(0,0,0,.7);
  --sans:system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  --mono:ui-monospace,"SF Mono","Cascadia Mono",Menlo,Consolas,monospace;
  --radius:18px;--page:1120px;
  background:var(--bg);color:var(--text);font-family:var(--sans);line-height:1.6;
  min-height:100vh;-webkit-font-smoothing:antialiased;overflow-x:hidden;
}
@media (prefers-color-scheme:light){.ro:not([data-theme]){
  --bg:#f6f1e7;--panel:#fffdf8;--panel-2:#fbf5eb;--text:#221c14;--muted:#6f6252;
  --gold:#a5711c;--gold-soft:#b9832a;--ember:#bf4c1a;--line:rgba(40,30,10,.1);
  --line-strong:rgba(40,30,10,.18);--good:#2e7d55;--shadow:0 24px 50px -32px rgba(60,40,10,.4);
}}
.ro[data-theme="light"]{
  --bg:#f6f1e7;--panel:#fffdf8;--panel-2:#fbf5eb;--text:#221c14;--muted:#6f6252;
  --gold:#a5711c;--gold-soft:#b9832a;--ember:#bf4c1a;--line:rgba(40,30,10,.1);
  --line-strong:rgba(40,30,10,.18);--good:#2e7d55;--shadow:0 24px 50px -32px rgba(60,40,10,.4);
}
.ro *{box-sizing:border-box;}
.ro .wrap{max-width:var(--page);margin:0 auto;padding:0 24px;}
.ro a{color:inherit;text-decoration:none;}
.ro .glow{position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:0;}
.ro .glow::before{content:"";position:absolute;top:-260px;left:50%;transform:translateX(-50%);
  width:900px;height:620px;opacity:.8;
  background:radial-gradient(closest-side,color-mix(in srgb,var(--gold) 22%,transparent),transparent 70%);}
.ro .glow::after{content:"";position:absolute;top:-120px;right:-120px;width:460px;height:460px;
  background:radial-gradient(closest-side,color-mix(in srgb,var(--ember) 16%,transparent),transparent 70%);}
.ro .eyebrow{font-family:var(--mono);font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:var(--gold);}
.ro .rohead{position:sticky;top:0;z-index:20;backdrop-filter:blur(12px);
  background:color-mix(in srgb,var(--bg) 82%,transparent);border-bottom:1px solid var(--line);}
.ro .bar{display:flex;align-items:center;justify-content:space-between;height:66px;}
.ro .brand{display:flex;align-items:center;gap:11px;font-weight:800;letter-spacing:-.02em;font-size:19px;}
.ro .mark{width:34px;height:34px;border-radius:10px;display:grid;place-items:center;
  background:linear-gradient(150deg,var(--gold),var(--ember));color:#1a1305;font-size:18px;
  box-shadow:0 6px 18px -6px color-mix(in srgb,var(--gold) 60%,transparent);}
.ro .brand b{color:var(--gold);}
.ro nav.top{display:flex;align-items:center;gap:26px;}
.ro nav.top .lnk{color:var(--muted);font-size:14px;font-weight:500;}
.ro nav.top .lnk:hover{color:var(--text);}
.ro .btn{font-family:var(--sans);font-weight:650;font-size:14px;cursor:pointer;border-radius:999px;
  padding:10px 18px;border:1px solid transparent;transition:transform .15s ease,background .15s ease,border-color .15s ease;display:inline-block;}
.ro .btn-primary{background:var(--gold);color:#1a1305;}
.ro .btn-primary:hover{background:var(--gold-soft);transform:translateY(-1px);}
.ro .btn-ghost{background:transparent;border-color:var(--line-strong);color:var(--text);}
.ro .btn-ghost:hover{border-color:var(--gold);color:var(--gold);}
.ro .btn-ember{background:var(--ember);color:#fff;}
.ro .btn-ember:hover{filter:brightness(1.06);transform:translateY(-1px);}
.ro .toggle{width:38px;height:38px;border-radius:10px;display:grid;place-items:center;background:var(--panel);
  border:1px solid var(--line-strong);cursor:pointer;color:var(--text);font-size:15px;}
.ro .toggle:hover{border-color:var(--gold);}
.ro .top-actions{display:flex;align-items:center;gap:12px;}
@media (max-width:760px){.ro nav.top .lnk{display:none;}}
.ro .hero{position:relative;padding:84px 0 54px;}
.ro .hero-inner{position:relative;z-index:1;display:grid;grid-template-columns:1.05fr .95fr;gap:54px;align-items:center;}
.ro h1{font-size:clamp(38px,6vw,60px);line-height:1.02;letter-spacing:-.035em;font-weight:820;margin:18px 0 0;text-wrap:balance;}
.ro h1 .accent{color:var(--gold);}
.ro .lede{color:var(--muted);font-size:19px;max-width:40ch;margin:20px 0 0;}
.ro .cta-row{display:flex;gap:13px;margin-top:30px;flex-wrap:wrap;}
.ro .btn-lg{padding:13px 24px;font-size:15.5px;}
.ro .microline{margin-top:18px;font-size:13px;color:var(--muted);display:flex;align-items:center;gap:8px;}
.ro .dot{width:6px;height:6px;border-radius:50%;background:var(--good);box-shadow:0 0 0 4px color-mix(in srgb,var(--good) 20%,transparent);}
@media (max-width:900px){.ro .hero-inner{grid-template-columns:1fr;gap:36px;}.ro .lede{max-width:60ch;}}
.ro .mock{border-radius:var(--radius);overflow:hidden;border:1px solid var(--line-strong);background:var(--panel);box-shadow:var(--shadow);}
.ro .mock-bar{display:flex;align-items:center;gap:8px;padding:11px 14px;border-bottom:1px solid var(--line);background:var(--panel-2);}
.ro .mock-bar i{width:10px;height:10px;border-radius:50%;background:var(--line-strong);display:inline-block;}
.ro .url{margin-left:10px;flex:1;font-family:var(--mono);font-size:12px;color:var(--muted);
  background:var(--bg);border:1px solid var(--line);border-radius:7px;padding:5px 10px;}
.ro .url b{color:var(--gold);font-weight:600;}
.ro .mock-body{padding:18px;}
.ro .inv-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;}
.ro .inv-title{font-weight:750;font-size:15px;}
.ro .inv-sub{color:var(--muted);font-size:12px;}
.ro .pill{font-family:var(--mono);font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;padding:4px 9px;border-radius:999px;
  background:color-mix(in srgb,var(--good) 16%,transparent);color:var(--good);border:1px solid color-mix(in srgb,var(--good) 30%,transparent);}
.ro .rows{margin-top:14px;border-top:1px dashed var(--line-strong);}
.ro .row{display:flex;justify-content:space-between;padding:9px 0;border-bottom:1px dashed var(--line);font-size:13px;}
.ro .row span:last-child{font-variant-numeric:tabular-nums;color:var(--muted);}
.ro .inv-total{display:flex;justify-content:space-between;padding-top:12px;font-weight:750;}
.ro .inv-total .amt{color:var(--gold);font-variant-numeric:tabular-nums;}
.ro .mock-foot{display:flex;gap:8px;margin-top:16px;flex-wrap:wrap;}
.ro .chip{font-size:11.5px;font-family:var(--mono);color:var(--muted);border:1px solid var(--line);border-radius:7px;padding:5px 9px;}
.ro .proof{border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:22px 0;}
.ro .proof-in{display:flex;align-items:center;justify-content:center;gap:14px;flex-wrap:wrap;color:var(--muted);font-size:13.5px;}
.ro .proof-in b{color:var(--text);}
.ro .liveflag{font-family:var(--mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);
  border:1px solid var(--line-strong);border-radius:999px;padding:4px 11px;}
.ro section.block{padding:76px 0;}
.ro .head{max-width:46ch;}
.ro .head h2{font-size:clamp(26px,3.6vw,34px);letter-spacing:-.025em;margin:12px 0 0;font-weight:780;text-wrap:balance;}
.ro .head p{color:var(--muted);margin:12px 0 0;}
.ro .features{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:40px;}
@media (max-width:880px){.ro .features{grid-template-columns:1fr;}}
.ro .feat{background:var(--panel);border:1px solid var(--line);border-radius:var(--radius);padding:22px;transition:transform .16s ease,border-color .16s ease;}
.ro .feat:hover{transform:translateY(-3px);border-color:var(--line-strong);}
.ro .feat .ic{width:40px;height:40px;border-radius:11px;display:grid;place-items:center;font-size:19px;
  background:color-mix(in srgb,var(--gold) 14%,transparent);border:1px solid color-mix(in srgb,var(--gold) 26%,transparent);}
.ro .feat h3{font-size:16px;margin:15px 0 6px;font-weight:700;}
.ro .feat p{color:var(--muted);font-size:14px;margin:0;}
.ro .pricing{background:var(--panel-2);border-top:1px solid var(--line);border-bottom:1px solid var(--line);}
.ro .tiers{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:42px;align-items:stretch;}
@media (max-width:980px){.ro .tiers{grid-template-columns:repeat(2,1fr);}}
@media (max-width:560px){.ro .tiers{grid-template-columns:1fr;}}
.ro .tier{position:relative;background:var(--panel);border:1px solid var(--line);border-radius:var(--radius);padding:24px 22px;display:flex;flex-direction:column;}
.ro .tier.pop{border-color:var(--ember);box-shadow:0 0 0 1px var(--ember),var(--shadow);}
.ro .ribbon{position:absolute;top:-12px;left:22px;background:var(--ember);color:#fff;font-family:var(--mono);
  font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;padding:4px 10px;border-radius:999px;}
.ro .tier .name{font-weight:750;font-size:15px;}
.ro .tier .desc{color:var(--muted);font-size:12.5px;min-height:34px;margin-top:4px;}
.ro .price{margin:16px 0 4px;display:flex;align-items:baseline;gap:3px;}
.ro .price .cur{color:var(--muted);font-size:18px;font-weight:600;}
.ro .price .num{font-size:38px;font-weight:820;letter-spacing:-.03em;font-variant-numeric:tabular-nums;}
.ro .price .per{color:var(--muted);font-size:13px;font-family:var(--mono);}
.ro .tier ul{list-style:none;margin:16px 0 0;padding:16px 0 0;border-top:1px solid var(--line);display:grid;gap:10px;flex:1;}
.ro .tier li{display:flex;gap:9px;font-size:13.5px;color:var(--text);align-items:flex-start;}
.ro .tier li .tick{color:var(--gold);flex:none;margin-top:1px;}
.ro .tier .buy{margin-top:20px;text-align:center;}
.ro .custom{margin-top:16px;background:var(--panel);border:1px solid var(--line);border-radius:var(--radius);
  padding:22px 24px;display:flex;align-items:center;justify-content:space-between;gap:18px;flex-wrap:wrap;}
.ro .custom .ct{font-weight:720;font-size:16px;}
.ro .custom .cs{color:var(--muted);font-size:13.5px;}
.ro .steps{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:40px;}
@media (max-width:820px){.ro .steps{grid-template-columns:1fr;}}
.ro .step{position:relative;padding:26px 22px;border:1px solid var(--line);border-radius:var(--radius);background:var(--panel);}
.ro .step .n{font-family:var(--mono);font-size:12px;color:var(--ember);letter-spacing:.12em;}
.ro .step h3{font-size:17px;margin:10px 0 6px;font-weight:720;}
.ro .step p{color:var(--muted);font-size:14px;margin:0;}
.ro .subdomain{display:inline-flex;align-items:center;font-family:var(--mono);font-size:13px;margin-top:12px;
  background:var(--bg);border:1px solid var(--line-strong);border-radius:8px;padding:6px 10px;}
.ro .subdomain b{color:var(--gold);}
.ro .final{text-align:center;padding:86px 0;position:relative;}
.ro .final h2{font-size:clamp(28px,4.4vw,44px);letter-spacing:-.03em;font-weight:820;margin:0 auto;max-width:18ch;text-wrap:balance;}
.ro .final p{color:var(--muted);margin:16px auto 0;max-width:46ch;}
.ro .final .cta-row{justify-content:center;}
.ro .rofoot{border-top:1px solid var(--line);padding:40px 0;}
.ro .foot{display:flex;align-items:center;justify-content:space-between;gap:18px;flex-wrap:wrap;}
.ro .foot .powered{font-family:var(--mono);font-size:12px;color:var(--muted);letter-spacing:.04em;}
.ro .foot .powered b{color:var(--gold);}
.ro .foot nav{display:flex;gap:20px;font-size:13.5px;color:var(--muted);}
.ro .foot nav a:hover{color:var(--text);}
.ro :focus-visible{outline:2px solid var(--gold);outline-offset:3px;border-radius:6px;}
@media (prefers-reduced-motion:reduce){.ro .feat,.ro .btn{transition:none;}}
`;

export default function RudrOneLanding() {
  const [theme, setTheme] = useState<"dark" | "light" | undefined>(undefined);
  const flip = () => {
    const cur =
      theme ??
      (typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    setTheme(cur === "dark" ? "light" : "dark");
  };

  return (
    <div className="ro" data-theme={theme}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <header className="rohead">
        <div className="wrap bar">
          <div className="brand"><span className="mark">◈</span> Rudr<b>One</b></div>
          <nav className="top">
            <a className="lnk" href="#features">Features</a>
            <a className="lnk" href="#pricing">Pricing</a>
            <a className="lnk" href="#how">How it works</a>
            <div className="top-actions">
              <button className="toggle" onClick={flip} aria-label="Switch light or dark theme" title="Switch theme">◐</button>
              <a className="btn btn-ghost" href="/admin/login">Sign in</a>
              <a className="btn btn-primary" href="/signup">Start free</a>
            </div>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="glow"></div>
          <div className="wrap hero-inner">
            <div>
              <p className="eyebrow">By {PLATFORM.company} · Made in India</p>
              <h1>Bill it. Sell it. <span className="accent">Be found online.</span></h1>
              <p className="lede">{PLATFORM.name} gives small businesses GST-ready billing, a customer list, and a proper website — on your own address, from one dashboard.</p>
              <div className="cta-row">
                <a className="btn btn-ember btn-lg" href="/signup">Start free — no card</a>
                <a className="btn btn-ghost btn-lg" href="#how">See how it works</a>
              </div>
              <p className="microline"><span className="dot"></span> Live today: <b style={{ color: "var(--text)" }}>{PLATFORM.clientHost("mahadev")}</b> runs a real fabrication business on {PLATFORM.name}.</p>
            </div>

            <div className="mock" role="img" aria-label="Preview of a RudrOne invoice on a business subdomain">
              <div className="mock-bar">
                <i></i><i></i><i></i>
                <span className="url">🔒 <b>mahadev</b>.{PLATFORM.domain}/admin</span>
              </div>
              <div className="mock-body">
                <div className="inv-head">
                  <div>
                    <div className="inv-title">Tax Invoice · MAPF/2025-26/014</div>
                    <div className="inv-sub">Rajesh Patel · Satellite, Ahmedabad</div>
                  </div>
                  <span className="pill">Paid</span>
                </div>
                <div className="rows">
                  <div className="row"><span>Aluminium Sliding Window — 42 sqft</span><span>₹17,640</span></div>
                  <div className="row"><span>uPVC Casement Door — 18 sqft</span><span>₹14,040</span></div>
                  <div className="row"><span>Toughened Glass 8mm — 30 sqft</span><span>₹2,850</span></div>
                </div>
                <div className="inv-total"><span>Total incl. GST</span><span className="amt">₹40,637</span></div>
                <div className="mock-foot">
                  <span className="chip">Share on WhatsApp</span>
                  <span className="chip">Save PDF</span>
                  <span className="chip">Record payment</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="proof">
          <div className="wrap proof-in">
            <span className="liveflag">● Live on {PLATFORM.name}</span>
            <span><b>Mahadev APF</b> — Aluminium, uPVC, Glass and Furniture · Ahmedabad</span>
          </div>
        </div>

        <section className="block" id="features">
          <div className="wrap">
            <div className="head">
              <p className="eyebrow">One place for the whole business</p>
              <h2>Stop juggling a bill book, a photo folder, and a website you can&apos;t edit.</h2>
              <p>Every tool a small manufacturer or shop actually uses — designed to be run from a phone.</p>
            </div>
            <div className="features">
              <div className="feat"><div className="ic">🧾</div><h3>GST-ready invoicing</h3><p>Tax, non-GST and quotation formats with auto invoice numbers per financial year. Round-off, discounts and payments built in.</p></div>
              <div className="feat"><div className="ic">💬</div><h3>WhatsApp-ready</h3><p>Every invoice gets a clean public link your customer can open and save as a PDF — one tap to send.</p></div>
              <div className="feat"><div className="ic">👥</div><h3>Customers and rate list</h3><p>Save customers and your standard rates once, then build invoices in seconds without retyping.</p></div>
              <div className="feat"><div className="ic">🌐</div><h3>Your own website</h3><p>Services, gallery, spaces and reviews — all editable from the same admin. No developer needed.</p></div>
              <div className="feat"><div className="ic">📊</div><h3>Reports that add up</h3><p>Sales, received and dues by period or selection — the numbers you need at tax time.</p></div>
              <div className="feat"><div className="ic">🔑</div><h3>Staff with permissions</h3><p>Add your team and choose exactly which sections each person can open.</p></div>
            </div>
          </div>
        </section>

        <section className="block pricing" id="pricing">
          <div className="wrap">
            <div className="head">
              <p className="eyebrow">Simple pricing · ₹ per month</p>
              <h2>Start free. Upgrade when the business grows.</h2>
              <p>Every plan includes GST invoicing and WhatsApp sharing. No setup fees, cancel anytime.</p>
            </div>

            <div className="tiers">
              <div className="tier">
                <div className="name">Free</div>
                <div className="desc">Basic billing for a single user.</div>
                <div className="price"><span className="cur">₹</span><span className="num">0</span><span className="per">/mo</span></div>
                <ul>
                  <li><span className="tick">✓</span> GST and non-GST invoices</li>
                  <li><span className="tick">✓</span> Quotations / estimates</li>
                  <li><span className="tick">✓</span> WhatsApp invoice links</li>
                  <li><span className="tick">✓</span> 25 invoices / month</li>
                  <li><span className="tick">✓</span> 1 user</li>
                </ul>
                <a className="btn btn-ghost buy" href="/signup">Start free</a>
              </div>

              <div className="tier">
                <div className="name">Plus</div>
                <div className="desc">Billing + reports for a small team.</div>
                <div className="price"><span className="cur">₹</span><span className="num">299</span><span className="per">/mo</span></div>
                <ul>
                  <li><span className="tick">✓</span> Everything in Free</li>
                  <li><span className="tick">✓</span> Sales and payment reports</li>
                  <li><span className="tick">✓</span> Staff accounts and permissions</li>
                  <li><span className="tick">✓</span> 300 invoices / month</li>
                  <li><span className="tick">✓</span> 3 users</li>
                </ul>
                <a className="btn btn-ghost buy" href="/signup">Choose Plus</a>
              </div>

              <div className="tier pop">
                <span className="ribbon">Most popular</span>
                <div className="name">Pro</div>
                <div className="desc">Run the whole business online, with your own website.</div>
                <div className="price"><span className="cur">₹</span><span className="num">799</span><span className="per">/mo</span></div>
                <ul>
                  <li><span className="tick">✓</span> Everything in Plus</li>
                  <li><span className="tick">✓</span> Your own website + gallery</li>
                  <li><span className="tick">✓</span> Customer reviews</li>
                  <li><span className="tick">✓</span> Remove {PLATFORM.name} branding</li>
                  <li><span className="tick">✓</span> Unlimited invoices · 10 users</li>
                </ul>
                <a className="btn btn-ember buy" href="/signup">Choose Pro</a>
              </div>

              <div className="tier">
                <div className="name">Max</div>
                <div className="desc">Unlimited everything, with your own domain.</div>
                <div className="price"><span className="cur">₹</span><span className="num">1499</span><span className="per">/mo</span></div>
                <ul>
                  <li><span className="tick">✓</span> Everything in Pro</li>
                  <li><span className="tick">✓</span> Your own custom domain</li>
                  <li><span className="tick">✓</span> Priority support</li>
                  <li><span className="tick">✓</span> Unlimited users</li>
                  <li><span className="tick">✓</span> 10 GB media storage</li>
                </ul>
                <a className="btn btn-ghost buy" href="/signup">Choose Max</a>
              </div>
            </div>

            <div className="custom">
              <div>
                <div className="ct">Custom — for larger businesses</div>
                <div className="cs">Tailored plan, dedicated onboarding and volume pricing.</div>
              </div>
              <a className="btn btn-primary" href="/signup">Talk to us</a>
            </div>
          </div>
        </section>

        <section className="block" id="how">
          <div className="wrap">
            <div className="head">
              <p className="eyebrow">Live in an afternoon</p>
              <h2>Three steps from bill book to online business.</h2>
            </div>
            <div className="steps">
              <div className="step">
                <div className="n">STEP 01</div>
                <h3>Claim your address</h3>
                <p>Pick a name and you&apos;re instantly live on your own subdomain.</p>
                <div className="subdomain">yourbusiness<b>.{PLATFORM.domain}</b></div>
              </div>
              <div className="step">
                <div className="n">STEP 02</div>
                <h3>Add your work</h3>
                <p>Enter your services, rate list and photos once — they power both your invoices and your website.</p>
              </div>
              <div className="step">
                <div className="n">STEP 03</div>
                <h3>Bill and get found</h3>
                <p>Send GST invoices on WhatsApp, take payments, and let customers find you online.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="final">
          <div className="glow"></div>
          <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
            <h2>Your business deserves more than a bill book.</h2>
            <p>Join {PLATFORM.name} free today. Upgrade the day it pays for itself.</p>
            <div className="cta-row">
              <a className="btn btn-ember btn-lg" href="/signup">Start free</a>
              <a className="btn btn-ghost btn-lg" href="/admin/login">Sign in</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="rofoot">
        <div className="wrap foot">
          <div className="brand"><span className="mark">◈</span> Rudr<b>One</b></div>
          <nav>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#how">How it works</a>
            <a href="/admin/login">Sign in</a>
          </nav>
          <div className="powered">Powered by <b>{PLATFORM.name}</b> · a {PLATFORM.company} product · © 2026</div>
        </div>
      </footer>
    </div>
  );
}
