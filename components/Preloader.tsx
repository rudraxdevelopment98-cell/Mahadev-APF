"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { company } from "@/lib/data";

/** Cinematic loading screen shown briefly on first paint. */
export default function Preloader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDone(true), 1900);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.span
            initial={{ opacity: 0, letterSpacing: "0.5em" }}
            animate={{ opacity: 1, letterSpacing: "0.18em" }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            className="font-heading text-2xl font-bold uppercase text-paper md:text-4xl"
          >
            {company.name}
          </motion.span>

          <div className="mt-6 h-px w-48 overflow-hidden bg-white/10">
            <motion.div
              className="h-full bg-gold"
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ duration: 1.6, ease: "easeInOut" }}
            />
          </div>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.4 }}
            className="mt-4 text-xs uppercase tracking-[0.3em] text-muted"
          >
            {company.tagline}
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
