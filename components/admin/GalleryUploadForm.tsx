"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  createGalleryItem,
  type GalleryFormState,
} from "@/lib/actions/gallery-actions";

const input =
  "w-full rounded-lg border border-white/10 bg-ink/60 px-3 py-2 text-sm outline-none focus:border-gold";

export default function GalleryUploadForm() {
  const [state, action, pending] = useActionState<GalleryFormState, FormData>(
    createGalleryItem,
    {},
  );
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) ref.current?.reset();
  }, [state.ok]);

  return (
    <form
      ref={ref}
      action={action}
      className="h-fit space-y-3 rounded-2xl border border-white/10 bg-ink-soft/40 p-5"
    >
      <h2 className="font-heading text-lg font-bold">Add Photo</h2>

      <div>
        <label className="mb-1 block text-xs uppercase tracking-wide text-muted">
          Upload from phone / computer
        </label>
        <input
          name="image"
          type="file"
          accept="image/*"
          className="w-full text-sm text-muted file:mr-3 file:rounded-full file:border-0 file:bg-gold file:px-4 file:py-2 file:text-sm file:font-semibold file:text-ink"
        />
      </div>

      <p className="text-center text-xs text-muted">— or —</p>

      <input name="imageUrl" placeholder="Paste an image link (https://…)" className={input} />
      <input name="caption" placeholder="Caption (e.g. Modular kitchen, Satellite)" className={input} />
      <input name="category" placeholder="Category (e.g. Kitchen)" className={input} />
      <input name="order" type="number" placeholder="Order (0 = first)" className={input} />

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state.ok && <p className="text-sm text-emerald-300">✓ Photo added.</p>}

      <button
        disabled={pending}
        className="w-full rounded-full bg-gold py-2.5 text-sm font-semibold text-ink hover:bg-gold-soft disabled:opacity-60"
      >
        {pending ? "Adding…" : "Add Photo"}
      </button>
    </form>
  );
}
