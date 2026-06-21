import { products } from "./data";

export type ServiceItem = {
  id?: string;
  title: string;
  category: string;
  blurb: string;
  points: string[];
};

/** Used when the owner hasn't added any services yet (or the DB is offline). */
export const defaultServices: ServiceItem[] = products.map((p) => ({
  title: p.title,
  category: p.category,
  blurb: p.blurb,
  points: p.specs.slice(0, 3).map((s) => s.value),
}));
