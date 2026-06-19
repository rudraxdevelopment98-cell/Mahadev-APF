"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const variants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

type Props = {
  children: ReactNode;
  index?: number;
  className?: string;
  as?: "div" | "section" | "li" | "span";
};

/** Reveal-on-scroll wrapper used across every section. */
export default function Reveal({
  children,
  index = 0,
  className,
  as = "div",
}: Props) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      custom={index}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </Tag>
  );
}
