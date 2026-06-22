"use client";

import { useState } from "react";

export default function HelpHint({
  title = "How it works",
  steps,
}: {
  title?: string;
  steps: string[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="no-print">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 px-3 py-1.5 text-xs text-gold transition-colors hover:bg-gold/10"
      >
        <span className="grid h-4 w-4 place-items-center rounded-full border border-gold/60 text-[10px]">
          ?
        </span>
        {title}
      </button>

      {open && (
        <div className="mt-3 rounded-2xl border border-gold/20 bg-gold/5 p-5">
          <ol className="list-decimal space-y-2 pl-5 text-sm text-muted">
            {steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
