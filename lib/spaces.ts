import { industries } from "./data";

export type SpaceItem = {
  id?: string;
  name: string;
  body: string;
  imageUrl: string | null;
};

/** Shown when the owner hasn't added any spaces yet (or DB offline). */
export const defaultSpaces: SpaceItem[] = industries.map((i) => ({
  name: i.name,
  body: i.body,
  imageUrl: null,
}));
