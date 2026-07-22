export type CategoryId =
  | "timeline"
  | "heart"
  | "energy"
  | "places"
  | "rituals";

export type Category = {
  id: CategoryId;
  label: string;
  blurb: string;
};

export const categories: Category[] = [
  {
    id: "timeline",
    label: "The Nine",
    blurb: "Life-stage chapters — nine squares for the songs of a life.",
  },
  {
    id: "heart",
    label: "Heart",
    blurb: "Love, loss, people, and the feelings that linger.",
  },
  {
    id: "energy",
    label: "Energy",
    blurb: "Drive, fire, focus, and nights that refuse to end.",
  },
  {
    id: "places",
    label: "Places",
    blurb: "Rooms, roads, and cities that still have a soundtrack.",
  },
  {
    id: "rituals",
    label: "Rituals",
    blurb: "Mornings, rain days, and the loops you return to.",
  },
];

export function getCategory(id: CategoryId): Category | undefined {
  return categories.find((c) => c.id === id);
}
