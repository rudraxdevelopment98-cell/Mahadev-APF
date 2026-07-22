/**
 * Site themes for the RudrOne platform. A theme is just a re-mapping of the
 * Tailwind color tokens (--color-*), so switching one re-skins a business's
 * whole site and admin without touching a single component.
 *
 * Pure module — safe on server and client. "artisan" reproduces the original
 * Mahadev look exactly and is the default, so existing sites are unchanged.
 */

export type ThemeId = "artisan" | "midnight" | "forest" | "rose" | "royal";

export type Theme = {
  id: ThemeId;
  name: string;
  blurb: string;
  colors: {
    ink: string;
    inkSoft: string;
    panel: string;
    gold: string; // the accent token
    goldSoft: string;
    paper: string;
    muted: string;
  };
};

export const THEMES: Theme[] = [
  {
    id: "artisan",
    name: "Artisan",
    blurb: "Black & gold. Bold and premium — the original look.",
    colors: {
      ink: "#0b0b0b",
      inkSoft: "#121212",
      panel: "#161616",
      gold: "#d4af37",
      goldSoft: "#e6c75a",
      paper: "#ffffff",
      muted: "#a0a0a0",
    },
  },
  {
    id: "midnight",
    name: "Midnight",
    blurb: "Deep navy with an electric-blue accent. Clean and modern.",
    colors: {
      ink: "#0a0f1e",
      inkSoft: "#0f1629",
      panel: "#141d33",
      gold: "#5b9dff",
      goldSoft: "#86b8ff",
      paper: "#eef4ff",
      muted: "#8a97b5",
    },
  },
  {
    id: "forest",
    name: "Forest",
    blurb: "Dark green with an emerald accent. Calm and natural.",
    colors: {
      ink: "#08130e",
      inkSoft: "#0d1b14",
      panel: "#12261c",
      gold: "#34d39a",
      goldSoft: "#6fe6b8",
      paper: "#edfcf5",
      muted: "#8fb0a2",
    },
  },
  {
    id: "rose",
    name: "Rose",
    blurb: "Warm plum with a rose-pink accent. Friendly and stylish.",
    colors: {
      ink: "#150a0f",
      inkSoft: "#1f0f16",
      panel: "#2a141d",
      gold: "#ff6f9c",
      goldSoft: "#ff9cbb",
      paper: "#fff0f5",
      muted: "#b892a0",
    },
  },
  {
    id: "royal",
    name: "Royal",
    blurb: "Rich indigo with a violet accent. Luxe and distinctive.",
    colors: {
      ink: "#0e0a1a",
      inkSoft: "#150f26",
      panel: "#1e1533",
      gold: "#b48cff",
      goldSoft: "#cbb0ff",
      paper: "#f3eeff",
      muted: "#a294c2",
    },
  },
];

export const DEFAULT_THEME: ThemeId = "artisan";

export function getTheme(id: string | null | undefined): Theme {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}

/** Inline CSS custom properties that re-skin the site for the given theme. */
export function themeVars(id: string | null | undefined): Record<string, string> {
  const c = getTheme(id).colors;
  return {
    "--color-ink": c.ink,
    "--color-ink-soft": c.inkSoft,
    "--color-panel": c.panel,
    "--color-gold": c.gold,
    "--color-gold-soft": c.goldSoft,
    "--color-paper": c.paper,
    "--color-muted": c.muted,
  };
}
