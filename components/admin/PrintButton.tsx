"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="no-print rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-ink hover:bg-gold-soft"
    >
      Print / Save as PDF
    </button>
  );
}
