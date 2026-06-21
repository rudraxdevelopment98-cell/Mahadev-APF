import { testimonials } from "./data";

export type ReviewItem = {
  id?: string;
  name: string;
  location: string;
  quote: string;
  rating: number;
};

/** Shown when the owner hasn't added any reviews yet (or DB offline). */
export const defaultReviews: ReviewItem[] = testimonials.map((t) => ({
  name: t.name,
  location: t.role,
  quote: t.quote,
  rating: 5,
}));
